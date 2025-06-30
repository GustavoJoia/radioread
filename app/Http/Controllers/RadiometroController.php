<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use MongoDB\Client;

class RadiometroController extends Controller
{
    public function teste(){
        return response()->json([
            'message'=>'Sucesso na requisição'
        ],200);
    }

    public function listar(){
        try {
            
            $client = new Client(env('DB_URI'));
            $collection = $client->selectDatabase('Leituras')->selectCollection('Leituras_Radiometro');
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
            $collection = $client->selectDatabase('Leituras')->selectCollection('Leituras_Radiometro');
            date_default_timezone_set('America/Sao_Paulo');

            $dados = [
                'data_hora'=> date('Y-m-d H:i:s'),
                'tensaoVM'=>$request->input('tensaoVM'),
                'tensaoVD'=>$request->input('tensaoVD'),
                'tensaoAZ'=>$request->input('tensaoAZ'),
                'tensaoAM'=>$request->input('tensaoAM'),
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
            $collection = $client->selectDatabase('Leituras')->selectCollection('Leituras_Radiometro');

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
