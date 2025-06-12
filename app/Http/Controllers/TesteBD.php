<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use MongoDB\Client;

class TesteBD extends Controller
{
    public function testar(){
        try {
            $client = new Client(env('DB_URI'));
            $database = $client->selectDatabase('Leituras');
            $collection = $database->selectCollection('sessions');
            $count = $collection->countDocuments();
            return response()->json([
                'message'=>'Conexão estabelecida com banco de dados',
                'dados'=>$count
            ],201);
        } catch (\Exception $e) {
            return response()->json([
                'message'=>'Houve um erro na conexão com banco de dados',
                'erro'=> $e->getMessage()
            ],500);
        }
    }
}
