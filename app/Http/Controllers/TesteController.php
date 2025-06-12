<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TesteController extends Controller
{
    public function teste(){
        return response()->json([
            'message'=>'Requisição alcançada!'
        ],201);
    }
}
