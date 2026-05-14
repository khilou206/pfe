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
{//---------------------------------------------------------------------------------------------------
    public function getDashboardStats() {
        try {
            $totalRevenue = Commande::where('status', 'paid')->sum('total_price') ;
            $totalOrders = Commande::count();
            $totalClients = Utilisateur::where('role', 'utilisateur')->count();
            $activeProducts = Produit::count(); 
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
//---------------------------------------------------------------------------------------------------
    public function storeMockup(Request $request)
    {
        $request->validate([
            'prix_base' => 'required|numeric',
            'categorie_mockup' => 'required|string',
            'images' => 'required|array',
            'images.*' => 'required|image',
            'colors' => 'required' 
        ]);

        try {
            DB::beginTransaction();
            $rawColors = $request->colors;
            $colorsArray = is_array($rawColors) ? $rawColors : json_decode($rawColors, true);

            $storedPaths = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $file) {
                    $path = $file->store('mockups', 'public');
                    $storedPaths[] = $path;
                }
            }
            Mockup::create([
                'nom_mockup' => $storedPaths[0] ?? '', 
                'categorie_mockup' => $request->categorie_mockup,
                'prix_base' => $request->prix_base,
                'colors' => $colorsArray 
            ]);
            DB::commit();
            return response()->json(['status' => 'success', 'message' => 'تم الحفظ بنجاح']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'حدث خطأ: ' . $e->getMessage()], 500);
        }
    }
//---------------------------------------------------------------------------------------------------
    public function getAllOrders() {
        try {
        $orders = Commande::with([
        'utilisateur.adresses',
        'produits.design'
    ])->latest()->get();
            return response()->json(['status' => 'success', 'data' => $orders]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    } 
//---------------------------------------------------------------------------------------------------
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
//---------------------------------------------------------------------------------------------------
    public function getAllClients()
    {
        $clients = Utilisateur::where('role', 'utilisateur')->latest()->get();
        return response()->json(['status' => 'success', 'data' => $clients]);
    }


    
}