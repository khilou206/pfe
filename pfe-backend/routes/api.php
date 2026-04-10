<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommandeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UploadController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user-profile', [UserController::class, 'getProfile']);
    Route::post('/user-update', [UserController::class, 'updateProfile']);
    Route::get('/user-stats', [UserController::class, 'getStats']);
    Route::get('/user-orders', [OrderController::class, 'getUserOrders']);
});

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/category/{category}', [ProductController::class, 'getByCategory']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/users/{id}/products', [ProductController::class, 'getByUser']);
Route::post('/commandes', [CommandeController::class, 'store']);
Route::post('/create-commande', [CommandeController::class, 'store']);

Route::post('/payment', [PaymentController::class, 'checkout']);

// --- Routes dyal l-Authentification (Backend logic) ---

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/verify-payment/{sessionId}', [PaymentController::class, 'verify']);
Route::post('/create-commande', [CommandeController::class, 'store']);

// Routes protégés (khass l-user ikoun m-connecter bach i-st3mlohom)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::middleware('auth:sanctum')->group(function () {
    // الرفع
    Route::post('/upload-design', [UploadController::class, 'uploadDesign']);
    Route::get('/fetch-mockup-products/{cat}', [UploadController::class, 'getProductsByCat']);
});
    
   
});