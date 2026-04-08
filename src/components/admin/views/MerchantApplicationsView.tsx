import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, XCircle, Clock, 
  Eye, ArrowLeft, Download,
  Building2, User, MapPin, CreditCard, Calendar, Loader2
} from "lucide-react";
import { generateApiMetadata } from "../../../utils/apiMetadata";

interface ApplicationReviewModalProps {
  application: any;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const ApplicationReviewModal: React.FC<ApplicationReviewModalProps> = ({ application, isOpen, onClose, onApprove, onReject }) => {
  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        
        <header className="p-8 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center text-white text-xl font-black uppercase shadow-lg shadow-orange-500/20">
              {application.displayName?.charAt(0) || 'M'}
            </div>
            <div>
              <h2 className="text-xl font-black text-stone-950 capitalize">{application.displayName || "Merchant"}</h2>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-0.5">Application Form: {application.formCode}</p>
            </div>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-[0.7rem] font-black uppercase tracking-widest border ${
            application.status === 'SUBMITTED' ? 'bg-orange-50 text-orange-600 border-orange-100' :
            application.status === 'APPROVED' ? 'bg-green-50 text-green-600 border-green-100' :
            'bg-red-50 text-red-600 border-red-100'
          }`}>
            {application.status}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-stone-400" />
                <h3 className="font-black text-stone-950 uppercase text-xs tracking-widest">Merchant Details</h3>
              </div>
              <div className="space-y-4 bg-stone-50 p-6 rounded-3xl border border-stone-100">
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <p className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest mb-1">Legal Name</p>
                     <p className="text-sm font-bold text-stone-900">{application.legalName}</p>
                   </div>
                   <div>
                     <p className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest mb-1">Tax Code</p>
                     <p className="text-sm font-bold text-stone-900">{application.taxCode}</p>
                   </div>
                </div>
                <div>
                   <p className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest mb-1">Business Registration Number</p>
                   <p className="text-sm font-bold text-stone-900">{application.businessRegistrationNumber}</p>
                </div>
                <div>
                   <p className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest mb-1">Description</p>
                   <p className="text-sm text-stone-600 leading-relaxed font-medium">{application.description || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-stone-400" />
                <h3 className="font-black text-stone-950 uppercase text-xs tracking-widest">Contact Information</h3>
              </div>
              <div className="space-y-4 bg-stone-50 p-6 rounded-3xl border border-stone-100">
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <p className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest mb-1">Full Name</p>
                     <p className="text-sm font-bold text-stone-900">{application.contactName}</p>
                   </div>
                   <div>
                     <p className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest mb-1">Phone</p>
                     <p className="text-sm font-bold text-stone-900">{application.contactPhone}</p>
                   </div>
                </div>
                <div>
                   <p className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest mb-1">Email</p>
                   <p className="text-sm font-bold text-stone-900">{application.contactEmail}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-stone-400" />
                <h3 className="font-black text-stone-950 uppercase text-xs tracking-widest">Location</h3>
              </div>
              <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100">
                <p className="text-sm font-bold text-stone-900">
                  {application.line1}{application.line2 ? `, ${application.line2}` : ""}, {application.district}, {application.city}
                </p>
                <div className="mt-4 pt-4 border-t border-stone-200 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest mb-1">Postal Code</p>
                    <p className="text-xs font-bold text-stone-900">{application.postalCode}</p>
                  </div>
                  <div>
                    <p className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest mb-1">Form Code</p>
                    <p className="text-xs font-bold text-stone-900">{application.formCode}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-stone-400" />
                <h3 className="font-black text-stone-950 uppercase text-xs tracking-widest">Documents</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-video bg-stone-100 rounded-2xl flex flex-col items-center justify-center border-2 border-stone-200 border-dashed hover:bg-stone-200 transition-colors cursor-pointer group relative overflow-hidden">
                    {application.businessLicenseImageUrl ? <img src={application.businessLicenseImageUrl} className="w-full h-full object-cover" /> : <p className="text-[0.6rem] font-black text-stone-500 uppercase">License Image</p>}
                    <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Eye className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="aspect-video bg-stone-100 rounded-2xl flex flex-col items-center justify-center border-2 border-stone-200 border-dashed hover:bg-stone-200 transition-colors cursor-pointer group relative overflow-hidden">
                    {application.foodSafetyLicenseImageUrl ? <img src={application.foodSafetyLicenseImageUrl} className="w-full h-full object-cover" /> : <p className="text-[0.6rem] font-black text-stone-500 uppercase">Food Safety</p>}
                    <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Eye className="w-6 h-6 text-white" />
                    </div>
                  </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-stone-400" />
                <h3 className="font-black text-stone-950 uppercase text-xs tracking-widest">Payout Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                  <p className="text-[0.55rem] font-black text-stone-400 uppercase tracking-widest mb-1">Bank Name</p>
                  <p className="text-xs font-bold text-stone-900">{application.bankName}</p>
                </div>
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                  <p className="text-[0.55rem] font-black text-stone-400 uppercase tracking-widest mb-1">Account Holder</p>
                  <p className="text-xs font-bold text-stone-900">{application.bankAccountName}</p>
                </div>
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                  <p className="text-[0.55rem] font-black text-stone-400 uppercase tracking-widest mb-1">Account Number</p>
                  <p className="text-xs font-bold text-stone-900">{application.bankAccountNumber}</p>
                </div>
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                  <p className="text-[0.55rem] font-black text-stone-400 uppercase tracking-widest mb-1">Branch</p>
                  <p className="text-xs font-bold text-stone-900">{application.bankBranch}</p>
                </div>
              </div>
          </div>
        </div>

        <footer className="p-8 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button onClick={onClose} className="h-14 px-8 rounded-2xl border border-stone-200 text-stone-950 font-bold hover:bg-white transition-all">Close Detail</button>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onReject(application.id)} 
              className="h-14 px-10 rounded-2xl border border-red-200 bg-red-50 text-red-600 font-black hover:bg-red-100 transition-all font-sans"
            >
              Reject
            </button>
            <button 
              onClick={() => onApprove(application.id)} 
              className="h-14 px-12 rounded-2xl bg-stone-950 text-white font-black hover:bg-orange-600 transition-all shadow-xl shadow-stone-200 font-sans"
            >
              Approve Partner
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

const MerchantApplicationsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [apps, setApps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("SUBMITTED");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const fetchApplications = async () => {
    setIsLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    const metadata = generateApiMetadata("ONL");
    
    if (!accessToken) {
      console.error("No access token found");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/v1/admin/merchants/applications?status=${statusFilter}&pageNumber=1&pageSize=20`, {
        headers: { 
          "authorization": `Bearer ${accessToken}`, 
          "accept": "*/*",
          "rt-request-id": metadata.requestId,
          "rt-request_date_time": metadata.requestDateTime,
          "rt-channel": metadata.channel
        }
      });
      if (response.ok) {
        const result = await response.json();
        const data = result.data;
        if (Array.isArray(data)) {
          setApps(data);
        } else if (data && typeof data === 'object') {
          if (Array.isArray((data as any).items)) {
            setApps((data as any).items);
          } else if (Array.isArray((data as any).content)) {
            setApps((data as any).content);
          } else {
            setApps([]);
          }
        } else {
          setApps([]);
        }
      }
    } catch (error) {
      console.error("Fetch applications error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplicationDetails = async (id: string) => {
    setIsDetailLoading(true);
    setIsReviewOpen(true);
    const accessToken = localStorage.getItem('accessToken');
    const metadata = generateApiMetadata("ONL");

    if (!accessToken) {
      alert("Authentication required.");
      setIsDetailLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/v1/admin/merchants/applications/${id}`, {
        headers: { 
          "authorization": `Bearer ${accessToken}`, 
          "accept": "*/*",
          "rt-request-id": metadata.requestId,
          "rt-request_date_time": metadata.requestDateTime,
          "rt-channel": metadata.channel
        }
      });
      if (response.ok) {
        const result = await response.json();
        setSelectedApp(result.data);
      }
    } catch (error) {
      console.error("Fetch application details error:", error);
      alert("Failed to load application details.");
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!window.confirm("Are you sure you want to APPROVE this merchant application?")) return;
    
    const accessToken = localStorage.getItem('accessToken');
    const metadata = generateApiMetadata("ONL");
    
    try {
      const response = await fetch("http://localhost:8080/api/v1/admin/merchants/applications/approve", {
        method: "POST",
        headers: {
          "authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...metadata,
          data: { id }
        })
      });

      if (response.ok) {
        alert("Application approved successfully!");
        setIsReviewOpen(false);
        fetchApplications();
      } else {
        const result = await response.json();
        alert(`Failed to approve: ${result.result?.description || "Server error"}`);
      }
    } catch (error) {
      console.error("Approve error:", error);
      alert("Failed to connect to server.");
    }
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt("Please enter the reason for rejection:");
    if (reason === null) return;
    if (!reason.trim()) {
      alert("Rejection reason is required.");
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    const metadata = generateApiMetadata("ONL");
    
    try {
      const response = await fetch("http://localhost:8080/api/v1/admin/merchants/applications/reject", {
        method: "POST",
        headers: {
          "authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...metadata,
          data: { id, reason }
        })
      });

      if (response.ok) {
        alert("Application rejected.");
        setIsReviewOpen(false);
        fetchApplications();
      } else {
        const result = await response.json();
        alert(`Failed to reject: ${result.result?.description || "Server error"}`);
      }
    } catch (error) {
      console.error("Reject error:", error);
      alert("Failed to connect to server.");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 font-sans">
      <header className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 rounded-xl border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-950 hover:bg-white transition-all shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-stone-950">Partnership Applications</h1>
            <p className="text-sm text-stone-500 mt-1">Review and approve new merchant requests.</p>
          </div>
        </div>
        <div className="flex bg-stone-100 p-1 rounded-xl">
           {["SUBMITTED", "APPROVED", "REJECTED"].map((st) => (
             <button key={st} onClick={() => setStatusFilter(st)} className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${statusFilter === st ? "bg-white text-stone-950 shadow-sm" : "text-stone-400 hover:text-stone-600"}`}>
               {st}
             </button>
           ))}
        </div>
      </header>

      <div className="bg-white rounded-[32px] border border-stone-200 overflow-hidden shadow-sm relative min-h-[400px]">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        )}
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50/50 uppercase text-[0.65rem] font-black text-stone-400 tracking-widest">
              <th className="px-8 py-5">Merchant / Brand</th>
              <th className="px-8 py-5">Owner / Email</th>
              <th className="px-8 py-5">Date</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading && apps.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-stone-400 font-bold uppercase tracking-widest">
                  No applications found in {statusFilter}
                </td>
              </tr>
            ) : apps.map((app) => (
              <tr key={app.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors group">
                <td className="px-8 py-5">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-sm font-black uppercase">
                        {app.displayName?.charAt(0) || 'M'}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-stone-950 capitalize">{app.displayName || 'Unnamed Store'}</h4>
                        <p className="text-[0.65rem] text-stone-400 font-bold uppercase tracking-tight">{app.legalName}</p>
                      </div>
                   </div>
                </td>
                <td className="px-8 py-5">
                  <h4 className="text-sm font-bold text-stone-950">{app.ownerFullName}</h4>
                  <p className="text-[0.65rem] text-stone-500 font-medium">{app.ownerEmail}</p>
                </td>
                <td className="px-8 py-5 text-xs font-semibold text-stone-500">
                  {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Pending'}
                </td>
                <td className="px-8 py-5">
                   <div className={`inline-flex px-3 py-1 rounded-full text-[0.6rem] font-black border ${
                     app.status === 'SUBMITTED' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                     app.status === 'APPROVED' ? 'bg-green-50 text-green-600 border-green-100' : 
                     'bg-red-50 text-red-600 border-red-100'
                   }`}>
                      {app.status}
                   </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <button 
                    onClick={() => fetchApplicationDetails(app.id)} 
                    disabled={isDetailLoading}
                    className="h-9 px-4 bg-stone-950 text-white rounded-xl text-[0.65rem] font-black uppercase tracking-widest hover:bg-orange-600 transition-all disabled:opacity-50"
                  >
                    {isDetailLoading && (!selectedApp || selectedApp.id === app.id) ? "Loading..." : "Review"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ApplicationReviewModal 
        isOpen={isReviewOpen} 
        application={selectedApp} 
        onClose={() => { setIsReviewOpen(false); setSelectedApp(null); }} 
        onApprove={handleApprove} 
        onReject={handleReject} 
      />
      
      {isDetailLoading && !selectedApp && (
        <div className="fixed inset-0 z-[110] bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
           <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default MerchantApplicationsView;
