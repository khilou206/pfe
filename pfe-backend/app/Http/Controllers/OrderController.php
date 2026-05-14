<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
//---------------------------------------------------------------------------------------------------
    public function getUserOrders()
    {
        $userId = Auth::id();
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
        ->latest() 
        ->get();
        return response()->json([
            'status' => 'success',
            'data' => $orders
        ]);
    }
//---------------------------------------------------------------------------------------------------
    public function getAllOrdersForAdmin()
    {
        $orders = Commande::with([
            'utilisateur:id,nom,email',
            'produits' => function ($query) {
                $query->with([
                    'mockup',
                    'design',
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