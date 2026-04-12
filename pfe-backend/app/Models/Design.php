<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Design extends Model 
{
    protected $table = 'design';
    protected $primaryKey = 'id';
    
 protected $fillable = [
    'nom_design',
    'date_upload', // تأكد بلي كاينين هاد الأقواس ''
    'id_utilisateur'
];

    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'id_utilisateur');
    }
}