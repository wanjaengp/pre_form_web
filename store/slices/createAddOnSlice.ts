import { StateCreator } from "zustand";

type AddOn = {
  id: number;
  name: string;
  description: string;
  price: number;
  type: string;
};

type LoanApplication = {
  id: string;
  status: string;
  purpose: string;
};

type AddOnSlice = {
  selectedAddOns: AddOn[];
  toggleAddOn: (addOn: AddOn) => void;
  unToggledAddOn: (addOnId: number) => void;

  // 👇 Add this for Addons.tsx -> Summary.tsx state sharing
  selectedApplications: LoanApplication[];
  setSelectedApplications: (apps: LoanApplication[]) => void;
};

const createAddOnSlice: StateCreator<AddOnSlice> = (set) => ({
  selectedAddOns: [],
  toggleAddOn: (addOn) =>
    set((state) => ({
      selectedAddOns: state.selectedAddOns.concat(addOn),
    })),
  unToggledAddOn: (addOnId) =>
    set((state) => ({
      selectedAddOns: state.selectedAddOns.filter((c) => c.id !== addOnId),
    })),

  // 👇 new logic
  selectedApplications: [],
  setSelectedApplications: (apps) => set({ selectedApplications: apps }),
});

export default createAddOnSlice;
export type { AddOn, LoanApplication, AddOnSlice };
