<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Design;
use App\Models\Mockup;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class UploadController extends Controller
{
    /**
     * Récupérer les catégories de mockups (distinctes)
     */
    public function getAvailableCategories()
    {
        try {
            $categories = Mockup::distinct()->pluck('categorie_mockup');
            return response()->json($categories);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Récupérer les designs d'un utilisateur authentifié
     */
    public function getUserDesigns(Request $request)
    {
        try {
            // Khdemna b $request->user() bach n-dodmno l-id dialli m-connecté
            $designs = Design::where('id_utilisateur', $request->user()->id)
                             ->latest()
                             ->get();

            return response()->json($designs);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la récupération des designs'], 500);
        }
    }

    /**
     * Upload d'un nouveau design (Logo/Image)
     */
    public function uploadDesign(Request $request)
    {
        try {
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,svg|max:10240', // 10MB max
                'id_utilisateur' => 'required'
            ]);

            if ($request->hasFile('image')) {
                $file = $request->file('image');
                
                // Smiya dial l-fichié unique bach ma i-t-ghalltouch
                $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                
                // Stockage f disk public/logos
                $path = $file->storeAs('logos', $fileName, 'public');

                $design = Design::create([
                    'nom_design'     => $fileName, // Ghadi t-khdem b had s-smiya f React m3a /storage/logos/
                    'date_upload'    => now(),
                    'id_utilisateur' => $request->id_utilisateur,
                ]);

                return response()->json([
                    'status'     => 'success',
                    'id_design'  => $design->id,
                    'nom_design' => $fileName,
                    'full_url'   => asset('storage/logos/' . $fileName) // Link lli t-qder t-khdem bih f React nichan
                ], 201);
            }

            return response()->json(['error' => 'Aucun fichier trouvé'], 400);

        } catch (\Exception $e) {
            Log::error("Upload Error: " . $e->getMessage());
            return response()->json(['error' => 'Erreur d\'upload: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Récupérer les mockups par catégorie
     */
    public function getMockupsByCat($cat)
    {
        try {
            $mockups = Mockup::where('categorie_mockup', $cat)->get();
            return response()->json($mockups);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $design = Design::findOrFail($id);

            if ($design->nom_design) {
                Storage::disk('public')->delete('logos/' . $design->nom_design);
            }

            $design->delete();
            return response()->json(['message' => 'Design supprimé avec succès'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la suppression'], 500);
        }
    }
}