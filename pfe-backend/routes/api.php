<?php
use App\Http\Controllers\AdminController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    ProductController,
    AuthController,
    CommandeController,
    OrderController,
    PaymentController,
    UserController,
    UploadController
};


/*
|--------------------------------------------------------------------------
| Public Routes (
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/products/category/{category}', [ProductController::class, 'getByCategory']);
Route::get('/users/{id}/products', [ProductController::class, 'getByUser']);

// Payment & Verification
Route::middleware('auth:sanctum')->group(function () {
Route::post('/payment', [PaymentController::class, 'checkout']);
    Route::get('/verify-payment/{sessionId}', [PaymentController::class, 'verify']);
    Route::post('/commandes', [CommandeController::class, 'store']); // هادي خليها للاحتياط
    Route::get('/my-cart', [ProductController::class, 'getUserCart']);
});
/*
|--------------------------z------------------------------------------------
| Protected Routes (Token / Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // User Profile & Stats
    Route::prefix('user-profile')->group(function () {
        Route::get('/', [UserController::class, 'getProfile']);
        Route::post('/update', [UserController::class, 'updateProfile']);
        Route::get('/stats', [UserController::class, 'getStats']);
    });

    // Orders & Commands
    Route::get('/user-orders', [OrderController::class, 'getUserOrders']);
    Route::post('/commandes', [CommandeController::class, 'store']); 

   // routes/api.php
   Route::post('/save-design', [ProductController::class, 'saveFullDesign']);
Route::post('/upload-design', [UploadController::class, 'uploadDesign']);
    Route::get('/fetch-mockup-products/{cat}', [UploadController::class, 'getProductsByCat']);

  Route::get('/designs/{id}', [UploadController::class, 'showDesign']);
  Route::middleware('auth:sanctum')->get('/my-cart', [ProductController::class, 'getUserCart']);
});
Route::middleware(['auth:sanctum', 'checkAdmin'])->prefix('admin')->group(function () {
    
    // الإحصائيات
    Route::get('/stats', [AdminController::class, 'getDashboardStats']);
    
    // الطلبات
    Route::get('/orders', [AdminController::class, 'getAllOrders']);
    Route::put('/orders/{id}/status', [AdminController::class, 'updateOrderStatus']);
    
    // المستخدمين
    Route::get('/clients', [AdminController::class, 'getAllClients']);
    
});