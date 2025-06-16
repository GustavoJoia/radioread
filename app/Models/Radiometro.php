<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Radiometro extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'Leituras_Radiometro';
    protected $fillable = [
        'data_hora',
        'tensaoVM',
        'tensaoVD',
        'tensaoAZ',
        'tensaoAM',
        'mediaMovelACD',
    ];
}
