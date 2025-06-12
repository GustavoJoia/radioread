<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\SensorTemperaturaUmidadeController;
use App\Http\Controllers\TesteBD;


Route::get("/teste/banco",[TesteBD::class,'testar']);
Route::get("/sensor/listar",[SensorTemperaturaUmidadeController::class,'listar']);

Route::post("/sensor/gravar",[SensorTemperaturaUmidadeController::class,'gravar']);

Route::put("/sensor/atualizar/{id}",[SensorTemperaturaUmidadeController::class,'atualizar']);