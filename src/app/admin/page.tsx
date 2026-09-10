export default function AdminDashboard() {
  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">System Overview</h2>
        <p className="text-slate-500 mt-1">Welcome back. Here is the current status of your storefront.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Active Sections</h3>
          <p className="text-3xl font-bold text-slate-900">6</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-slate-900">124</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Pending Messages</h3>
          <p className="text-3xl font-bold text-slate-900">3</p>
        </div>
      </div>
    </div>
  );
}