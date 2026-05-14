<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Utilisateur;
use App\Models\Produit;
use App\Models\Design;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
//---------------------------------------------------------------------------------------------------
    public function getProfile(Request $request)
    {
        $user = $request->user();
        $userId = $user->id;
        $stats = [
            'nb_produits' => Produit::where('id_utilisateur', $userId)->count(),
            'nb_designs'  => Design::where('id_utilisateur', $userId)->count(),
            'revenus' => '0 MAD'
        ];
        return response()->json([
            'status' => 'success',
            'user'   => $user,
            'stats'  => $stats
        ]);
    }
//---------------------------------------------------------------------------------------------------
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'nom'           => 'required|string',
            'email'         => 'required|email|unique:utilisateurs,email,' . $user->id,
            'mot_de_passe'  => 'nullable|min:6'
        ]);
        $user->nom   = $data['nom'];
        $user->email = $data['email'];
        if ($request->filled('mot_de_passe')) {
            $user->mot_de_passe = Hash::make($data['mot_de_passe']);
        }
        $user->save();
        return response()->json([
            'status'  => 'success',
            'message' => 'Profil mis à jour avec succès'
        ]);
    }
}