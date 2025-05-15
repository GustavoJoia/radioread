<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class SensorRead extends Eloquent
{
    protected $connection = 'mongodb';
    protected $collection = 'Data';

    protected $fillable = [
        'temperatura',
        'umidade',
        'irradiancia',
        'data_hora'
    ];

    public $timestamps = false;

}