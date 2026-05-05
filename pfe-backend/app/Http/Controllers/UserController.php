<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Utilisateur;
use App\Models\Produit;
use App\Models\Design;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * =========================================================
     * 👤 GET USER PROFILE + STATS
     * =========================================================
     * - Get authenticated user
     * - Calculate user statistics (products, designs, revenue)
     * - Return profile + stats for dashboard
     */
    public function getProfile(Request $request)
    {
        // 🔐 Get logged user
        $user = $request->user();

        // 🆔 User ID
        $userId = $user->id;

        // 📊 User statistics
        $stats = [
            'nb_produits' => Produit::where('id_utilisateur', $userId)->count(),
            'nb_designs'  => Design::where('id_utilisateur', $userId)->count(),

            // 💡 Placeholder (future: calculate real revenue from orders)
            'revenus'     => '0 MAD'
        ];

        return response()->json([
            'status' => 'success',
            'user'   => $user,
            'stats'  => $stats
        ]);
    }

    /**
     * =========================================================
     * ✏️ UPDATE USER PROFILE
     * =========================================================
     * - Update name, email, password (optional)
     * - Validate unique email safely
     * - Hash password if provided
     */
    public function updateProfile(Request $request)
    {
        // 🔐 Get authenticated user
        $user = $request->user();

        // 🔍 Validation rules
        $data = $request->validate([
            'nom'           => 'required|string',
            'email'         => 'required|email|unique:utilisateurs,email,' . $user->id,
            'mot_de_passe'  => 'nullable|min:6'
        ]);

        // ✏️ Update basic fields
        $user->nom   = $data['nom'];
        $user->email = $data['email'];

        // 🔐 Update password only if provided
        if ($request->filled('mot_de_passe')) {
            $user->mot_de_passe = Hash::make($data['mot_de_passe']);
        }

        // 💾 Save changes
        $user->save();

        return response()->json([
            'status'  => 'success',
            'message' => 'Profil mis à jour avec succès'
        ]);
    }
}