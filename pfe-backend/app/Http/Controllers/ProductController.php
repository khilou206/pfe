<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use App\Models\Mockup;
use App\Models\Design;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    /**
     * Enregistrer le design final (Screenshot + Data)
     */
    public function saveFullDesign(Request $request)
    {
        $request->validate([
            'id_utilisateur' => 'required',
            'id_design'      => 'required|exists:design,id',
            'id_mockup'      => 'required|exists:mockup,id',
            'final_mockup'   => 'required', // Base64 men html2canvas
            'price'          => 'required|numeric',
            'x'              => 'required',
            'y'              => 'required',
            'width'          => 'required',
            'height'         => 'required',
            'is_public'      => 'required|in:0,1',
        ]);

        try {
            // 1. Traitement de l'image Base64
            $imageData = $request->final_mockup;
            
            // Nettoyage du format Base64 (png ou jpeg)
            if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $type)) {
                $imageData = substr($imageData, strpos($imageData, ',') + 1);
                $type = strtolower($type[1]); // jpg, png, etc.
            } else {
                throw new \Exception('Format d\'image invalide');
            }

            $imageData = base64_decode($imageData);
            if ($imageData === false) {
                throw new \Exception('Décodage base64 échoué');
            }

            // 2. Stockage de l'image
            $fileName = 'design_' . time() . '_' . uniqid() . '.' . $type;
            $filePath = 'designs/' . $fileName;

            // Utilisation du Disk Public (plus propre que public_path manuel)
            Storage::disk('public')->put($filePath, $imageData);

            // 3. Création du produit dans la DB
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
                'final_mockup'   => '/storage/' . $filePath, // Link lli kiy-mchi l-React
                'is_public'      => $request->is_public,
            ]);

            return response()->json([
                'status'  => 'success',
                'message' => 'Design enregistré avec succès !',
                'data'    => $produit
            ], 201);

        } catch (\Exception $e) {
            Log::error("Erreur SaveDesign: " . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur serveur: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Liste des produits publics (Boutique)
     */
    public function index(Request $request)
    {
        $query = Produit::with(['mockup', 'design'])->where('is_public', 1);

        if ($request->has('category')) {
            $category = $request->category;
            $query->whereHas('mockup', function ($q) use ($category) {
                $q->where('categorie_mockup', $category);
            });
        }

        return response()->json($query->latest()->get());
    }

    /**
     * Produits d'un utilisateur spécifique (Panier/Profil)
     */
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
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }


    /**
     * Détails d'un produit
     */
    public function show($id)
    {
        $produit = Produit::with(['design', 'mockup'])->find($id);
        if (!$produit) {
            return response()->json(['message' => 'Produit non trouvé'], 404);
        }
        return response()->json($produit);
    }

    /**
     * Supprimer un produit et son image
     */
    public function destroy($id)
    {
        try {
            $produit = Produit::find($id);
            if (!$produit) {
                return response()->json(['message' => 'Produit non trouvé'], 404);
            }

            // Supprimer le fichier physique
            if ($produit->final_mockup) {
                $path = str_replace('/storage/', '', $produit->final_mockup);
                Storage::disk('public')->delete($path);
            }

            $produit->delete();
            return response()->json(['message' => 'Produit supprimé avec succès']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Récupérer les catégories uniques
     */
    public function getCategories()
    {
        $categories = Mockup::distinct()->pluck('categorie_mockup');
        return response()->json($categories);
    }

}