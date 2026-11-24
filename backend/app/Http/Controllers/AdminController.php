<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function orders()
    {
        return Order::with('items.product')->latest()->get();
    }

    public function storeProduct(Request $request)
    {
        return response()->json(Product::create($this->validated($request)), 201);
    }

    public function updateProduct(Request $request, Product $product)
    {
        $product->update($this->validated($request));
        return $product;
    }

    public function destroyProduct(Product $product)
    {
        try {
            $product->delete();
        } catch (QueryException $e) {
            return response()->json(['message' => 'Cannot delete: this product is already in an order'], 422);
        }

        return response()->json(['message' => 'Deleted']);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'emoji' => 'required|string|max:10',
            'image_url' => 'nullable|url|max:2000',
        ]);
        
        $data['emoji'] = $data['emoji'] ?? '📦';

        return $data;

    }
}