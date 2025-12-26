import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      users: [],
      addUsers: (user) =>
        set((state) => ({
          users: [...state.users, user],
        })),
      deleteUsers: (id) =>
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        })),
      updateUsers: (id, updatedUser) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...updatedUser } : user
          ),
        })),
    }),
    {
      name: "User-Storage",
    }
  )
);

export default useUserStore;
