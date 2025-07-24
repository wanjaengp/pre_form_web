import { StateCreator } from "zustand";

type Plan = {
  id: number;
  name: string;
  price: number;
  type: string;
};

type LoanStatus = {
  applicationId: string;
  fullName: string;
  monthlyIncome: number;
  loanAmount: number;
  loanPurpose: string;
  age: number;
  phoneNumber: string;
  email: string;
  eligible: boolean;
  reason: string;
  timestamp: string;
};

type PlanSlice = {
  plan: Plan;
  setPlan: (plan: Plan) => void;

  applicationId: string;
  setApplicationId: (id: string) => void;

 loanStatus: any | null;
 setLoanStatus: (status: any | null) => void;

};

const initialPlanState: Plan = {
  id: 0,
  name: "",
  price: 0,
  type: "",
};

const createPlanSlice: StateCreator<PlanSlice> = (set) => ({
  plan: initialPlanState,
  setPlan: (data) => set((state) => ({ plan: { ...state.plan, ...data } })),

  applicationId: "",
  setApplicationId: (id) => set({ applicationId: id }),

  loanStatus: null,
  setLoanStatus: (status) => set({ loanStatus: status }),
});

export default createPlanSlice;
export type { Plan, PlanSlice, LoanStatus };
