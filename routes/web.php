<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\AdminController;

// Client Routes
Route::get('/', [ClientController::class, 'index']);
Route::get('/api/products', [ClientController::class, 'getProducts']);
Route::post('/api/order', [ClientController::class, 'submitOrder']);

// Admin Routes
Route::get('/admin', [AdminController::class, 'index']);
Route::prefix('api/admin')->group(function () {
    Route::get('/products', [AdminController::class, 'getProducts']);
    Route::post('/products', [AdminController::class, 'createProduct']);
    Route::put('/products/{id}', [AdminController::class, 'updateProduct']);
    Route::delete('/products/{id}', [AdminController::class, 'deleteProduct']);
    
    Route::get('/orders', [AdminController::class, 'getOrders']);
    Route::put('/orders/{id}/status', [AdminController::class, 'updateOrderStatus']);
    
    Route::get('/estimations', [AdminController::class, 'getEstimations']);
    Route::post('/estimations', [AdminController::class, 'saveEstimation']);
});