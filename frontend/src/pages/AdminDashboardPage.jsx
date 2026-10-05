import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/StatCard';
import {
  Utensils,
  Leaf,
  CheckCircle,
  Clock,
  PlusCircle,
  Trash2,
  Edit2,
  RefreshCw,
  AlertTriangle,
  BarChart2,
  Users,
  Eye,
  X,
  FileCheck
} from 'lucide-react';

export const AdminDashboardPage = ({ setActivePage }) => {
  const { user, isAdmin, loginDemo } = useAuth();
  const { showToast } = useToast();

  const [dashboard, setDashboard] = useState(null);
  const [foods, setFoods] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'claims'

  // Edit food modal state
  const [editingFood, setEditingFood] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    quantity: '',
    status: '',
    pickupLocation: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [dashRes, foodsRes, claimsRes] = await Promise.all([
        api.getAdminDashboard(),
        api.getFoods(),
        api.getAllClaims()
      ]);
      setDashboard(dashRes);
      setFoods(foodsRes.foods || []);
      setClaims(claimsRes.claims || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const handleDeleteFood = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.deleteFood(id);
      showToast(`"${name}" removed successfully`, 'success');
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleStatusChange = async (foodId, newStatus) => {
    try {
      await api.updateFood(foodId, { status: newStatus });
      showToast(`Food marked as ${newStatus.replace('_', ' ')}`, 'success');
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleClaimStatusChange = async (claimId, newStatus) => {
    try {
      await api.updateClaimStatus(claimId, newStatus);
      showToast(`Claim marked as ${newStatus}`, 'success');
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const openEditModal = (food) => {
    setEditingFood(food);
    setEditFormData({
      name: food.name,
      quantity: food.quantity,
      status: food.status,
      pickupLocation: food.pickupLocation
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.updateFood(editingFood.id, editFormData);
      showToast('Food item updated successfully', 'success');
      setEditingFood(null);
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-lg mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-neutral-900">Admin Privileges Required</h2>
        <p className="text-xs text-neutral-500">
          Please log in as a Canteen Administrator to view the back-office dashboard and food logs.
        </p>
        <button
          onClick={() => loginDemo('admin')}
          className="py-2.5 px-5 rounded-xl bg-forest-600 text-white text-xs font-bold"
        >
          Sign in as Canteen Admin
        </button>
      </div>
    );
  }

  const summary = dashboard?.summary || {
    todaysSurplus: 0,
    foodRescued: 0,
    currentlyAvailable: 0,
    wastePreventedKg: 0
  };

  const chartData = dashboard?.chartData || [];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
              Canteen Staff Operations
            </h1>
          </div>
          <p className="text-sm text-neutral-600 mt-1">
            Monitor real-time surplus inventory, verify claims, and coordinate food rescue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-forest-600' : ''}`} />
            <span>Sync Data</span>
          </button>

          <button
            onClick={() => setActivePage('post')}
            className="py-2.5 px-4 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Food</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Surplus"
          value={summary.todaysSurplus}
          unit="portions"
          icon={Utensils}
          color="blue"
          subtitle="Total logged cafeteria surplus"
        />
        <StatCard
          title="Food Rescued"
          value={summary.foodRescued}
          unit="portions"
          icon={CheckCircle}
          color="forest"
          subtitle="Claimed & saved by community"
        />
        <StatCard
          title="Currently Available"
          value={summary.currentlyAvailable}
          unit="portions"
          icon={Clock}
          color="amber"
          subtitle="Ready for pickup right now"
        />
        <StatCard
          title="Waste Prevented"
          value={summary.wastePreventedKg}
          unit="kg"
          icon={Leaf}
          color="emerald"
          subtitle="Organic mass diverted"
        />
      </div>

      {/* Chart: Food Posted vs Food Claimed */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-forest-600" />
                <span>Food Posted vs Food Claimed</span>
              </h3>
              <p className="text-xs text-neutral-500">
                Visualizing batch portions across active menu listings
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-neutral-300"></span>
                <span className="text-neutral-600">Total Posted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-forest-600"></span>
                <span className="text-forest-700">Rescued / Claimed</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="space-y-3 pt-2">
            {chartData.map((item, idx) => {
              const maxVal = Math.max(...chartData.map(d => d.posted), 1);
              const postedPct = (item.posted / maxVal) * 100;
              const claimedPct = item.posted > 0 ? (item.claimed / item.posted) * 100 : 0;

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-neutral-800">{item.name}</span>
                    <span className="text-neutral-500">
                      <strong className="text-forest-700">{item.claimed}</strong> claimed of {item.posted} ({item.remaining} left)
                    </span>
                  </div>
                  {/* Compound bar */}
                  <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden flex">
                    <div
                      className="bg-forest-600 transition-all duration-700"
                      style={{ width: `${(item.claimed / maxVal) * 100}%` }}
                      title={`${item.claimed} claimed`}
                    ></div>
                    <div
                      className="bg-neutral-300 transition-all duration-700"
                      style={{ width: `${((item.posted - item.claimed) / maxVal) * 100}%` }}
                      title={`${item.remaining} remaining`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabs: Inventory Table vs Claims Verification */}
      <div className="space-y-4">
        <div className="flex border-b border-neutral-200">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 px-5 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'inventory'
                ? 'border-forest-600 text-forest-700'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Surplus Inventory Table ({foods.length})
          </button>
          <button
            onClick={() => setActiveTab('claims')}
            className={`py-3 px-5 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'claims'
                ? 'border-forest-600 text-forest-700'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Campus Claim Records ({claims.length})
          </button>
        </div>

        {/* Tab 1: Inventory Table */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-neutral-50/80 border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    <th className="py-3.5 px-4">Food Item</th>
                    <th className="py-3.5 px-4">Posted</th>
                    <th className="py-3.5 px-4 text-center">Batch Size</th>
                    <th className="py-3.5 px-4 text-center">Claimed</th>
                    <th className="py-3.5 px-4 text-center">Remaining</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {foods.map(food => {
                    const orig = food.originalQuantity || food.quantity;
                    const claimed = Math.max(0, orig - food.quantity);
                    
                    return (
                      <tr key={food.id} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={food.image}
                              alt={food.name}
                              className="w-10 h-10 rounded-lg object-cover shrink-0"
                            />
                            <div>
                              <div className="font-bold text-neutral-900">{food.name}</div>
                              <div className="text-[11px] text-neutral-500">{food.canteen}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-neutral-600 whitespace-nowrap">
                          {new Date(food.postedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>

                        <td className="py-3.5 px-4 text-center font-semibold text-neutral-700">
                          {orig}
                        </td>

                        <td className="py-3.5 px-4 text-center font-bold text-forest-700">
                          {claimed}
                        </td>

                        <td className="py-3.5 px-4 text-center font-extrabold text-neutral-900">
                          {food.quantity}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            food.status === 'AVAILABLE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : food.status === 'ALMOST_CLAIMED'
                              ? 'bg-amber-100 text-amber-800'
                              : food.status === 'FULLY_CLAIMED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {food.status.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditModal(food)}
                              className="p-1.5 rounded-lg text-neutral-500 hover:text-forest-700 hover:bg-neutral-100"
                              title="Edit item"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(food.id, 'EXPIRED')}
                              className="p-1.5 rounded-lg text-neutral-500 hover:text-amber-700 hover:bg-amber-50"
                              title="Mark Expired"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteFood(food.id, food.name)}
                              className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-600 hover:bg-rose-50"
                              title="Delete food item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Claims Verification Table */}
        {activeTab === 'claims' && (
          <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-neutral-50/80 border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    <th className="py-3.5 px-4">Claim ID</th>
                    <th className="py-3.5 px-4">Student / NGO</th>
                    <th className="py-3.5 px-4">Food Item</th>
                    <th className="py-3.5 px-4 text-center">Portions</th>
                    <th className="py-3.5 px-4">Pickup Time</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {claims.map(claim => (
                    <tr key={claim.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-forest-800">
                        {claim.claimId}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-neutral-800">
                        {claim.userName}
                      </td>

                      <td className="py-3.5 px-4 text-neutral-700">
                        {claim.foodName}
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-neutral-900">
                        {claim.quantity}
                      </td>

                      <td className="py-3.5 px-4 text-neutral-600 whitespace-nowrap">
                        {new Date(claim.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          claim.status === 'CONFIRMED'
                            ? 'bg-amber-100 text-amber-800'
                            : claim.status === 'COLLECTED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          {claim.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {claim.status === 'CONFIRMED' ? (
                          <button
                            onClick={() => handleClaimStatusChange(claim.id, 'COLLECTED')}
                            className="py-1 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-colors"
                          >
                            Mark Collected (+20 pts)
                          </button>
                        ) : (
                          <span className="text-xs text-neutral-400">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Edit Food Modal */}
      {editingFood && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-neutral-100 overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
              <h3 className="font-bold text-neutral-900">Edit Surplus Food Item</h3>
              <button onClick={() => setEditingFood(null)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Food Name</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData(p => ({ ...p, name: e.target.value }))}
                  className="w-full py-2 px-3 rounded-xl border border-neutral-200 outline-none focus:border-forest-600 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Available Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={editFormData.quantity}
                  onChange={(e) => setEditFormData(p => ({ ...p, quantity: e.target.value }))}
                  className="w-full py-2 px-3 rounded-xl border border-neutral-200 outline-none focus:border-forest-600 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Status</label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData(p => ({ ...p, status: e.target.value }))}
                  className="w-full py-2 px-3 rounded-xl border border-neutral-200 outline-none focus:border-forest-600 text-sm"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="ALMOST_CLAIMED">ALMOST_CLAIMED</option>
                  <option value="FULLY_CLAIMED">FULLY_CLAIMED</option>
                  <option value="EXPIRED">EXPIRED</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Pickup Location</label>
                <input
                  type="text"
                  value={editFormData.pickupLocation}
                  onChange={(e) => setEditFormData(p => ({ ...p, pickupLocation: e.target.value }))}
                  className="w-full py-2 px-3 rounded-xl border border-neutral-200 outline-none focus:border-forest-600 text-sm"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingFood(null)}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 font-semibold text-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 font-bold text-white shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
