"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  Shield,
  MapPin,
  Camera,
  LogOut,
  Edit2,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    try {
      const storedUser = localStorage.getItem("taskflow_user");
      if (!storedUser) {
        router.push("/");
      } else {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error parsing user:", error);
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("taskflow_user");
    setUser(null);
    toast.success("Logged out successfully");
    setTimeout(() => router.push("/"), 800);
  };

  const handleFeatureNotice = () => {
    toast.error("This feature is coming soon!");
  };

  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";
  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not available";

  return (
    <div className="min-h-full py-8 px-4 sm:px-6 lg:px-8 bg-neutral-50">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
              User Profile
            </h1>
            <p className="text-neutral-500 mt-1">
              Manage your account information and preferences
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center cursor-pointer gap-2 px-6 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl font-semibold transition-all border border-rose-100 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>

        {/* Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Avatar & Core Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm flex flex-col items-center text-center"
          >
            <div className="relative group">
              <div className="w-32 h-32 bg-linear-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                {userInitial}
              </div>
              <button
                onClick={handleFeatureNotice}
                className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg border border-neutral-100 text-neutral-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-bold text-neutral-900">
                {user.name || "User"}
              </h2>
              <p className="text-sm text-neutral-500 font-medium">
                TaskFlow Member
              </p>
            </div>

            <div className="mt-8 w-full space-y-3">
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl text-left border border-neutral-100">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                    Email
                  </p>
                  <p className="text-sm text-neutral-800 font-medium truncate max-w-[150px]">
                    {user.email || "No email"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl text-left border border-neutral-100">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Shield className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                    Account Status
                  </p>
                  <p className="text-sm text-neutral-800 font-medium">
                    Verified Member
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Details Forms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Personal Details */}
            <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </h3>
                <button
                  onClick={handleFeatureNotice}
                  className="text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">
                    Full Name
                  </label>
                  <p className="mt-1 px-1 py-1 text-neutral-900 font-medium border-b border-neutral-100">
                    {user.name || "User"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <p className="mt-1 px-1 py-1 text-neutral-900 font-medium border-b border-neutral-100">
                    {user.email || "No email provided"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">
                    Joined Date
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-neutral-400" />
                    <p className="text-neutral-900 font-medium">
                      {formattedDate}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">
                    Location
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-neutral-400" />
                    <p className="text-neutral-900 font-medium">
                      Not Specified
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Settings / Meta */}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
