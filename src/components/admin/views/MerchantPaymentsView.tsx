import React, { useState, useEffect } from "react";
import { 
  ArrowUpRight, ArrowDownRight, DollarSign, 
  CreditCard, Filter, MoreHorizontal,
  ArrowRight, Loader2
} from "lucide-react";
import { adminService } from "../../../services/adminService";

const MerchantPaymentsView: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState({
    netRevenue: 0,
    totalPayouts: 0,
    collectedFees: 0
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const result = await adminService.getAdminWalletTransactions();
        const dataItems = result.data?.items || result.data || [];
        setTransactions(dataItems);
        
        // Map the new fields to summary state
        if (result.data) {
          setSummary({
            netRevenue: result.data.netRevenue || 0,
            totalPayouts: result.data.totalPayout || 0,
            collectedFees: result.data.totalCommission || 0
          });
        }
      } catch (err) {
        console.error("Failed to fetch admin transactions:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-stone-950 rounded-[28px] p-6 text-white relative overflow-hidden group border border-white/5">
           <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-[0.55rem] font-black text-stone-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">Net Revenue</span>
              </div>
              <h2 className="text-2xl font-black tracking-tighter mb-1">{summary.netRevenue.toLocaleString()} <span className="text-stone-600 text-[10px] uppercase font-bold">VND</span></h2>
              <div className="flex items-center gap-1.5 text-green-400 text-[10px] font-bold">
                <ArrowUpRight className="w-2.5 h-2.5" /> +12.5% vs last month
              </div>
           </div>
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <CreditCard className="w-20 h-20 rotate-12" />
           </div>
        </div>

        <div className="bg-white rounded-[28px] p-6 border border-stone-200 shadow-sm transition-all hover:shadow-xl hover:shadow-stone-200/50">
           <div className="flex items-center justify-between mb-5">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-[0.55rem] font-black text-stone-400 uppercase tracking-widest">Total Payouts</span>
          </div>
          <h2 className="text-2xl font-black tracking-tighter text-stone-950 mb-1">{summary.totalPayouts.toLocaleString()} <span className="text-stone-300 text-[10px] italic uppercase font-bold">VND</span></h2>
          <p className="text-stone-400 text-[10px] font-medium">To merchant partners</p>
        </div>

        <div className="bg-white rounded-[28px] p-6 border border-stone-200 shadow-sm transition-all hover:shadow-xl hover:shadow-stone-200/50">
           <div className="flex items-center justify-between mb-5">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-[0.55rem] font-black text-stone-400 uppercase tracking-widest">Collected Fees</span>
          </div>
          <h2 className="text-2xl font-black tracking-tighter text-stone-950 mb-1">{summary.collectedFees.toLocaleString()} <span className="text-stone-300 text-[10px] italic uppercase font-bold">VND</span></h2>
          <p className="text-stone-400 text-[10px] font-medium">Commission & Platform Subs</p>
        </div>
      </div>

      {/* Main Content: Transaction History */}
      <div className="bg-white rounded-[40px] border border-stone-200 overflow-hidden shadow-sm min-h-[500px] flex flex-col">
        <header className="px-8 py-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/30">
          <div>
            <h3 className="text-lg font-black text-stone-950">Transaction History</h3>
            <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mt-0.5">Live financial monitoring</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-10 px-4 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-50 transition-all flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button className="h-10 px-5 bg-stone-950 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-md active:scale-95">
              New Adjustment
            </button>
          </div>
        </header>

        <div className="overflow-x-auto flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
                <p className="text-[0.6rem] font-black uppercase tracking-widest text-stone-400">Fetching history...</p>
              </div>
            </div>
          )}
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-50">
                <th className="px-8 py-4 text-[0.65rem] font-black uppercase text-stone-400 tracking-widest">Transaction ID</th>
                <th className="px-8 py-4 text-[0.65rem] font-black uppercase text-stone-400 tracking-widest">Target</th>
                <th className="px-8 py-4 text-[0.65rem] font-black uppercase text-stone-400 tracking-widest">Type</th>
                <th className="px-8 py-4 text-[0.65rem] font-black uppercase text-stone-400 tracking-widest">Amount</th>
                <th className="px-8 py-4 text-[0.65rem] font-black uppercase text-stone-400 tracking-widest">Date / Time</th>
                <th className="px-8 py-4 text-[0.65rem] font-black uppercase text-stone-400 tracking-widest">Status</th>
                <th className="px-8 py-4 text-[0.65rem] font-black uppercase text-stone-400 tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? transactions.map((tx, idx) => (
                <tr key={tx.id || idx} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-stone-400 font-mono tracking-tighter">{tx.id || 'N/A'}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-xs">🏦</div>
                      <span className="text-sm font-bold text-stone-950">{tx.merchantName || tx.merchant || tx.userName || 'System'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[0.6rem] font-black px-2 py-1 rounded-md border ${
                      tx.type === 'COMMISSION' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      tx.type === 'PLATFORM_FEE' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                      tx.type === 'TOP_UP' ? 'bg-green-50 text-green-600 border-green-100' :
                      'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-sm font-black ${tx.amount < 0 ? 'text-red-500' : 'text-green-600'}`}>
                      {tx.amount < 0 ? '-' : '+'}{Math.abs(tx.amount).toLocaleString()}đ
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-medium text-stone-500 uppercase">
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.6rem] font-black tracking-widest border ${
                      tx.status === 'COMPLETED' || tx.status === 'SUCCESS' ? 'bg-green-50 text-green-600 border-green-100' :
                      tx.status === 'PENDING' || tx.status === 'IN_PROGRESS' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                      'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      {tx.status}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-stone-200 transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-stone-400" />
                    </button>
                  </td>
                </tr>
              )) : !isLoading && (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <p className="text-xs font-black uppercase tracking-widest text-stone-300">No transactions recorded yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <footer className="px-8 py-4 bg-stone-50/50 flex items-center justify-between border-t border-stone-100">
           <button className="text-xs font-black text-orange-600 uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
             View Deep Payout Ledger <ArrowRight className="w-3.5 h-3.5" />
           </button>
           <p className="text-[0.6rem] text-stone-400 font-bold uppercase tracking-widest italic text-stone-300">Audited by Foodio Finance Team</p>
        </footer>
      </div>

    </div>
  );
};

export default MerchantPaymentsView;
