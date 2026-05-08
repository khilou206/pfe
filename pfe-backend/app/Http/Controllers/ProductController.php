<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use App\Models\Design;
use Illuminate\Support\Facades\Auth;
use App\Models\Mockup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function saveFullDesign(Request $request)
    {
        $request->validate([
            'id_utilisateur' => 'required|exists:utilisateurs,id',
            'id_design'      => 'required|exists:design,id',
            'id_mockup'      => 'required|exists:mockup,id',
            'final_mockup'   => 'required', // Base64 image
            'price'          => 'required|numeric',
            'x'              => 'required',
            'y'              => 'required',
            'width'          => 'required',
            'height'         => 'required',
            'is_public'     => 'required|in:0,1',
        ]);
        try {
            $imageData = $request->final_mockup;
            $fileName = 'halla_design_' . time() . '.jpg';
            $directory = public_path('storage/designs/');
            if (!File::isDirectory($directory)) {
                File::makeDirectory($directory, 0777, true, true);
            }
            $image = preg_replace('#^data:image/\w+;base64,#i', '', $imageData);
            $image = str_replace(' ', '+', $image);
            File::put($directory . $fileName, base64_decode($image));
            $produit = Produit::create([
                'nom_produit'    => $request->title ?? 'Produit Halla',
                'id_utilisateur' => $request->id_utilisateur,
                'id_design'      => $request->id_design,
                'id_mockup'      => $request->id_mockup,
                'x'              => $request->x,
                'y'              => $request->y,
                'width'          => $request->width,
                'height'         => $request->height,
                'taille'         => $request->size,
                'color'          => $request->color,
                'prix'           => $request->price,
                'final_mockup'   => '/storage/designs/' . $fileName,
                'is_public'      => $request->is_public,
            ]);
            return response()->json([
                'message' => 'Design enregistré avec succès !',
                'data'    => $produit
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur serveur: ' . $e->getMessage()
            ], 500);
        }
    }
//===========================================================
    public function getUserCart(Request $request)
    {
        $products = Produit::where('id_utilisateur', $request->user()->id)
            ->orderBy('id', 'DESC')
            ->get();
        return response()->json($products);
    }
//========================================================================
    public function index(Request $request)
    {
        $query = Produit::with(['mockup', 'design'])
            ->where('is_public', true);
        if ($request->has('category')) {
            $category = $request->category;
            $query->whereHas('mockup', function ($q) use ($category) {
                $q->where('categorie_mockup', $category);
            });
        }

        return response()->json(
            $query->latest()->get()
        );
    }
//===================================================================
    public function show($id)
    {
        $produit = Produit::with(['design', 'mockup'])->find($id);
        if (!$produit) {
            return response()->json([
                'message' => 'Produit non trouvé'
            ], 404);
        }
        return response()->json($produit);
    }
//=========================================================================
    public function destroy($id)
    {
        try {
            $produit = Produit::find($id);
            if (!$produit) {
                return response()->json([
                    'message' => 'Produit non trouvé'
                ], 404);
            }
            if ($produit->final_mockup) {
                $imagePath = public_path($produit->final_mockup);

                if (File::exists($imagePath)) {
                    File::delete($imagePath);
                }
            }
            $produit->delete();
            return response()->json([
                'message' => 'Produit supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }
    }
    public function getUserProducts(Request $request)
    {
        try {
            $user = $request->user(); 
            if (!$user) {
                return response()->json(['error' => 'Non autorisé'], 401);
            }
            $products = Produit::where('id_utilisateur', $user->id)
                        ->latest()
                        ->get();
            return response()->json([
                'status' => 'success',
                'data'   => $products
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function getCategories()
    {
        $categories = Mockup::distinct()->pluck('categorie_mockup');
        return response()->json($categories);
    }
}