<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Produit::query();

        if ($request->has('categorie')) {
            $query->where('categorie_produit', $request->categorie);
        }
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nom', 'LIKE', "%{$search}%")
                ->orWhere('description', 'LIKE', "%{$search}%")
                ->orWhere('categorie_produit', 'LIKE', "%{$search}%");
            });
        }
        return response()->json($query->orderBy('id', 'desc')->get());
    }
//====================================================================================================================
    public function getByCategory(Request $request, $category)
    {
        $limit = $request->query('limit', 4);
        return Produit::with('images')
            ->where('categorie_produit', $category)
            ->orderBy('id_product', 'DESC')
            ->limit($limit)
            ->get();
    }
//====================================================================================================================
    public function show($id)
    {
        $produit = Produit::with('images')->find($id);
        if (!$produit) {
            return response()->json(['message' => 'Not Found'], 404);
        }
        return response()->json($produit);
    }
//====================================================================================================================
    public function getByUser($id)
    {
        return Produit::with('images')
                    ->where('id_utilisateur', $id)
                    ->orderBy('id_product', 'DESC')
                    ->get();
    }
//====================================================================================================================
    public function search(Request $request)
    {
        $query = $request->input('query');
        $produits = Produit::where('nom', 'LIKE', "%{$query}%")
            ->orWhere('description', 'LIKE', "%{$query}%")
            ->get();

        return response()->json($produits);
    }
}