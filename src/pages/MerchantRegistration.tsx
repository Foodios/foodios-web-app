import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Store, MapPin, Clock, ChevronRight, ChevronLeft,
  ArrowLeft, Upload, CheckCircle2, Loader2, User, 
  Lock, Building2, CreditCard, FileCheck, Globe, Trash2, Plus
} from "lucide-react";
import Header from "../components/Header";
import SideNav from "../components/SideNav";

const BUSINESS_TYPES = [
  { value: "RESTAURANT", label: "Restaurant" },
  { value: "FAST_FOOD", label: "Fast Food" },
  { value: "CAFE", label: "Cafe & Coffee" },
  { value: "BAKERY", label: "Bakery & Pastry" },
  { value: "GROCERY", label: "Grocery & Essentials" },
];

const DAYS_OF_WEEK = [
  { id: 1, label: "Monday" },
  { id: 2, label: "Tuesday" },
  { id: 3, label: "Wednesday" },
  { id: 4, label: "Thursday" },
  { id: 5, label: "Friday" },
  { id: 6, label: "Saturday" },
  { id: 0, label: "Sunday" },
];

const MerchantRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  // Unified Form State matching the API request
  const [formData, setFormData] = useState({
    owner: {
      fullName: "",
      email: "",
      phone: "",
      password: ""
    },
    merchant: {
      merchantName: "",
      brandName: "",
      description: "",
      businessType: "RESTAURANT",
      taxCode: "",
      businessRegistrationNumber: "",
      businessLicenseImageUrl: "",
      foodSafetyLicenseImageUrl: "",
      contactPhone: "",
      contactEmail: "",
      contactName: ""
    },
    address: {
      line1: "",
      line2: "",
      ward: "",
      district: "",
      city: "",
      province: "",
      postalCode: "700000",
      country: "VN",
      latitude: 10.776889,
      longitude: 106.700806
    },
    payout: {
      bankName: "",
      bankAccountName: "",
      bankAccountNumber: "",
      bankBranch: ""
    },
    operatingHours: DAYS_OF_WEEK.map(day => ({
      dayOfWeek: day.id,
      openTime: "08:00:00",
      closeTime: "22:00:00",
      closed: false
    }))
  });

  const toggleSideNav = () => setIsSideNavOpen(!isSideNavOpen);
  const closeSideNav = () => setIsSideNavOpen(false);

  const updateNestedField = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        //@ts-ignore
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleOperatingHoursChange = (index: number, field: string, value: any) => {
    const newHours = [...formData.operatingHours];
    //@ts-ignore
    newHours[index][field] = value;
    setFormData(prev => ({ ...prev, operatingHours: newHours }));
  };

  const isStepValid = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return (
          formData.owner.fullName.trim() !== "" &&
          formData.owner.email.trim() !== "" &&
          formData.owner.phone.trim() !== "" &&
          formData.owner.password.trim() !== "" &&
          formData.merchant.merchantName.trim() !== "" &&
          formData.merchant.brandName.trim() !== ""
        );
      case 2:
        return (
          formData.merchant.taxCode.trim() !== "" &&
          formData.merchant.businessRegistrationNumber.trim() !== ""
        );
      case 3:
        return (
          formData.address.line1.trim() !== "" &&
          formData.address.ward.trim() !== "" &&
          formData.address.district.trim() !== "" &&
          formData.address.city.trim() !== ""
        );
      case 4:
        return (
          formData.payout.bankName.trim() !== "" &&
          formData.payout.bankAccountName.trim() !== "" &&
          formData.payout.bankAccountNumber.trim() !== "" &&
          formData.payout.bankBranch.trim() !== ""
        );
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (isStepValid(step)) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      nextStep();
      return;
    }
    
    setIsSubmitting(true);
    console.log("Submitting Merchant Data:", formData);
    
    // Simulating API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-black text-stone-950">Application Received!</h1>
            <p className="text-stone-500 font-medium leading-relaxed">
              We've received your registration for <span className="text-stone-950 font-bold">{formData.merchant.merchantName}</span>. Our team will verify your documents and get back to you shortly.
            </p>
          </div>
          <button 
            onClick={() => navigate("/")}
            className="w-full h-14 bg-stone-950 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all active:scale-95 shadow-xl shadow-stone-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header isHeroActive={false} onMenuClick={toggleSideNav} />
      <SideNav isOpen={isSideNavOpen} onClose={closeSideNav} />
      
      <div className="pt-20 pb-20">
        {/* Header Block - Luxurious & Deep */}
        <div className="bg-stone-950 text-white pt-12 pb-28 px-6 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] -ml-32 -mb-32" />
          
          <div className="max-w-4xl mx-auto relative z-10">
            <button 
              onClick={() => navigate("/")}
              className="group inline-flex items-center gap-2 text-stone-500 hover:text-white transition-all mb-8 font-bold text-xs uppercase tracking-widest"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Exit Registration
            </button>
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-stone-400">Merchant Portal</span>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
                  Become a Partner<span className="text-orange-500">.</span>
                </h1>
                <div className="h-1 w-20 bg-orange-500 rounded-full" />
              </div>
              
              <p className="text-stone-400 text-sm md:text-lg font-medium max-w-2xl leading-relaxed">
                {step === 1 ? "Start your journey by setting up your owner account and brand identity." : 
                 step === 2 ? "Provide your business credentials and upload necessary operating licenses." : 
                 step === 3 ? "Define your store location and set up your daily operating hours." : "Set up your payout information to start receiving earnings."}
              </p>
            </div>
          </div>
        </div>

        {/* Numbered Progress Bar - Placed in the white gap */}
        <div className="max-w-4xl mx-auto px-6 pt-12 pb-8">
          <div className="flex items-center justify-between relative">
            {/* Connecting Lines Background */}
            <div className="absolute left-0 top-5 w-full h-[2px] bg-stone-100 -z-0" />
            
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="relative z-10 flex flex-col items-center gap-3">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-black transition-all duration-500 border-4
                  ${s < step ? "bg-orange-500 border-orange-100 text-white scale-90" : 
                    s === step ? "bg-orange-500 border-orange-100 text-white scale-110 shadow-lg shadow-orange-200" : 
                    "bg-white border-stone-100 text-stone-300"}
                `}>
                  {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
                </div>
                <span className={`text-[0.6rem] font-black uppercase tracking-widest transition-colors duration-500 ${s === step ? "text-orange-500" : "text-stone-300"}`}>
                  Step {s}
                </span>
              </div>
            ))}

            {/* Active Connecting Line Progress */}
            <div 
              className="absolute left-0 top-5 h-[2px] bg-orange-500 transition-all duration-500 -z-0"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Wizard Card - Pushed down further */}
        <div className="max-w-4xl mx-auto px-6 pb-20 relative z-20">
          <form onSubmit={handleSubmit} className="bg-white rounded-[40px] border border-stone-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] overflow-hidden">
            
            <div className="p-8 md:p-10">
              
              {/* STEP 1: Owner & Merchant Identity */}
              {step === 1 && (
                <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-orange-500" />
                      </div>
                      <h3 className="text-xl font-black text-stone-950">Owner Account</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[0.65rem] font-black text-stone-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input required type="text" value={formData.owner.fullName} onChange={(e) => updateNestedField("owner", "fullName", e.target.value)} placeholder="Full name of owner" className="w-full h-12 px-4 rounded-xl bg-stone-50 border border-stone-100 focus:bg-white focus:border-orange-500 outline-none transition-all font-medium" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[0.65rem] font-black text-stone-400 uppercase tracking-widest ml-1">Email</label>
                        <input required type="email" value={formData.owner.email} onChange={(e) => updateNestedField("owner", "email", e.target.value)} placeholder="owner@example.com" className="w-full h-12 px-4 rounded-xl bg-stone-50 border border-stone-100 focus:bg-white focus:border-orange-500 outline-none transition-all font-medium" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[0.65rem] font-black text-stone-400 uppercase tracking-widest ml-1">Phone</label>
                        <input required type="tel" value={formData.owner.phone} onChange={(e) => updateNestedField("owner", "phone", e.target.value)} placeholder="090 XXX XXXX" className="w-full h-12 px-4 rounded-xl bg-stone-50 border border-stone-100 focus:bg-white focus:border-orange-500 outline-none transition-all font-medium" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[0.65rem] font-black text-stone-400 uppercase tracking-widest ml-1">Password</label>
                        <input required type="password" value={formData.owner.password} onChange={(e) => updateNestedField("owner", "password", e.target.value)} placeholder="Create password" className="w-full h-12 px-4 rounded-xl bg-stone-50 border border-stone-100 focus:bg-white focus:border-orange-500 outline-none transition-all font-medium" />
                      </div>
                    </div>
                  </div>

                  <hr className="border-stone-50" />

                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-stone-900 rounded-xl flex items-center justify-center">
                        <Store className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-black text-stone-950">Brand Identity</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[0.65rem] font-black text-stone-400 uppercase tracking-widest ml-1">Merchant Name</label>
                        <input required type="text" value={formData.merchant.merchantName} onChange={(e) => updateNestedField("merchant", "merchantName", e.target.value)} placeholder="Full Legal Name" className="w-full h-12 px-4 rounded-xl bg-stone-50 border border-stone-100 focus:bg-white focus:border-orange-500 outline-none transition-all font-medium" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[0.65rem] font-black text-stone-400 uppercase tracking-widest ml-1">Brand Name</label>
                        <input required type="text" value={formData.merchant.brandName} onChange={(e) => updateNestedField("merchant", "brandName", e.target.value)} placeholder="Public Display Name" className="w-full h-12 px-4 rounded-xl bg-stone-50 border border-stone-100 focus:bg-white focus:border-orange-500 outline-none transition-all font-medium" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[0.65rem] font-black text-stone-400 uppercase tracking-widest ml-1">Business Type</label>
                        <select value={formData.merchant.businessType} onChange={(e) => updateNestedField("merchant", "businessType", e.target.value)} className="w-full h-12 px-4 rounded-xl bg-stone-50 border border-stone-100 focus:bg-white focus:border-orange-500 outline-none transition-all font-medium appearance-none">
                          {BUSINESS_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                      </div>
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-[0.65rem] font-black text-stone-400 uppercase tracking-widest ml-1">Description</label>
                        <textarea required value={formData.merchant.description} onChange={(e) => updateNestedField("merchant", "description", e.target.value)} placeholder="Describe your food/services..." rows={3} className="w-full p-4 rounded-xl bg-stone-50 border border-stone-100 focus:bg-white focus:border-orange-500 outline-none transition-all font-medium resize-none" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Business & Licenses */}
              {step === 2 && (
                <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-500" />
                      </div>
                      <h3 className="text-xl font-black text-stone-950">Business Credentials</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[0.65rem] font-black text-stone-400 uppercase tracking-widest ml-1">Tax Code (MST)</label>
                        <input required type="text" value={formData.merchant.taxCode} onChange={(e) => updateNestedField("merchant", "taxCode", e.target.value)} placeholder="10-digit tax code" className="w-full h-12 px-4 rounded-xl bg-stone-50 border border-stone-100 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[0.65rem] font-black text-stone-400 uppercase tracking-widest ml-1">Business Registration #</label>
                        <input required type="text" value={formData.merchant.businessRegistrationNumber} onChange={(e) => updateNestedField("merchant", "businessRegistrationNumber", e.target.value)} placeholder="License number" className="w-full h-12 px-4 rounded-xl bg-stone-50 border border-stone-100 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                        <FileCheck className="w-5 h-5 text-green-500" />
                      </div>
                      <h3 className="text-xl font-black text-stone-950">Documents Upload</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border-2 border-dashed border-stone-100 rounded-3xl p-6 text-center hover:border-blue-200 transition-all cursor-pointer bg-stone-50/30">
                        <Upload className="w-6 h-6 text-stone-300 mx-auto mb-2" />
                        <p className="text-xs font-black text-stone-950">Business License Image</p>
                        <p className="text-[0.6rem] text-stone-400 uppercase font-bold mt-1">Required</p>
                      </div>
                      <div className="border-2 border-dashed border-stone-100 rounded-3xl p-6 text-center hover:border-green-200 transition-all cursor-pointer bg-stone-50/30">
                        <Upload className="w-6 h-6 text-stone-300 mx-auto mb-2" />
                        <p className="text-xs font-black text-stone-950">Food Safety License</p>
                        <p className="text-[0.6rem] text-stone-400 uppercase font-bold mt-1">Required</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-stone-50 rounded-3xl p-6 space-y-6">
                    <h3 className="text-sm font-black text-stone-950">Representative Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <input type="text" placeholder="Contact Name" value={formData.merchant.contactName} onChange={(e) => updateNestedField("merchant", "contactName", e.target.value)} className="h-11 px-4 rounded-xl border-stone-100 outline-none" />
                       <input type="email" placeholder="Contact Email" value={formData.merchant.contactEmail} onChange={(e) => updateNestedField("merchant", "contactEmail", e.target.value)} className="h-11 px-4 rounded-xl border-stone-100 outline-none" />
                       <input type="tel" placeholder="Contact Phone" value={formData.merchant.contactPhone} onChange={(e) => updateNestedField("merchant", "contactPhone", e.target.value)} className="h-11 px-4 rounded-xl border-stone-100 outline-none" />
                    </div>
                    <button type="button" onClick={() => {
                        updateNestedField("merchant", "contactName", formData.owner.fullName);
                        updateNestedField("merchant", "contactEmail", formData.owner.email);
                        updateNestedField("merchant", "contactPhone", formData.owner.phone);
                    }} className="text-[0.7rem] font-bold text-blue-600 hover:underline">Use Owner Information</button>
                  </div>
                </div>
              )}

              {/* STEP 3: Location & Operation */}
              {step === 3 && (
                <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-red-500" />
                      </div>
                      <h3 className="text-xl font-black text-stone-950">Address Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-[0.65rem] font-black text-stone-400 uppercase tracking-widest ml-1">Street Address (Line 1)</label>
                        <input required type="text" value={formData.address.line1} onChange={(e) => updateNestedField("address", "line1", e.target.value)} placeholder="Number & street name" className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-100 outline-none focus:bg-white" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[0.65rem] font-black text-stone-400 uppercase tracking-widest ml-1">Floor/Building (Line 2)</label>
                        <input type="text" value={formData.address.line2} onChange={(e) => updateNestedField("address", "line2", e.target.value)} placeholder="Optional" className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-100 outline-none focus:bg-white" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[0.65rem] font-black text-stone-400 uppercase tracking-widest ml-1">Ward</label>
                        <input required type="text" value={formData.address.ward} onChange={(e) => updateNestedField("address", "ward", e.target.value)} placeholder="Ward name" className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-100 outline-none focus:bg-white" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 md:col-span-2">
                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-black text-stone-400 uppercase tracking-widest ml-1">District</label>
                          <input required type="text" value={formData.address.district} onChange={(e) => updateNestedField("address", "district", e.target.value)} placeholder="District" className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-100 outline-none focus:bg-white" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-black text-stone-400 uppercase tracking-widest ml-1">City</label>
                          <input required type="text" value={formData.address.city} onChange={(e) => updateNestedField("address", "city", e.target.value)} placeholder="City" className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-100 outline-none focus:bg-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 text-purple-500" />
                      </div>
                      <h3 className="text-xl font-black text-stone-950">Operating Hours</h3>
                    </div>
                    <div className="space-y-2 border border-stone-50 rounded-3xl overflow-hidden">
                      {formData.operatingHours.map((oh, idx) => (
                        <div key={oh.dayOfWeek} className={`flex items-center justify-between p-4 ${idx % 2 === 0 ? "bg-white" : "bg-stone-50/50"}`}>
                          <div className="flex items-center gap-3 w-32">
                             <input type="checkbox" checked={!oh.closed} onChange={(e) => handleOperatingHoursChange(idx, "closed", !e.target.checked)} className="accent-orange-500" />
                             <span className={`text-sm font-bold ${oh.closed ? "text-stone-300" : "text-stone-950"}`}>{DAYS_OF_WEEK.find(d => d.id === oh.dayOfWeek)?.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <input type="time" value={oh.openTime.substring(0,5)} disabled={oh.closed} onChange={(e) => handleOperatingHoursChange(idx, "openTime", e.target.value + ":00")} className="h-9 px-2 rounded-lg bg-white border border-stone-100 text-xs font-bold disabled:opacity-30" />
                             <span className="text-stone-300">-</span>
                             <input type="time" value={oh.closeTime.substring(0,5)} disabled={oh.closed} onChange={(e) => handleOperatingHoursChange(idx, "closeTime", e.target.value + ":00")} className="h-9 px-2 rounded-lg bg-white border border-stone-100 text-xs font-bold disabled:opacity-30" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Payout Details */}
              {step === 4 && (
                <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-green-500" />
                      </div>
                      <h3 className="text-xl font-black text-stone-950">Banking Information</h3>
                      <p className="text-[0.65rem] font-bold text-stone-400 uppercase tracking-widest bg-stone-100 px-2 py-0.5 rounded ml-auto">Payout</p>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-1.5">
                        <label className="text-[0.65rem] font-black text-stone-400 uppercase tracking-widest ml-1">Bank Name</label>
                        <input required type="text" value={formData.payout.bankName} onChange={(e) => updateNestedField("payout", "bankName", e.target.value)} placeholder="e.g. Vietcombank" className="w-full h-12 px-4 rounded-xl bg-stone-50 border border-stone-100 focus:bg-white focus:border-green-500 outline-none transition-all font-bold" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[0.65rem] font-black text-stone-400 uppercase tracking-widest ml-1">Account Holder Name</label>
                        <input required type="text" value={formData.payout.bankAccountName} onChange={(e) => updateNestedField("payout", "bankAccountName", e.target.value)} placeholder="NAME AS ON BANK ACCOUNT" className="w-full h-12 px-4 rounded-xl bg-stone-50 border border-stone-100 focus:bg-white focus:border-green-500 outline-none transition-all font-bold uppercase" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-black text-stone-400 uppercase tracking-widest ml-1">Account Number</label>
                          <input required type="text" value={formData.payout.bankAccountNumber} onChange={(e) => updateNestedField("payout", "bankAccountNumber", e.target.value)} placeholder="0001XXXXXX" className="w-full h-12 px-4 rounded-xl bg-stone-50 border border-stone-100 focus:bg-white focus:border-green-500 outline-none transition-all font-bold" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-black text-stone-400 uppercase tracking-widest ml-1">Bank Branch</label>
                          <input required type="text" value={formData.payout.bankBranch} onChange={(e) => updateNestedField("payout", "bankBranch", e.target.value)} placeholder="Branch name" className="w-full h-12 px-4 rounded-xl bg-stone-50 border border-stone-100 focus:bg-white focus:border-green-500 outline-none transition-all font-bold" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-orange-50 rounded-[32px] flex items-start gap-4 border border-orange-100">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                      <Globe className="w-6 h-6 text-orange-500" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-black text-stone-950 text-sm">Agreement & Verification</h4>
                      <p className="text-stone-600 text-xs font-medium leading-relaxed">
                        I hereby declare that the information provided is true and correct. I authorize Foodios to verify my credentials with the relevant authorities for partnership purposes.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer Actions */}
            <div className="p-6 md:p-8 bg-stone-50/50 border-t border-stone-50 flex items-center justify-between gap-4">
              {step > 1 && (
                <button 
                  type="button" 
                  onClick={prevStep}
                  className="h-14 px-8 rounded-2xl border border-stone-200 text-stone-950 font-bold hover:bg-white transition-all flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" /> Back
                </button>
              )}
              
              <button 
                type="submit"
                disabled={isSubmitting || !isStepValid(step)}
                className={`h-14 px-10 rounded-2xl font-black text-white transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl ${step === 4 ? "bg-green-600 shadow-green-100 hover:bg-green-700 ml-auto" : "bg-stone-950 shadow-stone-200 hover:bg-orange-600 ml-auto"}`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    {step === 4 ? "Submit Registration" : "Next Step"} <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MerchantRegistration;
