import CompleteProfileModal from "@/features/Auth/CompleteProfileModal";
import { ModalType, useModalStore } from "../store/useModalStore";
import { EditQuestionModal } from "@/features/Builder/EditQuestionModal";
import { EditCategoryMarksModal } from "@/features/Builder/EditCategoryMarksModal";

type ModalComponent = {
  [key in ModalType]: (props: any) => JSX.Element | null;
};

const MODAL_COMPONENTS: ModalComponent = {
  COMPLETE_PROFILE: CompleteProfileModal,
  EDIT_QUESTION: EditQuestionModal,
  EDIT_CATEGORY_MARKS: EditCategoryMarksModal,
  "": () => null,
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
