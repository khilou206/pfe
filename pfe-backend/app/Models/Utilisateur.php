<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Utilisateur extends Authenticatable 
{ 
    use HasApiTokens, Notifiable; 

    protected $table = 'utilisateurs';
    
    protected $fillable = [
        'nom', 
        'role', 
        'email', 
        'mot_de_passe', 
        'tel'
    ];

    protected $hidden = [
        'mot_de_passe',
    ];

    public function getAuthPassword() 
    { 
        return $this->mot_de_passe; 
    }
    
    public function designs(): HasMany
    { 
        return $this->hasMany(Design::class, 'id_utilisateur'); 
    }

    public function adresses(): HasMany 
    { 
        return $this->hasMany(Adresse::class, 'id_utilisateur'); 
    }
}