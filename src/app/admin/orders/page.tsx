import { neon } from "@neondatabase/serverless";
import { Package } from "lucide-react";
import OrderManagementTable from "./OrderManagementTable";

export const revalidate = 0; 

export default async function AdminOrdersPage() {
  const sql = neon(process.env.DATABASE_URL!);
  
  let orders: any[] = [];
  let activeCurrency = "USD"; 
  
  try {
    const [ordersData, settingsData] = await Promise.all([
      sql`
        SELECT 
          id, created_at, customer_name, customer_email, 
          customer_phone, shipping_address, /* Woz Fix: Added Phone & Address */
          payment_method, payment_status, total_amount, 
          tracking_number, fulfillment_status
        FROM orders 
        ORDER BY created_at DESC 
        LIMIT 100
      `,
      sql`SELECT currency FROM product_settings WHERE id = 1`
    ]);
    
    orders = ordersData;
    if (settingsData.length > 0) activeCurrency = settingsData[0].currency;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" /> Order Management
          </h2>
          <p className="text-slate-500 mt-1">
            Review incoming orders, verify payments, and update physical delivery tracking statuses.
          </p>
        </div>
      </div>

      <OrderManagementTable 
        initialOrders={orders} 
        activeCurrency={activeCurrency} 
      />
    </div>
  );
}