<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Utilisateur;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
{
    $request->validate([
        'nom' => 'required|string',
        'mot_de_passe' => 'required|string'
    ]);

    $user = Utilisateur::where('nom', $request->nom)->first();

    // استعملنا mot_de_passe هنا حيت هي اللي عندك ف قاعدة البيانات
    if (!$user || !Hash::check($request->mot_de_passe, $user->mot_de_passe)) {
        return response()->json([
            'status' => 'failed',
            'message' => 'Nom ou mot de passe incorrect'
        ], 401);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'status' => 'success',
        'user' => [
            'id' => $user->id_utilisateur,
            'nom' => $user->nom,
            'email' => $user->email
        ],
        'access_token' => $token,
        'token_type' => 'Bearer',
    ]);
}

    public function logout(Request $request)
    {
        // Revoke token (Replacer dyal session_unset)
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'logout done'
        ]);
    }
    public function register(Request $request)
    {
        $fields = $request->validate([
            'nom' => 'required|string|unique:utilisateurs,nom',
            'email' => 'required|string|unique:utilisateurs,email',
            'mot_de_passe' => 'required|string|confirmed|min:6', // confirmed khassha mot_de_passe_confirmation f React
        ]);

        $user = Utilisateur::create([
            'nom' => $fields['nom'],
            'role' => 'client',
            'email' => $fields['email'],
            'mot_de_passe' => bcrypt($fields['mot_de_passe']),
            
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'user' => $user,
            'access_token' => $token,
        ], 201);
    }
}