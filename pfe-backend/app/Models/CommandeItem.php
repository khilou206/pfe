<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class CommandeItem extends Pivot
{
    
    protected $table = 'commande_items';

    protected $fillable = [
        'id_commande',
        'id_produit',
        'qte'
    ];

    public function commande()
    {
        return $this->belongsTo(Commande::class, 'id_commande');
    }


    public function produit()
    {
        return $this->belongsTo(Produit::class, 'id_produit');
    }
}