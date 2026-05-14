<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commande extends Model {

    protected $table = 'commandes';
    protected $fillable = ['id_utilisateur', 'id_adresse', 'reference_commande', 'total_price', 'status'];

//---------------------------------------------------------------------------------------------------
    public function adresse() 
    {
        return $this->belongsTo(Adresse::class, 'id_adresse');
    }
//---------------------------------------------------------------------------------------------------
    public function produits()
    {
        
        return $this->belongsToMany(Produit::class, 'commande_items', 'id_commande', 'id_produit')
                    ->withPivot('qte'); 
    }
//---------------------------------------------------------------------------------------------------
    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_utilisateur');
    }
    
    
}