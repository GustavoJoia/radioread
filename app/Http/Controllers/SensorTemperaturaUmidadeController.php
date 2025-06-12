<?php

namespace App\Http\Controllers;

use App\Models\SensorTemperaturaUmidade;
use Illuminate\Http\Request;
use MongoDB\Client;
use MongoDB\Laravel\Eloquent\Casts\ObjectId;

class SensorTemperaturaUmidadeController extends Controller
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
                'umidade_canal1'=>$request->input('umidade_canal1')
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

    public function atualizar(Request $request, String $id){
        try {
            
            $client = new Client(env('DB_URI'));
            $collection = $client->selectDatabase('Leituras')->selectCollection('Leituras_Sensor');

            $objectId = new ObjectId($id);

            $update = [];

            if($request->has('temperatura_canal1')){
                $update['temperatura_canal1'] = $request->input('temperatura_canal1');
            }
            if($request->has('umidade_canal1')){
                $update['umidade_canal1'] = $request->input('umidade_canal1');
            }
            if($request->has('data_hora')){
                $update['data_hora'] = $request->input('data_hora');
            }

            if (empty($update)) {
                return response()->json([
                    'mensagem' => 'Nenhum campo enviado para atualizar.'
                ], 422);
            }

            $collection->updateOne(
                ['_id' => $objectId],
                ['$set' => $update]
            );

            return response()->json([
                'mensagem' => 'Leitura atualizada com sucesso.'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message'=>'Houve um erro no acesso ao banco de dados!',
                'error'=>$e->getMessage()
            ],500);
        }
    }

}
