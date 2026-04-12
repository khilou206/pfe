import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd'; // هادي هي اللي ناقصاك وموقفة الصفحة
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../styles/Design.css';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const Design = () => {
    const { user, token } = useContext(AuthContext); // استعمل الـ Context ناضي
    const navigate = useNavigate(); // ضروري باش تخدم navigate('/')
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const idDesign = queryParams.get('id');
    const category = queryParams.get('cat') || 'T-shirt';

    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [selectedColor, setSelectedColor] = useState('white');
    const [logoUrl, setLogoUrl] = useState(''); // غنجيبوه من الـ API بـ idDesign

    const [designState, setDesignState] = useState({
        width: 120,
        height: 120,
        x: 140,
        y: 150,
    });

    // مابين الـ Category والسمية ديال الصورة في folder public/img
const getProductImage = () => {
    const mapping = {
        'T-shirt': 'th1',
        'sweatshirt': 'hd1',
        'chaier': 'bk1', // ح
        'horloge': 'rg1', 
        'tapis souris': 'tp1', 
        'pochette': 'ph1'
    };

    const baseName = mapping[category] || 'th1';
    
    
    
    const colorSuffix = selectedColor === 'white' ? '' : `_${selectedColor}`;
    
    
    const extension = (category === 'horloge' || category === 'tapis souris') ? '.png' : '.jpg';

    return `/img/${baseName}${colorSuffix}${extension}`;
};
useEffect(() => {
    if (idDesign && token) { // تأكد أن الـ token كاين
        axios.get(`http://127.0.0.1:8000/api/designs/${idDesign}`, {
            headers: {
                // ضروري تصيفط الـ Token باش Laravel يخليك تشوف الداتا
                'Authorization': `Bearer ${token}` 
            }
        })
        .then(res => {
            const logoFileName = res.data.nom_design;
            setLogoUrl(`http://127.0.0.1:8000/storage/logos/${logoFileName}`);
        })
        .catch(err => {
            console.error("Error loading logo", err);
            // إلا عطاك 401 هنا، كيعني أن الـ token مات أو غلط
        });
    }
}, [idDesign, token]); // زيد token هنا باش يعاود التيست إلا تبدل
const handleSave = async () => {
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/save-design', {
                id_design: idDesign,
                title: title,
                price: price,
                description: description,
                category: category,
                id_utilisateur: user?.id, // جايبينا من الـ Context
                // Coordinates
                x: designState.x,
                y: designState.y,
                width: designState.width,
                height: designState.height
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert("Produit créé !");
            navigate('/'); // دابا غتخدم ليك
        } catch (err) {
            console.error("Save error", err.response?.data);
        }
    
};
    return (
        <div className="design-page-container">
            <div className="mockup-section">
                <div className="product-canvas" id="capture-area">
                    {/* خلفية المنتج من الـ public folder */}
                    <img src={getProductImage()} alt="Product Base" className="base-product-img" />
                    
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
                        <div className="logo-wrapper">
                            {/* هنا كتحط اللوغو اللي رفع المستعمل */}
                          <img src={logoUrl || "/img/placeholder_logo.png"} alt="User Logo" style={{ width: '100%', height: '100%' }} />
                        </div>
                    </Rnd>
                </div>
            </div>

            <div className="params-section">
                <h3>● Paramètres</h3>
                <div className="input-group">
                    <label>Titre de produit</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="input-group">
                    <label>Prix de produit</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>

                <div className="color-selector">
                    <label>Choisir votre couleur principale :</label>
                    <div className="colors">
    {['white', 'black', 'blue', 'red', 'pink', 'olive'].map(color => (
        <span 
            key={color} 
            className={`color-dot ${color} ${selectedColor === color ? 'active' : ''}`}
            onClick={() => setSelectedColor(color)} // هنا غتبدل التصويرة تلقائياً
            style={{ backgroundColor: color }}
        ></span>
    ))}
</div>
                </div>

                <div className="input-group">
                    <label>Ajouter votre description :</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>

                <button className="btn-send" onClick={handleSave}>Envoyer</button>
            </div>
        </div>
    );
};

export default Design;