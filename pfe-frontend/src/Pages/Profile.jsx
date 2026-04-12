import React, { useState } from 'react';
import '../styles/profile.css';
import '../styles/style3.css';
import '../styles/recherche.css';

const Profile = () => {
  // State bach n-t7kmo f ina section t-ban (Bord, Design, etc.)
  const [activeTab, setActiveTab] = useState('bord');

  // Function bach t-scrolly l-fouq melli t-cliki (kima check22)
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="profile-page">
      <div className="main" style={{ display: 'flex', paddingLeft: '10%', paddingTop: '10%' }}>
        <div className="profile-image" id="data">
          <img src="/login.png" style={{ width: '130px' }} alt="Avatar" />
        </div>
        <div className="profile-names">
          <h1 className="username" style={{ color: '#171717' }}>Oussama</h1>
          <small className="page-title">Designer</small>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#ffffff', padding: '10px 30px', borderRadius: '0 50px 50px 0', transform: 'translateX(-10px)', marginLeft: 'auto' }}>
          <a href="/upload">
            <img src="/up.png" style={{ width: '100px' }} alt="Upload" />
          </a>
        </div>
      </div>

      <div style={{ paddingLeft: '2%', paddingTop: '2%', display: 'flex' }}>
        {/* Sidebar Actions (Radio Buttons style) */}
        <div className="profile-actions" style={{ width: '15%', position: 'fixed', bottom: '12%' }}>
          <input 
            type="radio" name="tabs" className="message" id="bord" style={{ display: 'none' }} 
            checked={activeTab === 'bord'} onChange={() => handleTabChange('bord')} 
          />
          <label htmlFor="bord" className="check">Bord</label>

          <input 
            type="radio" name="tabs" className="message" id="design" style={{ display: 'none' }} 
            checked={activeTab === 'design'} onChange={() => handleTabChange('design')} 
          />
          <label htmlFor="design" className="check">Design</label>

          <input 
            type="radio" name="tabs" className="message" id="produits" style={{ display: 'none' }} 
            checked={activeTab === 'produits'} onChange={() => handleTabChange('produits')} 
          />
          <label htmlFor="produits" className="check">Produits</label>

          <input 
            type="radio" name="tabs" className="message" id="commandes" style={{ display: 'none' }} 
            checked={activeTab === 'commandes'} onChange={() => handleTabChange('commandes')} 
          />
          <label htmlFor="commandes" className="check">Commandes</label>

          <input 
            type="radio" name="tabs" className="message" id="profil" style={{ display: 'none' }} 
            checked={activeTab === 'profil'} onChange={() => handleTabChange('profil')} 
          />
          <label htmlFor="profil" className="check">Profil</label>
        </div>

        {/* Content Area */}
        <div style={{ width: '97%', paddingLeft: '20%', paddingTop: '2%' }}>
          
          {/* Section: BORD */}
          {activeTab === 'bord' && (
            <div className="data">
              <div className="important-data">
                <section className="data-item" style={{ width: '50%' }}>
                  <h3 className="value">0 MAD</h3>
                  <small className="title" style={{ color: 'black' }}>Revenus disponible</small>
                </section>
                <section className="data-item" style={{ width: '50%' }}>
                  <h3 className="value">0</h3>
                  <small className="title" style={{ color: 'black' }}>Produit acheter</small>
                </section>
              </div>
              <div className="other-data">
                <section className="data-item" style={{ width: '30%' }}>
                  <h3 className="value">12</h3>
                  <small className="title" style={{ color: 'black' }}>Produits</small>
                </section>
                <section className="data-item" style={{ width: '30%' }}>
                  <h3 className="value">5</h3>
                  <small className="title" style={{ color: 'black' }}>Design</small>
                </section>
              </div>
            </div>
          )}

          {/* Section: DESIGN */}
          {activeTab === 'design' && (
            <div id="design2">
              <section id="product1" className="section-p1">
                <h2>Votre design</h2>
                <div className="container">
                  {/* Hna ghadi t-dir l-map dyal les designs dyalk */}
                  <p>Chargement des designs...</p>
                </div>
              </section>
            </div>
          )}

          {/* Section: PRODUITS */}
          {activeTab === 'produits' && (
            <div id="produit">
              <section id="product1" className="section-p1">
                <h2>Votre produits</h2>
                <div className="container">
                  {/* Hna ghadi t-dir l-map dyal les produits dyalk */}
                  <p>Chargement des produits...</p>
                </div>
              </section>
            </div>
          )}

          {/* Section: COMMANDES */}
          {activeTab === 'commandes' && (
            <div id="commande">
              <section id="product1" className="section-p1">
                <h2>Votre commandes</h2>
                <div className="container">
                  <table>
                    <thead>
                      <tr style={{ backgroundColor: '#4d3087', color: '#fff', height: '40px' }}>
                        <td>Produit</td>
                        <td>Date commande</td>
                        <td>Quantite</td>
                        <td>Statut</td>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Mapping dyal les commandes */}
                      <tr>
                        <td>T-shirt Mockup</td>
                        <td>2026-04-04</td>
                        <td>1</td>
                        <td>Payée</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* Section: PROFIL */}
          {activeTab === 'profil' && (
            <div id="profil2">
              <section id="product1" className="section-p1">
                <h2>Votre profil</h2>
                <div className="container">
                  <form>
                    <table className="label">
                      <tbody>
                        <tr>
                          <td><label>Username :</label></td>
                          <td><input type="text" defaultValue="Oussama" /></td>
                        </tr>
                        <tr>
                          <td><label>E-mail :</label></td>
                          <td><input type="text" defaultValue="test@example.com" /></td>
                        </tr>
                        <tr>
                          <td><label>Mot de passe :</label></td>
                          <td><input type="password" /></td>
                        </tr>
                        <tr>
                          <td></td>
                          <td style={{ textAlign: 'center' }}>
                            <input type="submit" value="VALIDER" className="valider" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </form>
                </div>
              </section>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;