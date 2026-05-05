<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use App\Models\Design;
use App\Models\Mockup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * =========================================================
     * 🎨 SAVE FINAL USER DESIGN (EXPORT FROM CANVAS)
     * =========================================================
     * - Validate incoming request
     * - Decode Base64 image
     * - Save image to storage
     * - Create product record in DB
     */
    public function saveFullDesign(Request $request)
    {
        // 🔍 Validation des données
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

            // 🖼️ 1. Get Base64 image
            $imageData = $request->final_mockup;

            // 📁 2. Generate filename
            $fileName = 'halla_design_' . time() . '.jpg';

            // 📂 3. Ensure directory exists
            $directory = public_path('storage/designs/');

            if (!File::isDirectory($directory)) {
                File::makeDirectory($directory, 0777, true, true);
            }

            // 🧹 4. Clean Base64 string
            $image = preg_replace('#^data:image/\w+;base64,#i', '', $imageData);
            $image = str_replace(' ', '+', $image);

            // 💾 5. Save image to disk
            File::put($directory . $fileName, base64_decode($image));

            // 🧾 6. Create product in database
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

            // ✅ Success response
            return response()->json([
                'message' => 'Design enregistré avec succès !',
                'data'    => $produit
            ], 201);

        } catch (\Exception $e) {

            // ❌ Error handling
            return response()->json([
                'error' => 'Erreur serveur: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * =========================================================
     * 🛒 GET USER CART PRODUCTS
     * =========================================================
     * - Return products of authenticated user
     */
    public function getUserCart(Request $request)
    {
        $products = Produit::where('id_utilisateur', $request->user()->id)
            ->orderBy('id', 'DESC')
            ->get();

        return response()->json($products);
    }

    /**
     * =========================================================
     * 🛍️ GET PUBLIC PRODUCTS (STORE)
     * =========================================================
     * - Filter by category if provided
     */
    public function index(Request $request)
    {
        $query = Produit::with(['mockup', 'design'])
            ->where('is_public', true);

        // 📦 Filter by category
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

    /**
     * =========================================================
     * 🔎 GET SINGLE PRODUCT DETAILS
     * =========================================================
     */
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

    /**
     * =========================================================
     * 🗑️ DELETE PRODUCT (AND IMAGE FILE)
     * =========================================================
     */
    public function destroy($id)
    {
        try {

            $produit = Produit::find($id);

            if (!$produit) {
                return response()->json([
                    'message' => 'Produit non trouvé'
                ], 404);
            }

            // 🧹 Delete image file from storage
            if ($produit->final_mockup) {
                $imagePath = public_path($produit->final_mockup);

                if (File::exists($imagePath)) {
                    File::delete($imagePath);
                }
            }

            // 🗑️ Delete DB record
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
}