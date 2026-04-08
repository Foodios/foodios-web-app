import React from "react";
import { 
  ArrowUpRight, ArrowDownRight, DollarSign, 
  CreditCard, Search, Filter, MoreHorizontal,
  ArrowRight, CheckCircle2, AlertCircle
} from "lucide-react";

const mockTransactions = [
  { id: "TX-9901", merchant: "Pizza 4P's", type: "COMMISSION", amount: -450000, date: "2026-04-08T09:00:00Z", status: "COMPLETED" },
  { id: "TX-9902", merchant: "Banh Mi Huynh Hoa", type: "PLATFORM_FEE", amount: 1500000, date: "2026-04-08T10:15:00Z", status: "COMPLETED" },
  { id: "TX-9903", merchant: "Maison Marou", type: "PAYOUT", amount: -2800000, date: "2026-04-08T11:45:00Z", status: "PENDING" },
  { id: "TX-9904", merchant: "Quan Ut Ut", type: "COMMISSION", amount: -1200000, date: "2026-04-07T15:30:00Z", status: "COMPLETED" },
  { id: "TX-9905", merchant: "Poke Saigon", type: "PLATFORM_FEE", amount: 1500000, date: "2026-04-07T16:20:00Z", status: "FAILED" },
];

const MerchantPaymentsView: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-stone-950 rounded-[32px] p-8 text-white relative overflow-hidden group border border-white/5">
           <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-orange-500" />
                </div>
                <span className="text-[0.6rem] font-black text-stone-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">Net Revenue</span>
              </div>
              <h2 className="text-3xl font-black tracking-tighter mb-1">1,240.50M <span className="text-stone-600 text-xs">VND</span></h2>
              <div className="flex items-center gap-1.5 text-green-400 text-xs font-bold">
                <ArrowUpRight className="w-3 h-3" /> +12.5% vs last month
              </div>
           </div>
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <CreditCard className="w-24 h-24 rotate-12" />
           </div>
        </div>

        <div className="bg-white rounded-[32px] p-8 border border-stone-200 shadow-sm transition-all hover:shadow-xl hover:shadow-stone-200/50">
           <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
              <ArrowDownRight className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest">Total Payouts</span>
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-stone-950 mb-1">842.15M <span className="text-stone-400 text-xs text-stone-200 italic">VND</span></h2>
          <p className="text-stone-400 text-xs font-medium">To 124 active merchant partners</p>
        </div>

        <div className="bg-white rounded-[32px] p-8 border border-stone-200 shadow-sm transition-all hover:shadow-xl hover:shadow-stone-200/50">
           <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest">Collected Fees</span>
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-stone-950 mb-1">398.35M <span className="text-stone-400 text-xs text-stone-200 italic">VND</span></h2>
          <p className="text-stone-400 text-xs font-medium">Commission & Platform subscriptions</p>
        </div>
      </div>

      {/* Main Content: Transaction History */}
      <div className="bg-white rounded-[40px] border border-stone-200 overflow-hidden shadow-sm">
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

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-50">
                <th className="px-8 py-4 text-[0.65rem] font-black uppercase text-stone-400 tracking-widest">Transaction ID</th>
                <th className="px-8 py-4 text-[0.65rem] font-black uppercase text-stone-400 tracking-widest">Target Merchant</th>
                <th className="px-8 py-4 text-[0.65rem] font-black uppercase text-stone-400 tracking-widest">Type</th>
                <th className="px-8 py-4 text-[0.65rem] font-black uppercase text-stone-400 tracking-widest">Amount</th>
                <th className="px-8 py-4 text-[0.65rem] font-black uppercase text-stone-400 tracking-widest">Date / Time</th>
                <th className="px-8 py-4 text-[0.65rem] font-black uppercase text-stone-400 tracking-widest">Status</th>
                <th className="px-8 py-4 text-[0.65rem] font-black uppercase text-stone-400 tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-stone-400 font-mono tracking-tighter">{tx.id}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-xs">🏦</div>
                      <span className="text-sm font-bold text-stone-950">{tx.merchant}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[0.6rem] font-black px-2 py-1 rounded-md border ${
                      tx.type === 'COMMISSION' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      tx.type === 'PLATFORM_FEE' ? 'bg-purple-50 text-purple-600 border-purple-100' :
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
                    <span className="text-xs font-medium text-stone-500 uppercase">{new Date(tx.date).toLocaleDateString()}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.6rem] font-black tracking-widest border ${
                      tx.status === 'COMPLETED' ? 'bg-green-50 text-green-600 border-green-100' :
                      tx.status === 'PENDING' ? 'bg-orange-50 text-orange-600 border-orange-100' :
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
              ))}
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
