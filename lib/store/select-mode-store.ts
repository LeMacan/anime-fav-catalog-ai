import { create } from "zustand";

interface SelectModeState {
  isEnabled: boolean;
  selectedIds: Set<number>;
  toggleSelectMode: () => void;
  toggleSelect: (id: number) => void;
  selectAll: (ids: number[]) => void;
  deselectAll: () => void;
  clearSelection: () => void;
  getSelectedCount: () => number;
}

export const useSelectModeStore = create<SelectModeState>((set, get) => ({
  isEnabled: false,
  selectedIds: new Set<number>(),

  toggleSelectMode: () => {
    set((state) => ({
      isEnabled: !state.isEnabled,
      selectedIds: new Set(), // Clear selection when toggling off
    }));
  },

  toggleSelect: (id: number) => {
    set((state) => {
      const newSelected = new Set(state.selectedIds);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return { selectedIds: newSelected };
    });
  },

  selectAll: (ids: number[]) => {
    set({ selectedIds: new Set(ids) });
  },

  deselectAll: () => {
    set({ selectedIds: new Set() });
  },

  clearSelection: () => {
    set({ isEnabled: false, selectedIds: new Set() });
  },

  getSelectedCount: () => {
    return get().selectedIds.size;
  },
}));