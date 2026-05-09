import React, { useState, useEffect, useContext, useRef } from 'react';
import { Rnd } from 'react-rnd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { AuthContext } from '../context/AuthContext';
import '../styles/Design.css';
import { Grab } from 'lucide-react';



const Design = () => {

    const navigate = useNavigate();
    const { user, token, designData } = useContext(AuthContext); 
    const captureRef = useRef(null);
    const [isPublic, setIsPublic] = useState(false);
    const savedData = JSON.parse(localStorage.getItem('designData') || 'null');
    const idDesign = designData?.idDesign || savedData?.idDesign;
    const category = designData?.category || savedData?.category || 'notebook';
    const localImage = designData?.localImage || savedData?.localImage;
    const [mockups, setMockups] = useState([]);
    const [selectedMockup, setSelectedMockup] = useState(null);
    const [title, setTitle] = useState('');
    const [selectedSize, setSelectedSize] = useState('M');
    const [designState, setDesignState] = useState({ 
        width: 150,
        height: 150,
        x: 100,
        y: 100,
        selectedColor: '#ffffff'
    });

    useEffect(() => {
        if (category) {
            axios.get(`http://127.0.0.1:8000/api/fetch-mockups/${category}`)
                .then(res => {
                    setMockups(res.data);
                    if (res.data.length > 0) {
                        setSelectedMockup(res.data[0]);
                        try {
                            const colors = JSON.parse(res.data[0].colors);
                              setDesignState(prev => ({ ...prev, selectedColor: colors[0] }));
                        } catch (e) {
                            setDesignState(prev => ({ ...prev, selectedColor: '#ffffff' }));
                        }
                    }
                });
        }
    }, [category]);
    const mockupUrl = selectedMockup 
        ? `http://127.0.0.1:8000/storage/${selectedMockup.nom_mockup}`
        : null;

    const handleSave = async () => {
    if (!captureRef.current || !selectedMockup || !idDesign || !user?.id) {
        alert("بيانات ناقصة: تأكد من تسجيل الدخول واختيار التصميم");
        console.log({ idDesign, userId: user?.id, mockupId: selectedMockup?.id });
        return;
    }
    try {
        const canvas = await html2canvas(captureRef.current, { 
            useCORS: true, 
            scale: 2, 
            backgroundColor: null 
        });
        const screenshot = canvas.toDataURL('image/jpeg', 0.8);
        const payload = {
            id_utilisateur: user.id,
            id_design: idDesign, 
            id_mockup: selectedMockup.id, 
            title: title || 'Produit Halla',
            price: selectedMockup.prix_base,
            size: selectedSize, 
            color: designState.selectedColor,
            final_mockup: screenshot,
            x: Math.round(designState.x),
            y: Math.round(designState.y),
            width: Math.round(designState.width),
            height: Math.round(designState.height),
            is_public: isPublic ? 1 : 0
        };
        await axios.post('http://127.0.0.1:8000/api/save-design', payload, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        navigate('/panier');
    } catch (err) {
        if (err.response && err.response.status === 422) {
            console.log("Validation Errors:", err.response.data.errors);
            alert("خطأ في البيانات: " + JSON.stringify(err.response.data.errors));
        } else {
            alert("Erreur: " + err.message);
        }
    }
};

    return (
        <div className="design-layout">
            <div className="preview-container">
            <div className="capture-box" ref={captureRef} style={{ position: 'relative', width: '450px', height: '450px', backgroundColor: '#fff' }}>
<div 
  className="layer-bg" 
  style={{ 
    backgroundColor: designState.selectedColor, zIndex:'0',
    width: '100%', 
    height: '100%' 
  }} 
/>
{mockupUrl && (
    <div 
        className="layer-color"
        style={{
            backgroundColor: designState.selectedColor,
            WebkitMaskImage: `url(${mockupUrl})`,
            maskImage: `url(${mockupUrl})`,
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat'
        }}
        data-html2canvas-ignore="false" 
    />
)}
{mockupUrl && (
    <img 
        src={`http://127.0.0.1:8000/api/proxy-image?url=${selectedMockup.nom_mockup}`}
        alt="Product Base" 
        className="layer-mockup" style={{  zIndex:'10', }} />

)}
                    <Rnd
                        bounds="parent"
                        size={{ width: designState.width, height: designState.height }}
                       position={{ x: designState.x, y: designState.y }}
                        onDragStop={(e, d) => 
                            setDesignState(prev => ({ ...prev, x: d.x, y: d.y }))
                        }
                        onResizeStop={(e, dir, ref, delta, pos) => {
                            setDesignState(prev => ({
                                ...prev,
                                width: parseInt(ref.style.width),
                                height: parseInt(ref.style.height),
                                ...pos
                            }));
                        }}
                        lockAspectRatio={true}
                        style={{ zIndex: 3 }}>
                        <img 
                            src={localImage} 
                            alt="Logo" 
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                    </Rnd>
                </div>
            </div>
            <div className="controls-panel">

                <h2>● Paramètres</h2>
                <div className="control-group">
                    <label>Taille du Logo: {designState.width}px</label>
                    <input 
                        type="range" min="50" max="300" 
                        value={designState.width} 
                        onChange={(e) => setDesignState(prev => ({ 
                            ...prev, 
                            width: parseInt(e.target.value), 
                            height: parseInt(e.target.value) 
                        }))}
                    />
                </div>
                <div className="control-group">
                    <label>Couleurs disponibles :</label>
                    <div className="color-grid" style={{ marginTop: '10px' }}>
                        {selectedMockup && (() => {
                            try {
                                const availableColors = typeof selectedMockup.colors === 'string' 
                                    ? JSON.parse(selectedMockup.colors) 
                                    : selectedMockup.colors;
                                return availableColors.map((color, index) => (
                                    <div 
                                        key={index}
                                        onClick={() => setDesignState(prev => ({ ...prev, selectedColor: color }))}
                                        className={`color-circle ${designState.selectedColor === color ? 'active' : ''}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ));
                            } catch (e) {
                                return <span>Format de couleur non valide</span>;
                            }
                        })()}
                    </div>
                </div>
                <div className="control-group">
                    <label>Taille</label>
                    <div className="size-options">
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="control-group">
                    <label>Titre</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        className="styled-input" 
                        placeholder="Nom du produit..."

                    />
                </div>
                <div className="price-tag">
                    Prix: <span>{selectedMockup?.prix_base} DH</span>
                </div>
<div className="control-group" style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
    <input 
        type="checkbox" 
        id="is_public" 
        checked={isPublic} 
        onChange={(e) => setIsPublic(e.target.checked)} 
        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
    />
    <label htmlFor="is_public" style={{ fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
        Rendre ce design public (Afficher dans la boutique)
    </label>
</div>
                <button className="btn-envoyer" onClick={handleSave}>
                    ENVOYER AU PANIER
                </button>
            </div>
        </div>
    );
};

export default Design;