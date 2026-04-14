import React, { useState, useEffect, useContext } from 'react';
import { Rnd } from 'react-rnd';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { AuthContext } from '../context/AuthContext';
import '../styles/Design.css';

const Design = () => {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    
    // جلب البيانات من URL ومن الـ State المحلي للهرب من CORS
    const queryParams = new URLSearchParams(location.search);
    const idDesign = queryParams.get('id');
    const category = queryParams.get('cat') || 'T-shirt';
    const localImage = location.state?.localImage; 

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedColor, setSelectedColor] = useState('white');
    const [logoUrl, setLogoUrl] = useState(localImage || '');
    const [designState, setDesignState] = useState({ width: 120, height: 120, x: 140, y: 150 });

    // تحديد مسار صورة المنتج الأساسية
    const getProductImage = () => {
        const mapping = { 'T-shirt': 'th1', 'sweatshirt': 'hd1', 'chaier': 'bk1', 'horloge': 'rg1', 'tapis souris': 'tp1', 'pochette': 'ph1' };
        const baseName = mapping[category] || 'th1';
        const colorSuffix = selectedColor === 'white' ? '' : `_${selectedColor}`;
        const extension = (category === 'horloge' || category === 'tapis souris') ? '.png' : '.jpg';
        return `/img/${baseName}${colorSuffix}${extension}`;
    };

    // تحميل اللوغو فقط إذا لم يكن موجوداً محلياً
    useEffect(() => {
        if (!logoUrl && idDesign && token) {
            axios.get(`http://127.0.0.1:8000/api/designs/${idDesign}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => setLogoUrl(`http://127.0.0.1:8000/storage/logos/${res.data.nom_design}`))
            .catch(err => console.error("Logo load error", err));
        }
    }, [idDesign, token, logoUrl]);

   const handleSave = async () => {
    const element = document.getElementById('capture-area');
    if (!element) return;

    try {
        // 1. أول حاجة نصاوبو الـ Canvas بإعدادات نقية
        const canvas = await html2canvas(element, { 
            useCORS: true,
            scale: 2,           // جودة عالية باش ما يتشوهش اللوغو
            backgroundColor: null,
            logging: false,
            width: element.offsetWidth,
            height: element.offsetHeight,
            onclone: (clonedDoc) => {
                const clonedElement = clonedDoc.getElementById('capture-area');
                clonedElement.style.transform = 'none'; 
            }
        });

        // 2. عاد نخرجوا الـ Screenshot
        const screenshot = canvas.toDataURL('image/jpeg', 0.8);

        // 3. نصيفطو البيانات لـ Laravel
        const response = await axios.post('http://127.0.0.1:8000/api/save-design', {
            id_design: idDesign,
            title: title || 'Produit sans titre',
            price: prices[category],
            description: description || '',
            category: category,
            color: selectedColor,
            id_utilisateur: user?.id || user?.id_utilisateur,
            final_mockup: screenshot,
            x: Math.round(designState.x),
            y: Math.round(designState.y),
            width: Math.round(designState.width),
            height: Math.round(designState.height)
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        
        navigate('/panier');
    } catch (err) {
        // تصحيح عرض الخطأ باش ما يبقاش يعطيك undefined
        console.error("Save error details:", err.response?.data || err.message);
        alert("Erreur: " + (err.response?.data?.message || "Vérifiez les champs ou la base de données"));
    }
};

    const prices = { 'T-shirt': 60, 'sweatshirt': 60, 'chaier': 40, 'horloge': 40, 'tapis souris': 30, 'pochette': 30 };

    return (
        <div className="design-page-container">
            <div className="mockup-section">
                <div className="product-canvas" id="capture-area" style={{ position: 'relative', overflow: 'hidden' }}>
                    <img src={getProductImage()} alt="Base" className="base-product-img" />
                    
                    <Rnd
                        size={{ width: designState.width, height: designState.height }}
                        position={{ x: designState.x, y: designState.y }}
                        onDragStop={(e, d) => setDesignState({ ...designState, x: d.x, y: d.y })}
                        onResizeStop={(e, dir, ref, delta, pos) => {
                            setDesignState({
                                width: parseInt(ref.style.width),
                                height: parseInt(ref.style.height),
                                ...pos,
                            });
                        }}
                        bounds="parent"
                        lockAspectRatio={true}
                    >
                        <div className="logo-wrapper" style={{width: '100%', height: '100%',display: 'flex',alignItems: 'center',justifyContent: 'center',overflow: 'hidden'}}>
                           
                        <img 
                            src={logoUrl || "/img/placeholder_logo.png"} 
                            crossOrigin="anonymous"
                            alt="Logo" 
                            style={{ width: '100%', height: '100%',display: 'block'}} />
                        </div>
                    </Rnd>
                </div>
            </div>

            <div className="params-section">
                <h3>● Paramètres</h3>
                <div className="input-group">
                    <label>Taille du Logo: {designState.width}px</label>
                    <input 
    type="range" 
    min="50" 
    max="300" 
    value={designState.width} 
    onChange={(e) => {
        const newSize = parseInt(e.target.value);
        setDesignState({
            ...designState, 
            width: newSize, 
            height: newSize // Hna fin kishwat ila kanti baghih dima square
        });
    }} 
/>
                </div>
                <div className="input-group">
                    <label>Titre de produit</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="input-group">
                    <strong>Prix : {prices[category]} DH</strong>
                </div>
                <div className="color-selector">
                    <label>Couleur :</label>
                    <div className="colors">
                        {['white', 'black', 'blue', 'red', 'pink', 'olive'].map(color => (
                            <span key={color} className={`color-dot ${color} ${selectedColor === color ? 'active' : ''}`}
                                onClick={() => setSelectedColor(color)} style={{ backgroundColor: color }}></span>
                        ))}
                    </div>
                </div>
                <div className="input-group">
                    <label>Description :</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>
                <button className="btn-send" onClick={handleSave}>Envoyer</button>
            </div>
        </div>
    );
};

export default Design;