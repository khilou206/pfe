<?php

namespace App\Models;

// هادو هما المهمين اللي خاصهم يتزادو
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class Utilisateur extends Authenticatable { // ردو كيريث من Authenticatable ماشي Model
    use HasApiTokens, Notifiable; // زيد هاد الترايتس هنا

    protected $table = 'utilisateurs';
    protected $primaryKey = 'id_utilisateur';
    
    // تأكد أن السميات هنا مطابقة للي ف الـ Database
    protected $fillable = ['nom', 'role', 'email', 'mot_de_passe'];

    // هاد الفانكشن ضرورية حيت سميتي العمود mot_de_passe ماشي password
    public function getAuthPassword()
    {
        return $this->mot_de_passe;
    }

    public function adresses() { return $this->hasMany(Adresse::class, 'id_utilisateur'); }
    public function produits() { return $this->hasMany(Produit::class, 'id_utilisateur'); }
    public function commandes() { return $this->hasMany(Commande::class, 'id_utilisateur'); }
}