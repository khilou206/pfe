<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Commande;
use App\Models\Adresse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CommandeController extends Controller
{
//----------------------------------------------------------------------------------------------
    public function store(Request $request)
    {
      
        $validated = $request->validate([
            'city'    => 'required|string',
            'zipcode' => 'required|string',
            'address' => 'required|string',
            'produits'=> 'required|array', 
        ]);

        try {
            
            return DB::transaction(function () use ($request) {
                
            
                $user_id = auth()->id() ;

                $adresse = Adresse::create([
                    'ville'          => $request->city,
                    'code_postale'   => $request->zipcode,
                    'adresse'        => $request->address,
                    'id_utilisateur' => $user_id
                ]);
               $commande = Commande::create([
    'id_utilisateur' => $user_id,
    'id_adresse' => $adresse->id,
    'total_price' => 0,
    'status' => 'pending',
]);
    foreach ($request->produits as $item) {
        $commande->produits()->attach($item['id'], [
            'qte'   => $item['qte']
        ]);
    }
            return response()->json([
                'status' => 'success',
                'message' => 'Commande créée avec succès',
                'commande_id' => $commande->id
            ], 201);
        });
    } catch (\Exception $e) {
        Log::error("Erreur Commande: " . $e->getMessage());
        return response()->json([
            'status' => 'error',
            'message' => 'Erreur lors de la création: ' . $e->getMessage()
        ], 500);
    }
    }
}