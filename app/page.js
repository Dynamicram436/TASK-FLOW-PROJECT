"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, ArrowRight, UserPlus, LogIn } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("taskflow_user");
    if (user) {
      router.push("/Dashboard");
    }
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login Logic
        const storedUsers = JSON.parse(
          localStorage.getItem("taskflow_users") || "[]"
        );
        const user = storedUsers.find(
          (u) => u.email === formData.email && u.password === formData.password
        );

        if (user) {
          localStorage.setItem("taskflow_user", JSON.stringify(user));
          toast.success("Welcome back!");
          setTimeout(() => router.push("/Dashboard"), 1000);
        } else {
          toast.error("Invalid email or password");
        }
      } else {
        // Signup Logic
        if (!formData.name || !formData.email || !formData.password) {
          toast.error("Please fill all fields");
          setIsLoading(false);
          return;
        }

        const storedUsers = JSON.parse(
          localStorage.getItem("taskflow_users") || "[]"
        );
        if (storedUsers.some((u) => u.email === formData.email)) {
          toast.error("User already exists with this email");
        } else {
          const newUser = {
            id: Date.now(),
            name: formData.name,
            email: formData.email,
            password: formData.password, // In a real app, never store plain text passwords
            createdAt: new Date().toISOString(),
          };
          storedUsers.push(newUser);
          localStorage.setItem("taskflow_users", JSON.stringify(storedUsers));
          toast.success("Account created successfully! Please login.");
          setTimeout(() => setIsLogin(true), 1000);
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <Toaster position="top-center" />

      <div className="max-w-md w-full">
        {/* Branding */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 mb-4"
          >
            <span className="text-white text-2xl font-bold italic">TF</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-neutral-900">TaskFlow</h1>
          <p className="text-neutral-500 mt-2">
            Manage your productivity with ease
          </p>
        </div>

        {/* Auth Card */}
        <motion.div
          layout
          className="bg-white rounded-3xl shadow-xl shadow-neutral-200/50 border border-neutral-100 p-8"
        >
          <div className="flex bg-neutral-100 p-1 rounded-xl mb-8">
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg cursor-pointer text-sm font-medium transition-all ${
                !isLogin
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg cursor-pointer text-sm font-medium transition-all ${
                isLogin
                  ? "bg-white text-blue-600  shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              Login
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? "login" : "signup"}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 ml-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 ml-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isLogin ? (
                  <>
                    <LogIn className="w-5 h-5" />
                    Log In
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Sign Up
                  </>
                )}
              </button>
            </motion.form>
          </AnimatePresence>

          <p className="text-center text-neutral-500 text-sm mt-8">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 cursor-pointer font-semibold hover:underline"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </motion.div>

        {/* Footer info */}
        <div className="mt-8 flex items-center justify-center gap-6 text-neutral-400 text-xs font-medium uppercase tracking-wider">
          <span className="cursor-pointer">Privacy Policy</span>
          <span className="w-1 h-1 bg-neutral-300 rounded-full" />
          <span className="cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </div>
  );
}
