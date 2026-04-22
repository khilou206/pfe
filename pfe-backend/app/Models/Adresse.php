<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Adresse extends Model {
    protected $table = 'adresses';
    
    protected $primaryKey = 'id'; 
    protected $fillable = ['ville', 'code_postale', 'adresse', 'id_utilisateur'];
    
    public function utilisateur() { 
        return $this->belongsTo(Utilisateur::class, 'id_utilisateur'); 
    }
}