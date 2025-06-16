<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SensorGeral extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'Leituras_Sensor';
    protected $fillable = [
        'data_hora',
        'temperatura_canal1',
        'temperatura_canal2',
        'temperatura_canal3',
        'temperatura_canal4',
        'temperatura_canal5',
        'umidade_canal1',
        'pressao_canal1'
    ];
}
