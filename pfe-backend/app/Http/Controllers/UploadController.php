<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Design;
use App\Models\Produit;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function getProductsByCat($cat)
    {
        $products = Produit::where('categorie_produit', $cat)->get();
        return response()->json($products);
    }

  public function uploadDesign(Request $request) 
{
    try {
        $request->validate([
           'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:7983',
            'id_utilisateur' => 'required' 
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            
            
            $fileName = time() . '_' . $file->getClientOriginalName();
            
        
            $path = $file->storeAs('logos', $fileName, 'public');
            
            
            $design = Design::create([
                'nom_design'     => $fileName, 
                'date_upload'    => now(), 
                'id_utilisateur' => $request->id_utilisateur,
            ]);

            return response()->json([
                'status' => 'success',
                'id_design' =>$design->id, 
                'nom_design' => $design->nom_design,
                'logo_url' => asset('storage/logos/' . $fileName)
            ]);
        }
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
public function showDesign($id)
{
    $design = Design::find($id);
    if($design) {
        return response()->json($design);
    }
    return response()->json(['message' => 'Not found'], 404);
}
}