<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\SensorGeralController;
use App\Http\Controllers\RadiometroController;
use App\Http\Controllers\TesteBD;


Route::get("/teste/banco",[TesteBD::class,'testar']);
Route::get("/teste/radiometro",[RadiometroController::class,'teste']);
Route::get("/teste/sensor",[SensorGeralController::class,'teste']);

Route::get("/sensor/listar",[SensorGeralController::class,'listar']);
Route::get("/radiometro/listar",[RadiometroController::class,'listar']);

Route::post("/sensor/gravar",[SensorGeralController::class,'gravar']);
Route::post("/radiometro/gravar",[RadiometroController::class,'gravar']);

Route::delete("/sensor/limpar",[SensorGeralController::class,'limpar']);
Route::delete("/radiometro/limpar",[RadiometroController::class,'limpar']);