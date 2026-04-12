<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;
use App\Models\Image;

class ProductController extends Controller
{

public function saveFullDesign(Request $request)
{
    try {
        // 1. تسجيل المنتج فجدول produits
        $produit = \App\Models\Produit::create([
            'nom_produit'         => $request->title,
            'categorie_produit'   => $request->category,
            'description_produit' => $request->description,
            'prix'                => $request->price,
            'id_utilisateur'      => auth()->id() ?? $request->id_utilisateur, 
        ]);

        // 2. تسجيل البيانات فجدول images
        // هنا كنجمعو اللوغو (id_design) مع الموكاب (id_mockup)
        $image = \App\Models\Image::create([
            'nom_image'  => 'final_' . $request->category . '_' . time(),
            'id_design'  => $request->id_design,
            'id_mockup'  => $request->id_mockup,
            'id_product' => $produit->id // ربط مباشر فجدول images
        ]);

        // 3. الربط فجدول Poster (حسب الـ MCD ديالك هادا هو جدول الربط الأساسي)
        // كنستعملو attach باش نزيدو سطر فجدول poster فيه id_product و id_image
        $produit->images()->attach($image->id);

        return response()->json([
            'status'  => 'success',
            'message' => 'Produit et Design sauvegardés avec succès',
            'data'    => [
                'produit' => $produit,
                'image'   => $image
            ]
        ], 201);

    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
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
    try {
        $limit = $request->query('limit', 4);
        $products = Produit::with('images')
            ->where('categorie_produit', $category)
            ->orderBy('id', 'DESC') // بدل id_product بـ id
            ->limit($limit)
            ->get();

        return response()->json($products);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
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