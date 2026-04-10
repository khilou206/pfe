<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commande extends Model {
    protected $table = 'commandes';
    protected $primaryKey = 'id_commande';

    // هادي مهمة لـ React: كتجبد السلعة لي فوسط الكوموند
    public function produits() {
        return $this->belongsToMany(Produit::class, 'porter', 'id_commande', 'id_product')
                    ->withPivot('qte', 'color');
    }
}
