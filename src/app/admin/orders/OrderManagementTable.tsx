"use client";

import { useState, useTransition } from "react";
import { Copy, Check, Clock, Package, CheckCircle2, Search, XCircle, X, MapPin, Phone, Mail, User } from "lucide-react";
import { updateFulfillmentStatus } from "./actions";

const CURRENCY_SYMBOLS: Record<string, string> = { "USD": "$", "PHP": "₱", "EUR": "€", "GBP": "£" };

export default function OrderManagementTable({ initialOrders, activeCurrency }: { initialOrders: any[], activeCurrency: string }) {
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Woz Engine: Modal State
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const activeSymbol = CURRENCY_SYMBOLS[activeCurrency] || "$";

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, fulfillment_status: newStatus } : o));
    startTransition(async () => {
      await updateFulfillmentStatus(orderId, newStatus);
    });
  };

  const copyToClipboard = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Prevent modal from opening when clicking copy icon
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatCurrency = (amount: number) => {
    return `${activeSymbol}${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getFulfillmentColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'preparing': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'in_transit': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredOrders = orders.filter(order => 
    order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.tracking_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col h-[70vh]">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, email, or tracking number..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-md border border-slate-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" 
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 z-10 text-slate-500 font-bold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Order Details</th>
                <th className="px-6 py-4">Tracking Number</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Fulfillment Status</th>
                <th className="px-6 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Package className="w-8 h-8 text-slate-300" />
                      <p className="font-medium text-slate-900">No orders found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 mb-0.5">{order.customer_name}</div>
                      <div className="text-xs text-slate-500 font-mono" title={order.id}>ID: {order.id.split('-')[0].toUpperCase()}</div>
                      <div className="text-[11px] text-slate-400 mt-1">{new Date(order.created_at).toLocaleString()}</div>
                    </td>

                    <td className="px-6 py-4">
                      {order.tracking_number ? (
                        <div className="flex items-center gap-2">
                          {/* Woz Fix: Made the tracking number clickable to trigger the modal */}
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="font-mono font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded border border-blue-200 transition-colors cursor-pointer shadow-sm"
                            title="View Customer Details"
                          >
                            {order.tracking_number}
                          </button>
                          <button 
                            onClick={(e) => copyToClipboard(order.tracking_number, e)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                            title="Copy Tracking Number"
                          >
                            {copiedId === order.tracking_number ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs italic text-slate-400">N/A</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${order.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                          {order.payment_status === 'paid' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                          {order.payment_status.toUpperCase()}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{order.payment_method}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={order.fulfillment_status || 'processing'}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={isPending}
                        className={`text-xs font-bold rounded-lg border outline-none cursor-pointer py-1.5 px-3 pr-8 appearance-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 ${getFulfillmentColor(order.fulfillment_status)}`}
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.2rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                      >
                        <option value="processing">⚙️ Processing</option>
                        <option value="preparing">📦 Preparing</option>
                        <option value="in_transit">🚚 In Transit</option>
                        <option value="delivered">✅ Delivered</option>
                        <option value="cancelled">❌ Cancelled</option>
                      </select>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="font-mono font-black text-slate-900">{formatCurrency(order.total_amount)}</div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Woz Engine: Customer Information Modal Overlay */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-slate-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Order Dispatch Info
                </h3>
                <p className="text-xs font-mono text-slate-500 mt-0.5">{selectedOrder.tracking_number}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer Details</h4>
                
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{selectedOrder.customer_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-700">{selectedOrder.customer_email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-mono text-slate-700 font-medium">{selectedOrder.customer_phone}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  Shipping Address
                  <button 
                    onClick={(e) => copyToClipboard(selectedOrder.shipping_address, e)}
                    className="flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded"
                  >
                    <Copy className="w-3 h-3" /> Copy Full Address
                  </button>
                </h4>
                
                <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {selectedOrder.shipping_address}
                  </p>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}