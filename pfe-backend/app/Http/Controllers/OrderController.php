<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function getUserOrders()
    {
        $userId = Auth::id();

        $orders = DB::table('commandes')
            ->join('porter', 'commandes.id_commande', '=', 'porter.id_commande')
            ->join('produits', 'porter.id_produit', '=', 'produits.id_produit')
            ->where('produits.id_utilisateur', $userId)
            ->select('produits.nom as produit_nom', 'commandes.date_commande', 'porter.qte', 'commandes.statut')
            ->get();

        return response()->json($orders);
    }
}