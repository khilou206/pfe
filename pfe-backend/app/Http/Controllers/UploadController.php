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
            
            // 1. الخطأ الأول: $fileName ما كنتيش معرفها
            $fileName = time() . '_' . $file->getClientOriginalName();
            
            // 2. الخطأ الثاني: استعملت $path فالتخزين ولكن ما استعملتيهاش فالداتابيز
            $path = $file->storeAs('logos', $fileName, 'public');
            
            // 3. الخطأ الثالث: الـ ID فالداتابيز عندك سميتو id_design ماشي id
            $design = Design::create([
                'nom_design'     => $fileName, // دابا مريغلة
                'date_upload'    => now(), 
                'id_utilisateur' => $request->id_utilisateur,
            ]);

            return response()->json([
                'status' => 'success',
                'id_design' =>$design->id, 
                'nom_design' => $design->nom_design,// استعمل السمية اللي فالداتابيز
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