<?php

namespace App\Http\Controllers;
use App\Models\Commande;
use App\Models\CommandeItem;
use App\Models\Utilisateur;
use App\Models\Produit;
use App\Models\Mockup;
use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * 1. Bord: إحصائيات سريعة للـ Dashboard
     */
    // AdminController.php - نسخة مصلحة
public function getDashboardStats() {
    try {
        // 1. المداخيل وعدد الطلبات باستعمال الموديل Commande
        $totalRevenue = Commande::where('status', 'paid')->sum('total_price') ?? 0;
        $totalOrders = Commande::count();

        // 2. عدد الزبناء باستعمال الموديل Utilisateur
        $totalClients = Utilisateur::where('role', 'utilisateur')->count();

        // 3. المنتجات النشطة باستعمال الموديل Produit
        // ملاحظة: تأكد أن جدول produits فيه column سميتها is_active، وإلا حيد الـ where
        $activeProducts = Produit::count(); 

        // 4. الطلبيات حسب الأيام (7 أيام الأخيرة)
        $ordersByDay = Commande::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_revenue' => (float)$totalRevenue,
                'total_orders' => $totalOrders,
                'total_clients' => $totalClients,
                'active_products' => $activeProducts,
                'ordersByDay' => $ordersByDay
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}



    /**
     * 2. Gestion des Mockups: إضافة منتج خام جديد (تيشرت، كاس...)
     */
public function storeMockup(Request $request)
{
    // 1. التحقق من البيانات
    $request->validate([
        'prix_base' => 'required|numeric',
        'categorie_mockup' => 'required|string',
        'images' => 'required|array',
        'images.*' => 'required|image',
        'colors' => 'required' 
    ]);

    try {
        DB::beginTransaction();

        // 2. معالجة مصفوفة الألوان
        $rawColors = $request->colors;
        $colorsArray = is_array($rawColors) ? $rawColors : json_decode($rawColors, true);

        // 3. تخزين الصور في المجلد (Storage)
        // بما أننا لا نملك جدول صور، سنخزن المسارات في مصفوفة أو نكتفي بالصورة الأولى كواجهة
        $storedPaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('mockups', 'public');
                $storedPaths[] = $path;
            }
        }

        // 4. إنشاء سجل الـ Mockup (حسب المايجريشن الجديدة)
        // سنضع أول صورة تم رفعها كـ nom_mockup
        Mockup::create([
            'nom_mockup' => $storedPaths[0] ?? '', 
            'categorie_mockup' => $request->categorie_mockup,
            'prix_base' => $request->prix_base,
            'colors' => $colorsArray // سيتم تخزينه كـ JSON
        ]);

        DB::commit();
        return response()->json(['status' => 'success', 'message' => 'تم الحفظ بنجاح']);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['error' => 'حدث خطأ: ' . $e->getMessage()], 500);
    }
}
    /**
     * 3. Gestion des Commandes: جلب الطلبات مع معلومات الطباعة (x, y, width, height)
     */
   // AdminController.php

// App\Http\Controllers\AdminController.php

public function getAllOrders() {
    try {
        // جرب هادي هي الأولى، إيلا خدمات يعني المشكل كان غير فـ العلاقات (With)
      $orders = Commande::with([
    'utilisateur',
    'produits.design' // 🔥 مهم بزاف
])->latest()->get();
        return response()->json(['status' => 'success', 'data' => $orders]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
} /**
     * 4. تحديث حالة الطلب وإرسال تنبيه (مثلا لشحن السلعة)
     */
    public function updateOrderStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,paid,failed,shipped,delivered'
        ]);

        $order = Commande::findOrFail($id);
        $order->update(['status' => $request->status]);

        return response()->json([
            'status' => 'success', 
            'message' => 'Statut mis à jour',
            'new_status' => $request->status
        ]);
    }

    /**
     * 5. Gestion des Clients: جلب وحذف المستخدمين
     */
    public function getAllClients()
    {
        $clients = Utilisateur::where('role', 'utilisateur')->latest()->get();
        return response()->json(['status' => 'success', 'data' => $clients]);
    }


    
}