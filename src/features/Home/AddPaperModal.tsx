import Logo from "@/assets/Logo.svg";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Contact } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddPaperModal = ({ isOpen, setIsOpen }: Props) => {
  const navigate = useNavigate();
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-fit">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div>
            <img src={Logo} alt="logo" />
          </div>

          <p className="text-2xl font-semibold">How do you want to proceed</p>
          <p className="text-gray-500">
            lorem ipsum dolor sit amet lorem ipsum dolor sit amet
          </p>

          <div className="flex gap-4">
            <Card
              className="flex h-[197px] w-[343px] flex-col bg-[#6941C6] text-white hover:cursor-pointer hover:opacity-95"
              onClick={() => navigate({ to: "/builder" })}
            >
              <div className="flex flex-col gap-6 px-4 py-5">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-[#7854cc]">
                    <Contact />
                  </div>

                  <div>
                    <p className="font-semibold">Manual Exam Paper</p>
                    <p className="text-sm">
                      Provides more flexibilty to the user
                    </p>
                  </div>
                </div>

                <p className="text-sm">
                  Easily create exams papers by using multiple or single book.
                </p>
              </div>

              <p className="flex w-full flex-1 items-center justify-end border-t border-white p-3 text-sm font-semibold">
                Generate Now
              </p>
            </Card>

            <Card
              className="relative flex h-[197px] w-[343px] flex-col bg-[#6941C6] text-white hover:cursor-pointer hover:opacity-95"
              onClick={() => navigate({ to: "/builder" })}
            >
              <div className="flex flex-col gap-6 px-4 py-5">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-[#7854cc]">
                    <Contact />
                  </div>

                  <div>
                    <p className="font-semibold">Auto Exam Paper</p>
                    <p className="text-sm">
                      A quick and easy method for creating
                    </p>
                  </div>
                </div>

                <p className="text-sm">
                  User or Teacher can generate exam paper automatically by
                  selecting question types only
                </p>
              </div>

              <p className="flex w-full flex-1 items-center justify-end border-t border-white p-3 text-sm font-semibold">
                Generate Now
              </p>

              <div className="absolute right-0 top-[-10px] rounded-full border border-yellow-300 bg-yellow-50 px-2 text-sm text-yellow-600">
                Fully Automatic
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaperModal;
