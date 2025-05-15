<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SensorRead;

class SensorReadController extends Controller
{

    public function test(Request $request){
        return response()->json([
            'message'=>'Requisições estão funcionando!',
        ],201);
    }
    
    public function store(Request $request){
        
        $validated = $request->validate([
            'temperatura' => 'required|numeric',
            'umidade' => 'required|numeric',
            'irradiancia' => 'required|numeric',
            'data_hora' => 'required|date',
        ]);

        $dado = SensorRead::create($validated);

        return response()->json([
            'message' => 'Dado salvo com sucesso',
            'dado' => $dado
        ], 201);

    }

    public function getAll(Request $request){
        $dados = SensorRead::all();

        return response()->json([
            'message'=>'Dados retornados pelo banco de dados.',
            'data'=>$dados
        ],201);
    }

}
