<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produit extends Model {

    protected $table = 'produits';
    protected $fillable = [
        'nom_produit', 
        'id_utilisateur',
        'id_design',  
        'id_mockup',  
        'x', 'y', 'width', 'height',
        'taille', 
        'prix', 
        'is_public',
        'color',
        'final_mockup',
        'categorie',
        'is_paid'
    ];

//---------------------------------------------------------------------------------------------------
public function design()
{
    return $this->belongsTo(Design::class, 'id_design'); 
}
//---------------------------------------------------------------------------------------------------
public function mockup()
{
    return $this->belongsTo(Mockup::class, 'id_mockup');
}
//---------------------------------------------------------------------------------------------------
    public function createur() {
        return $this->belongsTo(Utilisateur::class, 'id_utilisateur');
    }
//---------------------------------------------------------------------------------------------------
    public function commandes() {
        return $this->belongsToMany(Commande::class, 'commande_items', 'id_produit', 'id_commande')
                    ->withPivot('qte')
                    ->withTimestamps();
    }
    
}