import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Upload.css';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState('T-shirt');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSend = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!token) { alert('Please login first!'); return; }
    if (!file)  { alert('Please select an image!'); return; }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', category);
    formData.append('id_utilisateur', user?.id_utilisateur || user?.id);

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/upload-design', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data.id_design) {
       navigate(`/product-design?id=${res.data.id_design}&cat=${category}`, {
    state: { localImage: preview } // كنزيدو هاد السطر باش نصيفطو التصويرة اللي ديجا عندنا
  });
      }
    } catch (err) {
      console.error('Upload Error', err.response?.data);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-card">

        <div className="drop-zone">
          <input type="file" accept="image/*" onChange={handleFileChange} id="upload" hidden />
          {preview ? (
            <img src={preview} alt="Preview" className="upload-preview" />
          ) : (
            <div className="upload-placeholder">
              {/* icon SVG here */}
            </div>
          )}
          <label htmlFor="upload" className="btn-upload">Upload Image</label>
          {!preview && <span className="upload-hint">PNG, JPG, SVG — max 5 MB</span>}
        </div>

        <div className="upload-divider" />

        <div className="upload-category-wrapper">
          <label className="upload-category-label">Sélectionner votre Catégorie</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="upload-select"
          >
            <option value="T-shirt">T-shirt</option>
            <option value="sweatshirt">Sweatshirt</option>
            <option value="chaier">Chaier</option>
            <option value="horloge">Horloge</option>
            <option value="tapis souris">Tapis souris</option>
            <option value="pochette">Pochette</option>
          </select>
        </div>

        <button onClick={handleSend} className="btn-send">Envoyer</button>

      </div>
    </div>
  );
};

export default Upload;