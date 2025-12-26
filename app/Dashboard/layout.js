"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  CheckSquare,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Settings,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const Layout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Fix for React lint rule:
    // Only read as a flag after first render
    setMounted(true);
    // Only run localStorage/effect on client
    // No need to pass router in dep array, since it's stable (and next/navigation docs recommend this)
    try {
      const storedUser = localStorage.getItem("taskflow_user");
      if (!storedUser) {
        router.push("/");
      } else {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navItems = [
    {
      name: "Dashboard",
      href: "/Dashboard/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Tasks",
      href: "/Dashboard/tasks",
      icon: <CheckSquare className="w-5 h-5" />,
    },
    {
      name: "Profile",
      href: "/Dashboard/profile",
      icon: <UserIcon className="w-5 h-5" />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("taskflow_user");
    setUser(null);
    toast.success("Logged out successfully");
    setTimeout(() => router.push("/"), 800);
  };

  // Prevent rendering on server, or if user is missing
  if (!mounted || !user) return null;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold italic text-xs">
            TF
          </div>
          <span className="font-bold text-neutral-900">TaskFlow</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-neutral-500"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <aside
        className={`
        fixed inset-0 z-40 md:relative md:translate-x-0 transition-transform duration-300
        w-72 bg-white border-r border-neutral-200 flex flex-col
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static
      `}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold italic">
              TF
            </div>
            <span className="font-extrabold text-xl text-neutral-900 tracking-tight">
              TaskFlow
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-100/50"
                        : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                    }
                  `}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4">
          <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold uppercase">
                {user && user.name && typeof user.name === "string"
                  ? user.name.charAt(0)
                  : "U"}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-neutral-900 text-sm truncate">
                  {(user && user.name) || "User"}
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  {user && user.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex cursor-pointer items-center justify-center gap-2 py-2.5 bg-white hover:bg-rose-50 text-rose-600 border border-neutral-200 hover:border-rose-100 rounded-xl text-sm font-bold transition-all"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto min-h-screen">{children}</div>
      </main>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-30 md:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
