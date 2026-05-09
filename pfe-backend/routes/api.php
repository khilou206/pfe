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
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/admin/mockups', function() {
    return \App\Models\Mockup::all();
});
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/products/category/{category}', [ProductController::class, 'getByCategory']);
Route::get('/categories', [ProductController::class, 'getCategories']);

/*
|--------------------------------------------------------------------------
| Protected Routes (User)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) { return $request->user(); });
    Route::get('/user-designs/{id}', [UploadController::class, 'getUserDesigns']);
    Route::prefix('user-profile')->group(function () {
        Route::get('/', [UserController::class, 'getProfile']);
        Route::post('/update', [UserController::class, 'updateProfile']);
        Route::get('/stats', [UserController::class, 'getStats']);
    });
    Route::post('/upload-design', [UploadController::class, 'uploadDesign']);
    Route::get('/designs/{id}', [UploadController::class, 'showDesign']);
    Route::delete('/design/{id}', [UploadController::class, 'destroy']);
    Route::get('/fetch-mockups/{cat}', [UploadController::class, 'getMockupsByCat']); 
    Route::post('/products/save-design', [ProductController::class, 'saveFullDesign']);

  
    Route::post('/commandes', [CommandeController::class, 'store']); 
    Route::post('/payment', [PaymentController::class, 'checkout']);
    Route::get('/verify-payment/{sessionId}', [PaymentController::class, 'verify']);
    Route::get('/user-products', [ProductController::class, 'getUserProducts']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user-cart', [ProductController::class, 'getUserCart']);
    Route::get('/user-orders', [OrderController::class, 'getUserOrders']);
    Route::post('/save-design', [ProductController::class, 'saveFullDesign']);
});


Route::get('/proxy-image', function (Request $request) {
    $url = $request->query('url');
    $path = str_replace('/storage/', '', $url); 
    
    if (!Storage::disk('public')->exists($path)) return response('Not Found', 404);

    $file = Storage::disk('public')->get($path);
    $type = Storage::disk('public')->mimeType($path);

    return response($file)->header('Content-Type', $type)
                          ->header('Access-Control-Allow-Origin', '*'); // Hna fin k-t-7el CORS
});
/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'checkAdmin'])->prefix('admin')->group(function () {
    
    Route::get('/stats', [AdminController::class, 'getDashboardStats']);
    Route::get('/orders', [AdminController::class, 'getAllOrders']); 
    Route::put('/orders/{id}/status', [AdminController::class, 'updateOrderStatus']);
    Route::post('/mockups', [AdminController::class, 'storeMockup']);
    Route::get('/mockups/list', function() { 
        return \App\Models\Mockup::latest()->get(); 
    });
    Route::get('/clients', [AdminController::class, 'getAllClients']);
    Route::delete('/clients/{id}', [AdminController::class, 'deleteClient']);
});
    Route::get('/available-categories', [UploadController::class, 'getAvailableCategories']);
    Route::post('/upload-design', [UploadController::class, 'uploadDesign']);
    Route::get('/fetch-mockups/{cat}', [UploadController::class, 'getMockupsByCat']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy'])->middleware('auth:sanctum');
