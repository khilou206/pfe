<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Design;
use App\Models\Mockup;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    /**
     * =========================================================
     * 📂 GET AVAILABLE CATEGORIES (MOCKUP TYPES)
     * =========================================================
     * - Fetch unique categories from mockups table
     * - Used for filtering products in frontend
     */
    public function getAvailableCategories()
    {
        // 📊 Get distinct categories
        $categories = Mockup::distinct()->pluck('categorie_mockup');

        return response()->json($categories);
    }

    /**
     * =========================================================
     * 🎨 UPLOAD USER DESIGN (LOGO / IMAGE)
     * =========================================================
     * - Validate image upload
     * - Store file in storage/app/public/logos
     * - Save design record in DB
     * - Return design ID for linking with product
     */
    public function uploadDesign(Request $request)
    {
        try {

            // 🔍 Validate request
            $request->validate([
                'image' => 'required|image|max:8000',
                'id_utilisateur' => 'required'
            ]);

            // 📁 Check file existence
            if ($request->hasFile('image')) {

                $file = $request->file('image');

                // 🏷️ Generate unique filename
                $fileName = time() . '_' . $file->getClientOriginalName();

                // 💾 Store file in public storage (logos folder)
                $file->storeAs('logos', $fileName, 'public');

                // 🧾 Save design in database
                $design = Design::create([
                    'nom_design'     => $fileName,
                    'date_upload'    => now(),
                    'id_utilisateur' => $request->id_utilisateur,
                ]);

                // ✅ Response
                return response()->json([
                    'status'     => 'success',
                    'id_design'  => $design->id,
                    'nom_design' => $fileName
                ]);
            }

            // ⚠️ If no file sent
            return response()->json([
                'error' => 'No image uploaded'
            ], 400);

        } catch (\Exception $e) {

            // ❌ Error handling
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * =========================================================
     * 🖼️ GET MOCKUPS BY CATEGORY
     * =========================================================
     * - Fetch mockups filtered by category
     * - Optimized: no unnecessary relations
     */
    public function getMockupsByCat($cat)
    {
        try {

            // 📦 Fetch mockups by category
            $mockups = Mockup::where('categorie_mockup', $cat)->get();

            return response()->json($mockups);

        } catch (\Exception $e) {

            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}