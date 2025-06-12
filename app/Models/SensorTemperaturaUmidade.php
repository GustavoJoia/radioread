<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SensorTemperaturaUmidade extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'Leituras_Sensor';
    protected $fillable = [
        'data_hora',
        'temperatura_canal1',
        'umidade_canal1'
    ];
}
