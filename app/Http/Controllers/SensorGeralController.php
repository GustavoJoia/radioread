<?php

namespace App\Http\Controllers;

use App\Models\SensorGeral;
use Illuminate\Http\Request;
use MongoDB\Client;

class SensorGeralController extends Controller
{

    public function teste(){
        return response()->json([
            'message'=>'Sucesso na requisição'
        ],200);
    }

    public function listar(){
        try {
            
            $client = new Client(env('DB_URI'));
            $collection = $client->selectDatabase('Leituras')->selectCollection('Leituras_Sensor');
            $leituras = iterator_to_array($collection->find([],[
                'sort'=>['data_hora'=>1]
            ]));
            
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
            date_default_timezone_set('America/Sao_Paulo');
            
            $dados = [
                'data_hora'=> date('Y-m-d H:i:s'),
                'temperatura_canal1'=>$request->input('temperatura_canal1'),
                'temperatura_canal2'=>$request->input('temperatura_canal2'),
                'temperatura_canal3'=>$request->input('temperatura_canal3'),
                'temperatura_canal4'=>$request->input('temperatura_canal4'),
                'altitude_canal1'=>$request->input('altitude_canal1'),
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

    public function gravarArquivo(Request $request){
        try {

            $client = new Client(env('DB_URI'));
            $collection = $client->selectDatabase('Leituras')->selectCollection('Leituras_Sensor');
            date_default_timezone_set('America/Sao_Paulo');

            $linhas = $request->all();

            foreach ($linhas as $indice => $linha) {
                $leitura = explode(',',$linha);
                $dados = [
                    'data_hora'=> date('Y-m-d H:i:s'),
                    'temperatura_canal1'=>floatval($leitura[0]),
                    'temperatura_canal2'=>floatval($leitura[1]),
                    'temperatura_canal3'=>floatval($leitura[2]),
                    'temperatura_canal4'=>floatval($leitura[3]),
                    'altitude_canal1'=>floatval($leitura[4]),
                    'umidade_canal1'=>floatval($leitura[5]),
                    'pressao_canal1'=>floatval($leitura[6])
                ];
                $result = $collection->insertOne($dados);
            }

            return response()->json([
                'message'=>'Dados inseridos!'
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
