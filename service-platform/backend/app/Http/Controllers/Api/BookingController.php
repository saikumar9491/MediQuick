<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Service;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'provider') {
            return response()->json(Booking::where('provider_id', $user->id)->with(['user', 'service'])->get());
        }

        return response()->json(Booking::where('user_id', $user->id)->with(['service', 'provider'])->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'service_id' => 'required|string',
            'booking_date' => 'required|date',
            'slot_time' => 'required|string',
        ]);

        $service = Service::find($request->service_id);

        if (!$service) {
            return response()->json(['message' => 'Service not found'], 404);
        }

        $booking = Booking::create([
            'user_id' => auth()->id(),
            'service_id' => $request->service_id,
            'provider_id' => $service->provider_id,
            'booking_date' => $request->booking_date,
            'slot_time' => $request->slot_time,
            'status' => 'pending',
            'payment_status' => 'pending',
            'total_price' => $service->price,
        ]);

        return response()->json($booking, 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], 404);
        }

        // Only provider or admin can update status
        if (auth()->user()->role !== 'provider' && auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'required|in:accepted,rejected,completed,cancelled',
        ]);

        $booking->update(['status' => $request->status]);

        return response()->json($booking);
    }
}
