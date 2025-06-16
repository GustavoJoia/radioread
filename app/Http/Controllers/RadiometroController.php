<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RadiometroController extends Controller
{
    public function teste(){
        return response()->json([
            'message'=>'Sucesso na requisição'
        ],200);
    }
}
