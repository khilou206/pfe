<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Image;
use App\Models\Design;
use App\Models\Produit;
use Illuminate\Support\Facades\Auth;

class UploadController extends Controller
{
    // 1. عرض المنتجات (باش تخدم الـ Mockup fo9hom)
    public function getProductsByCat($cat)
    {
        // كيجيب المنتجات الخام (Raw) اللي غادي نحطو فوقهم الديزاين
        $products = Produit::where('categorie_produit', $cat)->get();
        return response()->json($products);
    }

    // 2. الـ Upload ديال الديزاين (Logo)
    public function uploadDesign(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:png|max:2048', // ضروري PNG باش تبقى الشفافية
            'categorie' => 'required'
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            
            // تسجيل ف جدول images
            $img = Image::create([
                'nom_image' => $file->getClientOriginalName()
            ]);

            // تسمية التصويرة بـ ID ديالها باش ما يتلفوش
            $nom_final = $img->id_image . ".png";
            $img->update(['nom_image' => $nom_final]);

            // تحريك التصويرة لـ public/uploads/designs
            $file->move(public_path('uploads/designs'), $nom_final);

            // تسجيل ف جدول design وربطو مع المستعمل
            Design::create([
                'id_image' => $img->id_image,
                'id_utilisateur' => Auth::id() 
            ]);

            return response()->json([
                'status' => 'success',
                'design_url' => asset('uploads/designs/' . $nom_final),
                'id_image' => $img->id_image,
                'categorie' => $request->categorie
            ]);
        }

        return response()->json(['error' => 'No image'], 400);
    }
}