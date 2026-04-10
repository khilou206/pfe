<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Produit;
use App\Models\Design;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function getProfile(Request $request) {
        $user = $request->user(); // Sanctum kiy-3ref l-user b l-token
        
        $stats = [
            'nb_produits' => \DB::table('produits')->where('id_utilisateur', $user->id_utilisateur)->count(),
            'nb_designs' => \DB::table('design')->where('id_utilisateur', $user->id_utilisateur)->count(),
            'revenus' => '0 MAD'
        ];

        return response()->json([
            'user' => $user,
            'stats' => $stats
        ]);
    }

    public function updateProfile(Request $request) {
        $user = $request->user();
        
        $data = $request->validate([
            'nom' => 'required|string',
            'email' => 'required|email|unique:utilisateurs,email,'.$user->id_utilisateur.',id_utilisateur',
            'mot_de_passe' => 'nullable|min:6'
        ]);

        $user->nom = $data['nom'];
        $user->email = $data['email'];
        
        if ($request->filled('mot_de_passe')) {
            $user->password = bcrypt($data['mot_de_passe']);
        }

        $user->save();
        return response()->json(['message' => 'Success']);
    }
}