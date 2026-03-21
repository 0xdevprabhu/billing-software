<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Estimation extends Model
{
    use HasFactory;

    protected $fillable = ['order_id', 'customer_name', 'customer_phone', 'total_amount'];

    public function items()
    {
        return $this->hasMany(EstimationItem::class);
    }
}