<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{

    protected $fillable = [
        'provider_id',
        'service_name',
        'price',
        'category',
        'description',
        'rating',
        'reviews_count',
        'image_url',
    ];

    public function provider()
    {
        return $this->belongsTo(User::class, 'provider_id');
    }
}
