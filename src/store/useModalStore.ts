import { create } from "zustand";

export type ModalType =
  | "COMPLETE_PROFILE"
  | "EDIT_QUESTION"
  | "EDIT_CATEGORY_MARKS"
  | "";

interface ModalState {
  modalType: ModalType;
  modalProps: Record<string, any>;
  setModal: (modalType: ModalType, modalProps?: Record<string, any>) => void;
  hideModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modalType: "",
  modalProps: {},
  setModal: (type, props = {}) => set({ modalType: type, modalProps: props }),
  hideModal: () => set({ modalType: "", modalProps: {} }),
}));
