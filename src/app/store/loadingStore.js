// src/app/store/loadingStore.js
import { create } from "zustand";

export const useLoadingStore = create((set) => ({
  isLoading: false,
  title: "",
  setIsLoading: (loading) => set({ isLoading: loading }),
  setTitle: (title) => set({ title }),
}));
