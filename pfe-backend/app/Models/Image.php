<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Image extends Model {
    protected $table = 'images';
   protected $fillable = ['nom_image', 'id_design', 'id_mockup', 'id_product', 'x', 'y', 'width', 'height'];
    
    public function produit() {
        return $this->belongsTo(Produit::class, 'id_product', 'id');
    }
}
