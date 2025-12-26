"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  BarChart3,
  PieChart as PieIcon,
  Layers,
} from "lucide-react";
import useUserStore from "@/app/hooks/userStore";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { motion } from "framer-motion";

const Page = () => {
  const { users = [] } = useUserStore();
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
     // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("taskflow_user");
        if (storedUser) {
          Promise.resolve().then(() => {
            setUser(JSON.parse(storedUser));
          });
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const currentUserTasks = Array.isArray(users)
    ? users.filter((u) => u.userId === user?.id)
    : [];

  const safeUsers = currentUserTasks;

  const stats = [
    {
      label: "Total Tasks",
      value: safeUsers.length,
      icon: <Layers className="text-blue-600 w-5 h-5" />,
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      label: "Completed",
      value: safeUsers.filter((u) => u.status === "completed").length,
      icon: <CheckCircle2 className="text-emerald-600 w-5 h-5" />,
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      label: "In Progress",
      value: safeUsers.filter((u) => u.status === "onprogress").length,
      icon: <Clock className="text-amber-600 w-5 h-5" />,
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
    {
      label: "High Priority",
      value: safeUsers.filter((u) => u.priority === "high").length,
      icon: <AlertTriangle className="text-rose-600 w-5 h-5" />,
      bg: "bg-rose-50",
      border: "border-rose-100",
    },
  ];

  const pieData = [
    {
      id: 0,
      value:
        safeUsers.filter((u) => u.status === "todo").length ||
        (safeUsers.length === 0 ? 1 : 0),
      label: "To Do",
      color: "#64748b",
    },
    {
      id: 1,
      value: safeUsers.filter((u) => u.status === "onprogress").length,
      label: "Pending",
      color: "#f59e0b",
    },
    {
      id: 2,
      value: safeUsers.filter((u) => u.status === "completed").length,
      label: "Done",
      color: "#10b981",
    },
  ];

  const barData = [
    safeUsers.filter((u) => u.priority === "low").length,
    safeUsers.filter((u) => u.priority === "medium").length,
    safeUsers.filter((u) => u.priority === "high").length,
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 bg-neutral-50 min-h-full">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
            Overview
          </h1>
          <p className="text-neutral-500 font-medium">
            Welcome back,{" "}
            <span className="text-blue-600 font-bold">
              {user?.name || "User"}
            </span>
            ! Here&apos;s what&apos;s happening.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-600 shadow-sm">
            {mounted &&
              new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 bg-white border ${stat.border} rounded-3xl shadow-sm hover:shadow-md transition-shadow group`}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 ${stat.bg} rounded-2xl group-hover:scale-110 transition-transform`}
              >
                {stat.icon}
              </div>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                Active
              </span>
            </div>
            <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider">
              {stat.label}
            </h3>
            <p className="text-3xl font-black text-neutral-900 mt-1">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6 text-neutral-900">
            <PieIcon className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold">Task Distribution</h2>
          </div>
          <div className="flex justify-center h-[300px]">
            <PieChart
              series={[
                {
                  paddingAngle: 5,
                  innerRadius: 60,
                  outerRadius: 100,
                  cornerRadius: 10,
                  data: pieData,
                },
              ]}
              width={400}
              height={300}
              slotProps={{
                legend: {
                  direction: "column",
                  position: { vertical: "middle", horizontal: "right" },
                  padding: 20,
                  sx: {
                    "& .MuiChartsLegend-label": {
                      fontSize: "12px",
                      fontWeight: 600,
                    },
                  },
                },
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6 text-neutral-900">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold">Tasks by Priority</h2>
          </div>
          <div className="flex justify-center h-[300px] w-full">
            <BarChart
              xAxis={[
                {
                  data: ["Low", "Med", "High"],
                  scaleType: "band",
                  categoryGapRatio: 0.5,
                },
              ]}
              series={[
                {
                  data: barData,
                  color: "#4f46e5",
                },
              ]}
              height={300}
              width={400}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Page;
