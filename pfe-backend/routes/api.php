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

// جلب المنتجات النهائية (التي صممها المستخدمون ونشروها)
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/products/category/{category}', [ProductController::class, 'getByCategory']);

/*
|--------------------------------------------------------------------------
| Protected Routes (User)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) { return $request->user(); });

    // Profile
    Route::prefix('user-profile')->group(function () {
        Route::get('/', [UserController::class, 'getProfile']);
        Route::post('/update', [UserController::class, 'updateProfile']);
        Route::get('/stats', [UserController::class, 'getStats']);
    });

    // Design & Upload Logic
    Route::post('/upload-design', [UploadController::class, 'uploadDesign']);
    Route::get('/designs/{id}', [UploadController::class, 'showDesign']);
    
    // المبدأ الجديد: جلب الموكابات (التيشرتات الخام) بناءً على الكاتيغوري
    Route::get('/fetch-mockups/{cat}', [UploadController::class, 'getMockupsByCat']); 
    Route::post('/products/save-design', [ProductController::class, 'saveFullDesign']);
    // حفظ المنتج النهائي بعد التصميم
  

    // Orders & Payment

    Route::post('/commandes', [CommandeController::class, 'store']); 
    Route::post('/payment', [PaymentController::class, 'checkout']);
    Route::get('/verify-payment/{sessionId}', [PaymentController::class, 'verify']);
});
Route::middleware('auth:sanctum')->group(function () {
    // السلة (Panier)
    Route::get('/user-cart', [ProductController::class, 'getUserCart']);
    
    // الطلبيات (Orders)
    Route::get('/user-orders', [OrderController::class, 'getUserOrders']);
    
    // حفظ التصميم
    Route::post('/save-design', [ProductController::class, 'saveFullDesign']);
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'checkAdmin'])->prefix('admin')->group(function () {
    
    // 1. الإحصائيات - خاص تكون السمية getDashboardStats كيفما عندك في الـ Controller
    Route::get('/stats', [AdminController::class, 'getDashboardStats']);
    
    // 2. الطلبيات - ركز هنا! في الـ React عيطتي لـ /api/admin/orders
    // خاص الـ Method تكون getAllOrders (أو getAllOrdersForAdmin) على حسب شنو سميتيها في AdminController
    Route::get('/orders', [AdminController::class, 'getAllOrders']); 
    
    // 3. تحديث الحالة
    Route::put('/orders/{id}/status', [AdminController::class, 'updateOrderStatus']);
    
    // 4. إدارة الموكابات
    Route::post('/mockups', [AdminController::class, 'storeMockup']);
    Route::get('/mockups/list', function() { 
        return \App\Models\Mockup::latest()->get(); 
    });

    // 5. إدارة الزبناء
    Route::get('/clients', [AdminController::class, 'getAllClients']);
    Route::delete('/clients/{id}', [AdminController::class, 'deleteClient']);
});
// جلب الكاتيغوريز لصفحة الرفع
Route::get('/available-categories', [UploadController::class, 'getAvailableCategories']);

// رفع التصميم
Route::post('/upload-design', [UploadController::class, 'uploadDesign']);

// جلب الموكابات لصفحة التصميم
Route::get('/fetch-mockups/{cat}', [UploadController::class, 'getMockupsByCat']);
Route::delete('/products/{id}', [ProductController::class, 'destroy'])->middleware('auth:sanctum');
