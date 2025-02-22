import CompleteProfileModal from "@/features/Auth/CompleteProfileModal";
import { ModalType, useModalStore } from "./useModalStore";

type ModalComponent = {
  [key in ModalType]: (props: any) => JSX.Element | null;
};

const MODAL_COMPONENTS: ModalComponent = {
  COMPLETE_PROFILE: CompleteProfileModal,
  "": () => null, // Handle empty modal type safely
};

const RootModal = () => {
  const { modalType, modalProps } = useModalStore();
  const CurrentModal = MODAL_COMPONENTS[modalType];

  if (!CurrentModal) {
    console.warn(`No modal component found for type: ${modalType}`);
    return null;
  }

  return <CurrentModal {...modalProps} />;
};

export default RootModal;
