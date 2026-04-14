<?php

return [
    'paths' => ['api/*', 'storage/*', 'sanctum/csrf-cookie'], // زدنا storage/* هنا
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:5173'], // رابط الـ React ديالك
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
