<?php

namespace App\Http\Controllers;

use App\Models\SensorGeral;
use Illuminate\Http\Request;
use MongoDB\Client;
use MongoDB\Laravel\Eloquent\Casts\ObjectId;

class SensorGeralController extends Controller
{
    public function listar(){
        try {
            
            $client = new Client(env('DB_URI'));
            $collection = $client->selectDatabase('Leituras')->selectCollection('Leituras_Sensor');
            $leituras = iterator_to_array($collection->find());
            
            return response()->json($leituras,200);

        } catch (\Exception $e) {
            return response()->json([
                'message'=>'Houve um erro no acesso ao banco de dados!',
                'error'=>$e->getMessage()
            ],500);
        }
    }

    public function gravar(Request $request){
        try {

            $client = new Client(env('DB_URI'));
            $collection = $client->selectDatabase('Leituras')->selectCollection('Leituras_Sensor');

            $dados = [
                'data_hora'=> $request->input('data_hora'),
                'temperatura_canal1'=>$request->input('temperatura_canal1'),
                'temperatura_canal2'=>$request->input('temperatura_canal2'),
                'temperatura_canal3'=>$request->input('temperatura_canal3'),
                'temperatura_canal4'=>$request->input('temperatura_canal4'),
                'temperatura_canal5'=>$request->input('temperatura_canal5'),
                'umidade_canal1'=>$request->input('umidade_canal1'),
                'pressao_canal1'=>$request->input('pressao_canal1')
            ];

            $result = $collection->insertOne($dados);

            return response()->json([
                'message'=>'Gravação de leitura bem sucedida!',
            ],200);
            
        } catch (\Exception $e) {
            return response()->json([
                'message'=>'Houve um erro no acesso ao banco de dados!',
                'error'=>$e->getMessage()
            ],500);
        }
    }

    public function limpar(){
        try {
            
            $client = new Client(env('DB_URI'));
            $collection = $client->selectDatabase('Leituras')->selectCollection('Leituras_Sensor');

            $result = $collection->deleteMany([])->getDeletedCount();

            return response()->json([
                'message'=>"Limpeza concluida, dados excluídos:",
                'dados'=>$result
            ],200);

        } catch (\Exception $e) {
            return response()->json([
                'message'=>'Houve um erro no acesso ao banco de dados!',
                'error'=>$e->getMessage()
            ],500);
        }
    }

}
