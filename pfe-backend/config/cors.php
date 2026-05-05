<?php

// config/cors.php
return [
'paths' => ['api/*', 'storage/*', 'sanctum/csrf-cookie'],


'allowed_methods' => ['*'], // كيعني كاع الطرق (GET, POST, PUT, DELETE) مسموحة

'allowed_origins' => ['http://localhost:5173'], // هادي هي المهمة! كتعطي الإذن للـ React ديالك

'allowed_origins_patterns' => [],

'allowed_headers' => ['*'], // كيعني كاع الـ Headers (بما فيهم الـ Authorization) مسموحين

'exposed_headers' => [],

'max_age' => 0,

'supports_credentials' => true, // ضرورية إلا كنتي خدام بـ Sanctum
];