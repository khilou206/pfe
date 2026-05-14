<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Design extends Model 
{
    
protected $table = 'design';
protected $fillable = ['nom_design', 'id_utilisateur'];

//--------------------------------------------------------------------------------------------------
public function utilisateur() {
        return $this->belongsTo(Utilisateur::class, 'id_utilisateur');
    }
//---------------------------------------------------------------------------------------------------
    public function produits() {
        return $this->hasMany(Produit::class, 'id_design');
    }
}