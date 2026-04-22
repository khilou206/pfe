<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commande extends Model {
    protected $table = 'commandes';

    protected $primaryKey = 'id'; 

    protected $fillable = [
        'id_utilisateur', 
        'id_adresse', 
        'total_price', 
        'status', 
        'stripe_id'
    ];

    public function produits() {
        
        return $this->belongsToMany(Produit::class, 'porter', 'id_commande', 'id_product')
                    ->withPivot('qte', 'color')
                    ->withTimestamps();
    }
}