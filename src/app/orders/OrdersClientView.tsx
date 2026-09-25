"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Package, ShoppingBag, Clock, CheckCircle2, 
  Truck, Search, Copy, Check, MapPin, ArrowRight 
} from "lucide-react";

export interface OrderItem {
  id: string;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
  product_title: string;
  product_image?: string | null;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  payment_method: string;
  payment_status: string;
  paymongo_link_id?: string | null;
  total_amount: number;
  created_at: string;
  tracking_number: string;
  fulfillment_status: string;
  items?: OrderItem[];
}

export default function OrdersClientView({
  initialOrders = [],
  customerEmail,
}: {
  initialOrders: Order[];
  customerEmail: string;
}) {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);

  const handleCopy = (trk: string) => {
    navigator.clipboard.writeText(trk);
    setCopiedTracking(trk);
    setTimeout(() => setCopiedTracking(null), 2000);
  };

  const filteredOrders = initialOrders.filter((order) => {
    const matchesStatus = selectedStatus === "all" || order.fulfillment_status === selectedStatus;
    const matchesSearch =
      searchQuery === "" ||
      order.tracking_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items?.some((i) => i.product_title?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-slate-900 text-white rounded-xl">
              <Package className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">My Orders</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Tracking purchases for <strong className="text-slate-700">{customerEmail}</strong>
          </p>
        </div>
      </div>

      {/* CASE 1: EMPTY STATE ("no item yet") */}
      {initialOrders.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-10 sm:p-16 text-center shadow-xs space-y-6">
          <div className="relative mx-auto w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
            <div className="absolute -top-1 -right-1 w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 text-xs font-bold border-2 border-white">
              0
            </div>
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              No orders found yet
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Looks like you haven't placed any orders yet. Discover our curated collections and start shopping!
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/#products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <ShoppingBag className="w-4 h-4" />
              Explore Products
            </Link>
          </div>
        </div>
      ) : (
        /* CASE 2: POPULATED ORDERS LIST */
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 overflow-x-auto">
              {["all", "processing", "shipped", "delivered"].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1.5 rounded-lg transition-colors capitalize cursor-pointer ${
                    selectedStatus === status ? "bg-white text-slate-900 shadow-2xs" : "hover:text-slate-900"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tracking or item..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-slate-900 outline-none"
              />
            </div>
          </div>

          {/* Orders Cards */}
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const isDelivered = order.fulfillment_status === "delivered";
              const isProcessing = order.fulfillment_status === "processing";

              return (
                <div key={order.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:border-slate-300 transition-colors">
                  {/* Top Bar */}
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="flex flex-wrap items-center gap-6">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400">Order Placed</p>
                        <p className="font-semibold text-slate-800">
                          {new Date(order.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400">Total Amount</p>
                        <p className="font-mono font-bold text-slate-900 text-sm">
                          ₱{Number(order.total_amount).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400">Payment</p>
                        <p className="font-semibold text-emerald-700">{order.payment_method}</p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      isDelivered 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                        : isProcessing 
                        ? "bg-blue-50 text-blue-700 border border-blue-200" 
                        : "bg-slate-100 text-slate-700 border border-slate-200"
                    }`}>
                      {order.fulfillment_status}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-4">
                    {/* Tracking */}
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-slate-500" />
                        <span>Tracking:</span>
                        <span className="font-mono font-bold text-slate-900">{order.tracking_number}</span>
                        <button onClick={() => handleCopy(order.tracking_number)} className="p-1 hover:text-slate-900 cursor-pointer">
                          {copiedTracking === order.tracking_number ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                        </button>
                      </div>
                      <span className="text-slate-500 font-medium">{order.payment_status}</span>
                    </div>

                    {/* Items */}
                    <div className="divide-y divide-slate-100">
                      {order.items?.map((item) => (
                        <div key={item.id} className="py-2.5 flex items-center justify-between text-sm">
                          <div>
                            <p className="font-bold text-slate-900">{item.product_title}</p>
                            <p className="text-xs text-slate-500 font-mono">
                              Qty: {item.quantity} &bull; ₱{Number(item.price_at_purchase).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                          <p className="font-mono font-bold text-slate-900">
                            ₱{(Number(item.price_at_purchase) * item.quantity).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">Shipping to: <strong className="text-slate-700">{order.shipping_address}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}