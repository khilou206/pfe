<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    /**
     * =========================================================
     * 🧑‍💻 GET USER ORDERS (HISTORY OF LOGGED USER)
     * =========================================================
    
     */
    public function getUserOrders()
    {
        // 🔐 Get current authenticated user ID
        $userId = Auth::id();

        // 📦 Fetch orders with products relation
        $orders = Commande::with([
            'produits' => function ($query) {
                $query->select(
                    'produits.id',
                    'nom_produit',
                    'prix',
                    'final_mockup',
                    'color',
                    'taille'
                );
            }
        ])
        ->where('id_utilisateur', $userId)
        ->latest() // newest orders first
        ->get();

        // 📤 Return structured response
        return response()->json([
            'status' => 'success',
            'data' => $orders
        ]);
    }

    /**
     * =========================================================
     * 🛠️ ADMIN - GET ALL ORDERS (FULL SYSTEM VIEW)
     * =========================================================
  
     */
    public function getAllOrdersForAdmin()
    {
        $orders = Commande::with([
            // 👤 Client info (only needed fields)
            'utilisateur:id,nom,email',

            // 📦 Products inside each order
            'produits' => function ($query) {
                $query->with([
                    // 🖼️ Mockup related to product
                    'mockup',

                    // 🎨 Design used in product
                    'design',

                    // 🧩 Images + their design relation
                    'images.design'
                ]);
            }
        ])
        ->latest()
        ->get();

        return response()->json([
            'status' => 'success',
            'data' => $orders
        ]);
    }
}