import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Upload.css';
import { AuthContext } from '../context/AuthContext';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState('');
  const [availableCats, setAvailableCats] = useState([]); 
  const navigate = useNavigate();
  const { setDesignData } = useContext(AuthContext);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/available-categories');
        setAvailableCats(res.data);
        if (res.data.length > 0) setCategory(res.data[0]); 
      } catch (err) {
        console.error("Erreur categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSend = async () => {
    const token = localStorage.getItem('auth_token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!token) return alert('Veuillez vous connecter');
    if (!file) return alert('Veuillez sélectionner un modèle.');

    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', category.toLowerCase());
    formData.append('id_utilisateur', user?.id_utilisateur || user?.id);

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/upload-design', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.id_design) {
        const data = {
          idDesign: res.data.id_design,
          category: category.toLowerCase(),
          localImage: preview, 
          nomDesign: res.data.nom_design 
        };

        setDesignData(data);
        localStorage.setItem('designData', JSON.stringify(data));
        navigate('/product-design');
      }
    } catch (err) {
      alert(  " Erreur de chargement : " + (err.response?.data?.error || "Error"));
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-card">
        <img src="imgs/print.png" alt="" className='tofo' />
        <div className="drop-zone">
          <input type="file" accept="image/*" onChange={handleFileChange} id="upload" hidden />
          {preview ? (
            <img src={preview} alt="Preview" className="upload-preview" />
          ) : (
            <div className="upload-placeholder">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
              <p>Faites glisser votre logo ici</p></div>
          )}
          <label htmlFor="upload" className="btn-upload">Sélection du logo</label>
        </div>

        <div className="upload-category-wrapper">
          <label className="upload-category-label">Que souhaitez-vous imprimer ?</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="upload-select">
            {availableCats.map((cat, index) => (
              <option key={index} value={cat}>{cat.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <button onClick={handleSend} className="btn-send">Commencez à concevoir dès maintenant</button>
      </div>
    </div>
  );
};

export default Upload;