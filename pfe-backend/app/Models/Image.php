<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Image extends Model {
    protected $table = 'images';
    protected $primaryKey = 'id_image';
protected $fillable = ['nom_image', 'id_design', 'id_mockup', 'id_product'];
    public function design() { return $this->belongsTo(Design::class, 'id_design'); }
    public function mockup() { return $this->belongsTo(Mockup::class, 'id_mockup'); }
}
