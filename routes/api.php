<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\SensorReadController;
use App\Http\Controllers\TempReadController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/test',[SensorReadController::class, 'test']);
Route::get('/radiometro/buscar',[SensorReadController::class, 'getAll']);

Route::post('/radiometro/registro', [SensorReadController::class, 'store']);
Route::post('/testes/registro', [TempReadController::class,'store']);