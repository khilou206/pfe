<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Design;
use App\Models\Mockup;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function getAvailableCategories()
    {
        $categories = Mockup::distinct()->pluck('categorie_mockup');

        return response()->json($categories);
    }
//=====================================
    public function getUserDesigns(Request $request)
    {
        $designs = \App\Models\Design::where('id_utilisateur', $request->user()->id)
                    ->latest()
                    ->get();

        return response()->json($designs);
    }

    public function uploadDesign(Request $request)
    {
        try {

            $request->validate([
                'image' => 'required|image|max:8000',
                'id_utilisateur' => 'required'
            ]);
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $file->storeAs('logos', $fileName, 'public');
                $design = Design::create([
                    'nom_design'     => $fileName,
                    'date_upload'    => now(),
                    'id_utilisateur' => $request->id_utilisateur,
                ]);
                return response()->json([
                    'status'     => 'success',
                    'id_design'  => $design->id,
                    'nom_design' => $fileName
                ]);
            }
            return response()->json([
                'error' => 'No image uploaded'
            ], 400);

        } catch (\Exception $e) {

            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function getMockupsByCat($cat)
    {
        try {

            $mockups = Mockup::where('categorie_mockup', $cat)->get();
            return response()->json($mockups);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function showDesign($id)
    {
        try {
            $designs = Design::where('id_utilisateur', $id)->latest()->get();
            
            return response()->json($designs, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $design = Design::findOrFail($id);
            $design->delete();
            return response()->json(['message' => 'Supprimé avec succès'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de la suppression'], 500);
        }
    }
    
}