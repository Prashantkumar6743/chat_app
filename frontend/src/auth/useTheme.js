import { create } from "zustand";

export const useTheme = create((set, get) => ({
  theme: localStorage.getItem("chat-theme") || "dark",
  lastUserTheme: null,

  setTheme: (theme, persist = true) => {
    if (persist) {
      localStorage.setItem("chat-theme", theme);
    }
    set({ theme });
  },
  storeLastUserTheme: () => {
    const currentTheme = get().theme;
    set({ lastUserTheme: currentTheme });
  },
  restoreLastUserTheme: () => {
    const last = get().lastUserTheme;
    if (last) set({ theme: last });
  },
}));
