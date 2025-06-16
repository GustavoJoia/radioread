<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\SensorGeralController;
use App\Http\Controllers\RadiometroController;
use App\Http\Controllers\TesteBD;


Route::get("/teste/banco",[TesteBD::class,'testar']);
Route::get("/sensor/listar",[SensorGeralController::class,'listar']);
Route::get("/radiometro/teste",[RadiometroController::class,'teste']);

Route::post("/sensor/gravar",[SensorGeralController::class,'gravar']);

Route::delete("/sensor/limpar",[SensorGeralController::class,'limpar']);