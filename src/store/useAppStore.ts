import { create } from 'zustand';

interface AppState {
    isBooted: boolean;
    setBooted: (value: boolean) => void;
    isLoading: boolean;
    setLoading: (value: boolean) => void;
    cursorPosition: { x: number; y: number };
    setCursorPosition: (position: { x: number; y: number }) => void;
}

export const useAppStore = create<AppState>((set) => ({
    isBooted: false,
    setBooted: (value) => set({ isBooted: value }),
    isLoading: true,
    setLoading: (value) => set({ isLoading: value }),
    cursorPosition: { x: 0, y: 0 },
    setCursorPosition: (position) => set({ cursorPosition: position }),
}));
