<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class TempRead extends Eloquent
{

    protected $connection = 'mongodb';
    protected $collection = 'Teste';

    protected $fillable = [
        'temperatura',
        'umidade',
        'irradiancia',
        'data_hora'
    ];

}
