import { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  Search, 
  Trash2, 
  Mail, 
  Phone,
  Bike,
  Plus,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { merchantService } from "../../../services/merchantService";


const DriversManagement = () => {
  const { merchant } = useOutletContext<{ merchant: any }>();
  const [drivers, setDrivers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userIdInput, setUserIdInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const fetchDrivers = async () => {
    const merchantId = merchant?.id || merchant?.merchantId;
    if (!merchantId) return;
    
    setIsLoading(true);
    try {
      const result = await merchantService.getMerchantDrivers(merchantId);
      // More robust extraction of the array
      const rawData = result.data || result;
      const driversArray = Array.isArray(rawData) ? rawData : (rawData.drivers || []);
      setDrivers(driversArray);
    } catch (error) {
      console.error("Fetch drivers error:", error);
      setToast({ message: "Failed to load drivers list.", type: "error" });
      setDrivers([]); // Ensure it's an array on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [merchant?.id, merchant?.merchantId]);

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    const merchantId = merchant?.id || merchant?.merchantId;
    if (!merchantId || !userIdInput) return;

    setIsSubmitting(true);
    try {
      await merchantService.createMerchantDriver(merchantId, userIdInput);
      setToast({ message: "Driver added successfully!", type: "success" });
      setUserIdInput("");
      setIsModalOpen(false);
      fetchDrivers(); // Reload the list
    } catch (error) {
      setToast({ message: "Failed to add driver.", type: "error" });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleDeleteDriver = async (driverId: string) => {
    const merchantId = merchant?.id || merchant?.merchantId;
    if (!merchantId || !driverId) return;

    if (!window.confirm("Are you sure you want to remove this driver from your fleet?")) return;

    try {
      await merchantService.deleteMerchantDriver(driverId, merchantId);
      setToast({ message: "Driver removed successfully!", type: "success" });
      fetchDrivers(); // Reload the list
    } catch (error) {
      setToast({ message: "Failed to remove driver.", type: "error" });
    } finally {
      setTimeout(() => setToast(null), 3000);
    }
  };

  // Safe Stats Calculation
  const totalDrivers = Array.isArray(drivers) ? drivers.length : 0;
  const activeDrivers = Array.isArray(drivers) ? drivers.filter(d => d?.status === 'ACTIVE' || !d?.status).length : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* ... header and stats ... */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
            <span className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-stone-400">Merchant Hub</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-stone-950 uppercase italic">
            Driver <span className="text-orange-500">Fleet</span>
          </h1>
          <p className="text-stone-500 font-bold text-sm max-w-md">
            Manage your in-house delivery team. Add existing users to your fleet by their unique ID.
          </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-stone-950 text-white px-6 py-4 rounded-2xl font-black text-[0.7rem] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-stone-200 active:scale-95 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Add New Driver
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: "Total Drivers", value: totalDrivers, icon: Users, color: "stone" },
          { label: "Active Now", value: activeDrivers, icon: Bike, color: "orange" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[28px] border border-stone-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-4">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${stat.color === 'orange' ? 'bg-orange-50 text-orange-600' : 'bg-stone-50 text-stone-600'} group-hover:scale-110`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-stone-950">{stat.value}</span>
            </div>
            <p className="text-[0.6rem] font-black uppercase tracking-widest text-stone-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Drivers List */}
      <div className="bg-white rounded-[32px] border border-stone-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-50 flex items-center justify-between bg-white">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input 
              type="text"
              placeholder="Search by name, email or phone..."
              className="w-full pl-11 pr-4 py-3 bg-stone-50 border-none rounded-2xl text-sm font-bold placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500/20 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/50">
                <th className="px-6 py-4 text-[0.6rem] font-black uppercase tracking-widest text-stone-400">Driver Info</th>
                <th className="px-6 py-4 text-[0.6rem] font-black uppercase tracking-widest text-stone-400">Contact</th>
                <th className="px-6 py-4 text-[0.6rem] font-black uppercase tracking-widest text-stone-400">User ID</th>
                <th className="px-6 py-4 text-[0.6rem] font-black uppercase tracking-widest text-stone-400">Status</th>
                <th className="px-6 py-4 text-[0.6rem] font-black uppercase tracking-widest text-stone-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-4" />
                    <p className="text-stone-400 font-bold text-sm">Loading your fleet...</p>
                  </td>
                </tr>
              ) : drivers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <p className="text-stone-400 font-bold text-sm">No drivers found. Add your first driver to get started!</p>
                  </td>
                </tr>
              ) : (
                drivers.map((driver, index) => (
                  <tr key={driver.id || driver.userId || index} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-black text-xs uppercase">
                          {(driver.fullName || driver.name || driver.username || "Dr").substring(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-stone-950 leading-tight">
                            {driver.fullName || driver.name || driver.username || "Unnamed Driver"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-stone-600 text-[0.7rem] font-bold">
                          <Mail className="w-3 h-3 text-stone-400" />
                          {driver.email || "No email"}
                        </div>
                        <div className="flex items-center gap-2 text-stone-600 text-[0.7rem] font-bold">
                          <Phone className="w-3 h-3 text-stone-400" />
                          {driver.phone || "No phone"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-lg text-[0.6rem] font-black uppercase tracking-tight">
                        {driver.userId || driver.id || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.6rem] font-black uppercase tracking-widest ${
                        (driver.status || 'ACTIVE') === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        <div className={`h-1 w-1 rounded-full ${(driver.status || 'ACTIVE') === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`} />
                        {driver.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => handleDeleteDriver(driver.id || driver.userId)}
                        className="p-2.5 bg-stone-50 text-stone-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all shadow-sm border border-transparent hover:border-red-100"
                        title="Remove Driver"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Driver Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => !isSubmitting && setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="h-12 w-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-100">
                  <UserPlus className="w-6 h-6" />
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-stone-50 rounded-xl transition-colors text-stone-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 mb-8">
                <h3 className="text-2xl font-black text-stone-950 uppercase tracking-tight">Add Fleet Driver</h3>
                <p className="text-stone-500 font-bold text-sm">
                  The user must have an existing account. Entering their ID will set their role to DRIVER.
                </p>
              </div>

              <form onSubmit={handleAddDriver} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[0.6rem] font-black uppercase tracking-widest text-stone-400 ml-1">User UUID / ID</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input 
                      required
                      type="text"
                      value={userIdInput}
                      onChange={(e) => setUserIdInput(e.target.value)}
                      placeholder="e.g. 123e4567-e89b-12d3..."
                      className="w-full pl-11 pr-4 py-4 bg-stone-50 border-none rounded-2xl text-sm font-bold placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    disabled={isSubmitting || !userIdInput}
                    type="submit"
                    className="w-full h-14 bg-stone-950 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-stone-100 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Confirm & Add Driver
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-bottom-5 duration-300 ${
          toast.type === 'success' ? 'bg-white border-green-100 text-green-600' : 'bg-white border-red-100 text-red-600'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-[0.7rem] font-black uppercase tracking-widest">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default DriversManagement;
