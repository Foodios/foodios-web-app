import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo-transparent-logo.png";
import banner from "../assets/food-cooking.jpg";

const Register: React.FC = () => {
  return (
    <div className="flex min-h-screen w-full bg-white font-sans overflow-hidden">
      {/* Left Side: Visual Banner (Hidden on small screens) */}
      <div className="relative hidden lg:flex lg:w-3/5 bg-stone-900 overflow-hidden">
        <img
          src={banner}
          alt="Registration Banner"
          className="absolute inset-0 h-full w-full object-cover opacity-60 scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent" />
        
        <div className="absolute top-16 left-16 z-20">
          <Link to="/" className="inline-block transition-transform hover:scale-105">
            <img src={logo} alt="Foodio" className="h-10 w-auto brightness-0 invert" />
          </Link>
        </div>

        <div className="relative z-10 flex flex-col justify-center p-16 w-full h-full">
          <div className="max-w-xl">
            <h2 className="text-white text-[4rem] font-black leading-[1.1] tracking-tight mb-6">
              Start your <br />
              <span className="text-orange-500">delicious</span> journey.
            </h2>
            <p className="text-stone-300 text-xl font-medium leading-relaxed mb-8">
              Join the largest community of food lovers and couriers. Experience the future of delivery today.
            </p>
            
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
              <div>
                <p className="text-white text-3xl font-bold mb-1">500+</p>
                <p className="text-stone-400 text-sm uppercase tracking-widest font-bold">Cities covered</p>
              </div>
              <div>
                <p className="text-white text-3xl font-bold mb-1">2M+</p>
                <p className="text-stone-400 text-sm uppercase tracking-widest font-bold">Happy customers</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-16 left-16 z-20 text-stone-500 text-sm font-medium">
          © 2026 Foodio Inc. All rights reserved.
        </div>

        {/* Decorative floating element */}
        <div className="absolute top-20 right-20 h-32 w-32 rounded-full bg-orange-500/20 blur-3xl animate-pulse" />
      </div>

      {/* Right Side: Registration Form */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center bg-white overflow-y-auto pb-12 shadow-2xl z-10">
        <div className="max-w-[440px] w-full mx-auto px-6 py-12">
          <div className="lg:hidden mb-12 text-center">
            <Link to="/">
              <img src={logo} alt="Foodio" className="h-10 w-auto mx-auto" />
            </Link>
          </div>

          <div className="mb-12">
            <h1 className="text-[2.2rem] font-bold tracking-tight text-stone-950 mb-3">Create an account</h1>
            <p className="text-stone-500 font-medium">Join us and discover the best food near you.</p>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[0.7rem] font-bold uppercase tracking-widest text-stone-400 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full h-12 bg-stone-50 border border-stone-100 rounded-xl px-4 text-stone-900 outline-none transition-all focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 placeholder:text-stone-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[0.7rem] font-bold uppercase tracking-widest text-stone-400 ml-1">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="johndoe"
                  className="w-full h-12 bg-stone-50 border border-stone-100 rounded-xl px-4 text-stone-900 outline-none transition-all focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 placeholder:text-stone-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[0.7rem] font-bold uppercase tracking-widest text-stone-400 ml-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className="w-full h-12 bg-stone-50 border border-stone-100 rounded-xl px-4 text-stone-900 outline-none transition-all focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 placeholder:text-stone-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[0.7rem] font-bold uppercase tracking-widest text-stone-400 ml-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+84 123 456 789"
                className="w-full h-12 bg-stone-50 border border-stone-100 rounded-xl px-4 text-stone-900 outline-none transition-all focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 placeholder:text-stone-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[0.7rem] font-bold uppercase tracking-widest text-stone-400 ml-1">
                Delivery Address
              </label>
              <input
                type="text"
                placeholder="123 Street Name, City"
                className="w-full h-12 bg-stone-50 border border-stone-100 rounded-xl px-4 text-stone-900 outline-none transition-all focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 placeholder:text-stone-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[0.7rem] font-bold uppercase tracking-widest text-stone-400 ml-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full h-12 bg-stone-50 border border-stone-100 rounded-xl px-4 text-stone-900 outline-none transition-all focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 placeholder:text-stone-300"
              />
            </div>

            <div className="flex items-center gap-3 ml-1 pt-2">
              <input type="checkbox" id="terms" className="h-4 w-4 rounded border-stone-200 text-orange-600 focus:ring-orange-500 cursor-pointer" />
              <label htmlFor="terms" className="text-sm font-medium text-stone-500 cursor-pointer select-none">
                I agree to the <a href="#" className="text-stone-950 underline underline-offset-4 font-bold">Terms & Conditions</a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full h-14 bg-stone-950 text-white font-bold rounded-2xl shadow-xl transition-all hover:bg-orange-600 hover:-translate-y-1 active:translate-y-0"
            >
              Create Account
            </button>
          </form>

          <div className="mt-12 text-center">
            <span className="text-stone-400 text-sm font-medium mr-2">Already have an account?</span>
            <Link to="/login" className="text-stone-950 font-bold hover:text-orange-600 transition-colors">
              Log in instead
            </Link>
          </div>

          <div className="mt-16 text-center lg:mt-24">
            <Link to="/" className="text-stone-400 text-[0.7rem] font-bold uppercase tracking-[0.2em] hover:text-stone-950 transition-colors">
              ← Back to landing page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
