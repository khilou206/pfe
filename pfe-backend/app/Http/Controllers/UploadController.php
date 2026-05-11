<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Design;
use App\Models\Mockup;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class UploadController extends Controller
{
//-----------------------------------------------------------------------------
    public function getAvailableCategories()
    {
        try {
            $categories = Mockup::distinct()->pluck('categorie_mockup');
            return response()->json($categories);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
//------------------------------------------------------------------------------------
    public function getUserDesigns(Request $request)
    {
        try {
            $designs = Design::where('id_utilisateur', $request->user()->id)
                             ->latest()
                             ->get();
            return response()->json($designs);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la récupération des designs'], 500);
        }
    }
//--------------------------------------------------------------------------------------
    public function uploadDesign(Request $request)
    {
        try {
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,svg|max:10240',
                'id_utilisateur' => 'required'
            ]);
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('logos', $fileName, 'public');
                $design = Design::create([
                    'nom_design'     => $fileName, 
                    'date_upload'    => now(),
                    'id_utilisateur' => $request->id_utilisateur,
                ]);
                return response()->json([
                    'status'     => 'success',
                    'id_design'  => $design->id,
                    'nom_design' => $fileName,
                    'full_url'   => asset('storage/logos/' . $fileName) 
                ], 201);
            }
            return response()->json(['error' => 'Aucun fichier trouvé'], 400);
        } catch (\Exception $e) {
            Log::error("Upload Error: " . $e->getMessage());
            return response()->json(['error' => 'Erreur d\'upload: ' . $e->getMessage()], 500);
        }
    }
//--------------------------------------------------------------------------------------
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