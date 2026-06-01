<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::query();

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('search')) {
            $query->where('service_name', 'like', '%' . $request->search . '%');
        }

        return response()->json($query->with('provider:id,name')->get());
    }

    public function show($id)
    {
        $service = Service::with('provider:id,name')->find($id);

        if (!$service) {
            return response()->json(['message' => 'Service not found'], 404);
        }

        return response()->json($service);
    }

    public function store(Request $request)
    {
        $request->validate([
            'service_name' => 'required|string',
            'price' => 'required',
            'category' => 'required|string',
        ]);

        $service = Service::create([
            'provider_id' => auth()->id(),
            'service_name' => $request->service_name,
            'price' => $request->price,
            'category' => $request->category,
            'description' => $request->description,
            'image_url' => $request->image_url,
        ]);

        return response()->json($service, 201);
    }
}
