<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EstimationItem extends Model
{
    use HasFactory;

    protected $fillable = ['estimation_id', 'product_name', 'quantity', 'price', 'line_total'];
}