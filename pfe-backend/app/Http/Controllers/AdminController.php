<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\Utilisateur;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * جلب إحصائيات عامة للـ Dashboard
     */
    public function getDashboardStats()
    {
        try {
            $stats = [
                'total_revenue' => Commande::where('status', 'paid')->sum('total_price'),
                'total_orders' => Commande::count(),
                'total_clients' => Utilisateur::where('role', 'utilisateur')->count(),
                'total_products' => Produit::count(),
                // جلب آخر 5 طلبات مع معلومات المستخدم
                'recent_orders' => Commande::with('utilisateur')
                    ->latest()
                    ->take(5)
                    ->get()
            ];

            return response()->json([
                'status' => 'success',
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * جلب كاع الطلبات مع تفاصيل المنتجات والزبناء
     */
    public function getAllOrders()
    {
        $orders = Commande::with(['utilisateur', 'adresse', 'produits'])
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $orders
        ]);
    }

    /**
     * تحديث حالة الطلبية (مثلاً من pending لـ shipped)
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
            'message' => 'Statut mis à jour avec succès',
            'order' => $order
        ]);
    }

    /**
     * جلب كاع المستخدمين (زبناء فقط)
     */
    public function getAllClients()
    {
        $clients = Utilisateur::where('role', 'utilisateur')->latest()->get();
        return response()->json(['status' => 'success', 'data' => $clients]);
    }
}