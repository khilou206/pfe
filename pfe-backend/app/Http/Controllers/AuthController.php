<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Utilisateur;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
//---------------------------------------------------------------------------------------------------
    public function login(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'mot_de_passe' => 'required|string'
        ]);
        $user = Utilisateur::where('nom', $request->nom)->first();

        if (!$user || !Hash::check($request->mot_de_passe, $user->mot_de_passe)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'Nom ou mot de passe incorrect'
            ], 401);
        }
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'status' => 'success',
            'user' => $user, 
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }
//---------------------------------------------------------------------------------------------------
    public function register(Request $request)
    {
        $fields = $request->validate([
            'nom' => 'required|string|unique:utilisateurs,nom',
            'email' => 'required|string|unique:utilisateurs,email',
            'tel' => 'nullable|string', 
            'mot_de_passe' => 'required|string|confirmed|min:6',
        ]);

        $user = Utilisateur::create([
            'nom' => $fields['nom'],
            'email' => $fields['email'],
            'tel' => $fields['tel'] ?? null,
            'role' => 'utilisateur', 
            'mot_de_passe' => Hash::make($fields['mot_de_passe']),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'user' => $user,
            'access_token' => $token,
        ], 201);
    }
//---------------------------------------------------------------------------------------------------
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logout successful'
        ]);
    }
}