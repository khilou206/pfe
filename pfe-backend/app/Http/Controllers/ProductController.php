<?php

namespace App\Http\Controllers;
use App\Models\Produit;
use App\Models\Image;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function saveDesign(Request $request) {
    $imageData = $request->final_mockup;
    $name = time().'_mockup.png';
    \Storage::disk('public')->put('mockups/'.$name, base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $imageData)));

    
    $produit = Produit::create([
        'nom_produit' => $request->title,
        'final_mockup' => $name, 
        // ...
    ]);

    
    Image::create([
        'id_product' => $produit->id,
        'id_design' => $request->id_design,
        'x' => $request->x,
        'y' => $request->y,
        'width' => $request->width,
        'height' => $request->height,
        'nom_image' => $designName 
    ]);
}
    public function saveFullDesign(Request $request)
    {
        try {  
            $design = \App\Models\Design::find($request->id_design);
            if (!$design) return response()->json(['error' => 'Design non trouvé'], 404);
            $mockupName = null;
            if ($request->has('final_mockup') && !empty($request->final_mockup)) {
                $imageData = $request->final_mockup;
                if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $type)) {
                    $imageData = substr($imageData, strpos($imageData, ',') + 1);
                    $extension = strtolower($type[1]); 
                    $imageData = base64_decode($imageData);
                    
                    $mockupName = 'mockup_' . time() . '.' . $extension;
                    \Storage::disk('public')->put('mockups/' . $mockupName, $imageData);
                }
            }
            $produit = Produit::create([
                'nom_produit'         => $request->title ?? 'Produit Personnalisé',
                'categorie_produit'   => $request->category,
                'description_produit' => $request->description,
                'prix'                => $request->price, 
                'id_utilisateur'      => $request->id_utilisateur, 
                'is_public'           => $request->is_public ?? 0,
                'color'               => $request->color,
                'final_mockup'        => $mockupName, 
            ]);
            Image::create([
                'nom_image'  => $design->nom_design, 
                'id_design'  => $request->id_design,
                'id_product' => $produit->id,
                'x'          => (int)$request->x,     
                'y'          => (int)$request->y,      
                'width'      => (int)$request->width,  
                'height'     => (int)$request->height  
            ]);

            return response()->json(['status' => 'success', 'message' => 'Produit enregistré !'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getUserCart(Request $request) {
    
        $products = Produit::with('images')
                    ->where('id_utilisateur', $request->user()->id)
                    ->orderBy('id', 'DESC')
                    ->get();

        return response()->json($products);
    }

    public function getByCategory(Request $request, $category)
    {
        try {
            $limit = $request->query('limit', 4);
            $products = Produit::with('images')
                ->where('categorie_produit', $category)
                ->orderBy('id', 'DESC')
                ->limit($limit)
                ->get();

            return response()->json($products);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function index(Request $request)
    {
        $query = Produit::with('images'); 

        if ($request->has('categorie')) {
            $query->where('categorie_produit', $request->categorie);
        }
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nom_produit', 'LIKE', "%{$search}%")
                  ->orWhere('description_produit', 'LIKE', "%{$search}%");
            });
        }
        return response()->json($query->orderBy('id', 'desc')->get());
    }

    public function show($id)
    {
        $produit = Produit::with('images')->find($id);
        if (!$produit) {
            return response()->json(['message' => 'Not Found'], 404);
        }
        return response()->json($produit);
    }
}