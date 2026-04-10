<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mockup extends Model {
    protected $table = 'mockup';
    protected $primaryKey = 'id_mockup';
    public function images() { return $this->hasMany(Image::class, 'id_mockup'); }
}
