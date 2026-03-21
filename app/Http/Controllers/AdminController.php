<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Order;
use App\Models\Estimation;
use App\Models\EstimationItem;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function index()
    {
        return view('admin');
    }

    // --- Product Management ---
    public function getProducts()
    {
        return response()->json(Product::all());
    }

    public function createProduct(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric'
        ]);
        $product = Product::create($validated);
        return response()->json(['message' => 'Product created', 'product' => $product]);
    }

    public function updateProduct(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric'
        ]);
        $product->update($validated);
        return response()->json(['message' => 'Product updated']);
    }

    public function deleteProduct($id)
    {
        Product::destroy($id);
        return response()->json(['message' => 'Product deleted']);
    }

    // --- Order Management ---
    public function getOrders()
    {
        $orders = Order::with(['items.product'])->orderBy('created_at', 'desc')->get();
        return response()->json($orders);
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);
        return response()->json(['message' => 'Order status updated']);
    }

    // --- Estimation / Billing Management ---
    public function saveEstimation(Request $request)
    {
        $request->validate([
            'order_id' => 'nullable|exists:orders,id',
            'customer_name' => 'required|string',
            'customer_phone' => 'required|string',
            'total_amount' => 'required|numeric',
            'items' => 'required|array',
            'items.*.product_name' => 'required|string',
            'items.*.quantity' => 'required|integer',
            'items.*.price' => 'required|numeric',
            'items.*.line_total' => 'required|numeric',
        ]);

        try {
            DB::beginTransaction();

            $estimation = Estimation::create([
                'order_id' => $request->order_id,
                'customer_name' => $request->customer_name,
                'customer_phone' => $request->customer_phone,
                'total_amount' => $request->total_amount
            ]);

            foreach ($request->items as $item) {
                EstimationItem::create([
                    'estimation_id' => $estimation->id,
                    'product_name' => $item['product_name'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'line_total' => $item['line_total']
                ]);
            }

            if ($request->order_id) {
                Order::where('id', $request->order_id)->update(['status' => 'estimated']);
            }

            DB::commit();
            return response()->json(['message' => 'Estimation saved successfully!']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to save estimation.', 'error' => $e->getMessage()], 500);
        }
    }

    public function getEstimations()
    {
        $estimations = Estimation::with('items')->orderBy('created_at', 'desc')->get();
        return response()->json($estimations);
    }
}