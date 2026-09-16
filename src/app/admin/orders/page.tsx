import { neon } from "@neondatabase/serverless";
import { Package, Search, ChevronRight, Clock, CheckCircle2, XCircle } from "lucide-react";

// Woz Engine: Currency Map
const CURRENCY_SYMBOLS: Record<string, string> = { "USD": "$", "PHP": "₱", "EUR": "€", "GBP": "£" };

export default async function AdminOrdersPage() {
  const sql = neon(process.env.DATABASE_URL!);
  
  let orders: any[] = [];
  let activeCurrency = "USD"; // Fallback
  
  try {
    // Woz Fix: Fetch orders and product settings concurrently
    const [ordersData, settingsData] = await Promise.all([
      sql`
        SELECT id, customer_name, customer_email, payment_method, payment_status, total_amount, created_at 
        FROM orders 
        ORDER BY created_at DESC 
        LIMIT 50
      `,
      sql`SELECT currency FROM product_settings WHERE id = 1`
    ]);
    
    orders = ordersData;
    if (settingsData.length > 0) activeCurrency = settingsData[0].currency;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
  }

  // Assign the correct symbol based on what is saved in the database
  const activeSymbol = CURRENCY_SYMBOLS[activeCurrency] || "$";

  const statusStyles: Record<string, string> = {
    'pending': 'bg-amber-50 text-amber-700 border-amber-200',
    'paid': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'failed': 'bg-red-50 text-red-700 border-red-200'
  };

  const statusIcons: Record<string, any> = {
    'pending': <Clock className="w-3 h-3" />,
    'paid': <CheckCircle2 className="w-3 h-3" />,
    'failed': <XCircle className="w-3 h-3" />
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Order Management</h2>
          <p className="text-slate-500 mt-1">Review incoming orders and update payment statuses.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[70vh]">
        
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search by name, email, or order ID..." className="w-full h-10 pl-9 pr-4 rounded-md border border-slate-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 z-10">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Order Details</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Customer</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Method</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Total</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Package className="w-8 h-8 text-slate-300" />
                      <p>No orders have been placed yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const date = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  const badgeClass = statusStyles[order.payment_status] || statusStyles['pending'];
                  const Icon = statusIcons[order.payment_status] || statusIcons['pending'];

                  return (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs text-slate-500 mb-1" title={order.id}>{order.id.split('-')[0]}...</div>
                        <div className="text-slate-900 font-medium">{date}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{order.customer_name}</div>
                        <div className="text-slate-500 text-xs">{order.customer_email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${order.payment_method === 'COD' ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                          {order.payment_method}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${badgeClass}`}>
                          {Icon} {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                        </span>
                      </td>
                      {/* Woz Fix: Applied the dynamic currency formatter */}
                      <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                        {activeSymbol}{Number(order.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="View Order">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}