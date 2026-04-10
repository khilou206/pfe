<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Design extends Model {
    protected $table = 'design';
    protected $primaryKey = 'id_design';
    protected $fillable = ['nom_design', 'id_utilisateur'];
    public function images() { return $this->hasMany(Image::class, 'id_design'); }
}
