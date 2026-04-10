<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Commande;
use App\Models\Adresse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CommandeController extends Controller
{
    /**
     * Enregistrer une nouvelle commande (Post mn React)
     */
    public function store(Request $request)
    {
        // 1. Validation dyal l-data li jaya mn l-form f React
        $validated = $request->validate([
            'city'    => 'required|string',
            'zipcode' => 'required|string',
            'address' => 'required|string',
            'produits'=> 'required|array', // Khass y-koun array dyal l-items
        ]);

        try {
            // Transaction bach ila wqe3 ghalat f ay blassa, may-t-creer walou (Rollback)
            return DB::transaction(function () use ($request) {
                
                // 2. Check User (Login) - kima knti dāyer f PHP
                // auth('sanctum')->id() ila knti khddam b Sanctum, aw auth()->id()
                $user_id = auth()->id() ?? 'visiteur';

                // 3. Insert Adresse (Kima "INSERT INTO adresses...")
                $adresse = Adresse::create([
                    'ville'          => $request->city,
                    'code_postale'   => $request->zipcode,
                    'adresse'        => $request->address,
                    'id_utilisateur' => $user_id
                ]);

                // 4. Insert Commande (Kima "INSERT INTO commandes...")
                $commande = Commande::create([
                    'date_commande'   => now(),
                    'statut_commande' => 'en attente',
                    'id_adresse'      => $adresse->id_adresse,
                    'id_utilisateur'  => $user_id
                ]);

                // 5. Insert f table "porter" (Kima l-foreach f PHP dyalk)
                foreach ($request->produits as $item) {
                    // $item khass y-koun fih {id, qte, color}
                    $commande->produits()->attach($item['id'], [
                        'qte'   => $item['qte'],
                        'color' => $item['color'] ?? 'default'
                    ]);
                }

                return response()->json([
                    'status' => 'success',
                    'message' => 'Commande créée avec succès',
                    'commande_id' => $commande->id_commande
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