"use client";

import React, { useState, useEffect } from "react";
import useUserStore from "@/app/hooks/userStore";
import { v4 as uuidv4 } from "uuid";
import {
  Calendar,
  Flag,
  Edit3,
  Trash2,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";

const TasksPage = () => {
  const { users, addUsers, deleteUsers, updateUsers } = useUserStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "low",
    duedate: "",
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("taskflow_user");
      if (storedUser) {
        Promise.resolve().then(() => {
          setCurrentUser(JSON.parse(storedUser));
        });
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleForm = (e) => {
    e.preventDefault();
    if (editId) {
      updateUsers(editId, formData);
      toast.success("Task updated!");
    } else {
      addUsers({ ...formData, id: uuidv4(), userId: currentUser?.id });
      toast.success("Task added!");
    }
    resetForm();
  };

  const resetForm = () => {
    setEditId(null);
    setIsFormOpen(false);
    setFormData({
      title: "",
      description: "",
      status: "todo",
      priority: "low",
      duedate: "",
    });
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setFormData({
      title: user.title,
      description: user.description,
      status: user.status,
      priority: user.priority,
      duedate: user.duedate,
    });
    setIsFormOpen(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-rose-50 text-rose-600 border-rose-100";
      case "medium":
        return "bg-amber-50 text-amber-600 border-amber-100";
      default:
        return "bg-blue-50 text-blue-600 border-blue-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "onprogress":
        return <Clock className="w-4 h-4 text-amber-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-neutral-400" />;
    }
  };

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-8 space-y-8 bg-neutral-50 min-h-screen">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
            Tasks
          </h1>
          <p className="text-neutral-500 font-medium">
            Keep track of your workspace activities
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Create New Task
        </button>
      </div>

      {/* Task Creation Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetForm}
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-neutral-900">
                  {editId ? "Edit Task" : "New Task"}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-neutral-50 rounded-xl transition-colors text-neutral-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleForm} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-neutral-700 ml-1">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter task title"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-bold text-neutral-700 ml-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      placeholder="What needs to be done?"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all min-h-[100px] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-neutral-700 ml-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                      >
                        <option value="todo">To Do</option>
                        <option value="onprogress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-bold text-neutral-700 ml-1">
                        Priority
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-bold text-neutral-700 ml-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      name="duedate"
                      value={formData.duedate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-6 py-3 border border-neutral-200 text-neutral-600 font-bold rounded-xl hover:bg-neutral-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                  >
                    {editId ? "Save Changes" : "Create Task"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tasks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {users.filter((task) => task.userId === currentUser?.id).length ===
        0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-neutral-200">
            <div className="p-4 bg-neutral-50 rounded-full mb-4">
              <Search className="w-8 h-8 text-neutral-300" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900">No tasks yet</h3>
            <p className="text-neutral-500">
              Create your first task to get started
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {users
              .filter((task) => task.userId === currentUser?.id)
              .map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-100 bg-neutral-50">
                      {getStatusIcon(task.status)}
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                        {task.status === "onprogress"
                          ? "In Progress"
                          : task.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(task)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          deleteUsers(task.id);
                          toast.success("Task deleted");
                        }}
                        className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <h3 className="text-lg font-bold text-neutral-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {task.title}
                    </h3>
                    <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed h-[40px]">
                      {task.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-neutral-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs font-bold">{task.duedate}</span>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      <Flag className="w-3.5 h-3.5 fill-current" />
                      <span className="text-[10px] font-bold uppercase">
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
