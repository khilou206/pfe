<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mockup extends Model {

    protected $table = 'mockup';
    protected $fillable = ['nom_mockup', 'prix_base', 'colors', 'categorie_mockup'];
    protected $casts = [
        'colors' => 'array',
    ];
    
//---------------------------------------------------------------------------------------------------
    public function produits() {
        return $this->hasMany(Produit::class, 'id_mockup');
    }
}