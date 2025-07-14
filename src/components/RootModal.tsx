import CompleteProfileModal from "@/features/Auth/CompleteProfileModal";
import { ModalType, useModalStore } from "../store/useModalStore";
import { EditQuestionModal } from "@/features/Builder/modals/EditQuestionModal";
import { EditCategoryMarksModal } from "@/features/Builder/modals/EditCategoryMarksModal";
import { EditClassNameModal } from "@/features/Builder/modals/EditClassName";

type ModalComponent = {
  [key in ModalType]: (props: any) => JSX.Element | null;
};

const MODAL_COMPONENTS: ModalComponent = {
  COMPLETE_PROFILE: CompleteProfileModal,
  EDIT_QUESTION: EditQuestionModal,
  EDIT_CLASS_NAME: EditClassNameModal,
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
