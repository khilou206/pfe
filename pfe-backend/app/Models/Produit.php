<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produit extends Model {
    protected $table = 'produits';
    
    protected $fillable = ['nom_produit', 'categorie_produit', 'description_produit', 'prix', 'id_utilisateur'];

    public function images() {
        
        return $this->hasMany(Image::class, 'id_product', 'id');
    }
}