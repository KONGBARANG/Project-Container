<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ShopController;
use App\Http\Middleware\AdminOnly;
use App\Http\Middleware\TokenAuth;
use Illuminate\Support\Facades\Route;

Route::get('/products', [ShopController::class, 'products']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/admin/login', [AuthController::class, 'adminLogin']);

Route::middleware(TokenAuth::class)->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/checkout', [ShopController::class, 'checkout']);
    Route::get('/my-orders', [ShopController::class, 'myOrders']);

    Route::middleware(AdminOnly::class)->prefix('admin')->group(function () {
        Route::get('/orders', [AdminController::class, 'orders']);
        Route::post('/products', [AdminController::class, 'storeProduct']);
        Route::put('/products/{product}', [AdminController::class, 'updateProduct']);
        Route::delete('/products/{product}', [AdminController::class, 'destroyProduct']);
    });
});