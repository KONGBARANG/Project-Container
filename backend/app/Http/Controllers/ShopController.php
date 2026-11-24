<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ShopController extends Controller
{
    public function products()
    {
        return Product::all();
    }

    public function myOrders(Request $request)
    {
        return Order::with('items.product')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();
    }

    public function checkout(Request $request)
    {
        $data = $request->validate([
            'customer_name' => 'required|string|max:100',
            'phone' => 'required|string|max:30',
            'address' => 'required|string|max:255',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $order = DB::transaction(function () use ($data, $request) {
            $order = Order::create([
                'user_id' => $request->user()->id,
                'customer_name' => $data['customer_name'],
                'phone' => $data['phone'],
                'address' => $data['address'],
                'total' => 0,
            ]);

            $total = 0;
            foreach ($data['items'] as $item) {
                $product = Product::find($item['product_id']);
                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                ]);
                $total += $product->price * $item['quantity'];
            }

            $order->update(['total' => $total]);
            return $order;
        });

        return response()->json($order->load('items.product'), 201);
    }
}