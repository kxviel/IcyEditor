import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Download,
  MoreVertical,
  Plus,
  Search,
  SortAsc,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import AddPaperModal from "./AddPaperModal";
import { IconInput } from "@/components/ui/IconInput";

const examCards = Array(6).fill({
  lastEdited: "8th Jan 2025",
  title: "End Semester Examination",
  class: "Class ii",
  subject: "English",
});

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {/* Header */}
      <div className="flex w-full items-center justify-between space-x-4 pt-20">
        <div>
          <p className="text-2xl font-semibold">Question Papers</p>
          <p className="text-gray-500">All your papers saved in one place</p>
        </div>

        <div className="flex space-x-4">
          <Button variant={"outline"}>
            <Download /> Export All
          </Button>
          <Button onClick={() => setIsOpen(true)}>
            <Plus /> Add Question Paper
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex w-full items-center justify-between space-x-4">
        <IconInput
          placeholder="Search"
          className="w-[320px]"
          startIcon={Search}
        />

        <div className="flex space-x-4">
          <Button variant={"outline"}>
            <Download /> Jan 1, 2023 - Jan 31, 2025
          </Button>
          <Button variant={"outline"}>
            <SortAsc /> Sort By
          </Button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-6 px-8 md:grid-cols-2 lg:grid-cols-3">
        {examCards.map((card, i) => (
          <Card key={i} className="group p-5">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Last edited on {card.lastEdited}
                </p>

                <h2 className="mb-4 text-xl font-semibold">{card.title}</h2>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Badge
                  variant="secondary"
                  className="bg-purple-50 text-purple-500 hover:bg-purple-50"
                >
                  {card.class}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-pink-50 text-pink-500 hover:bg-pink-50"
                >
                  {card.subject}
                </Badge>
              </div>

              <Button variant="ghost">
                <ArrowUpRight />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <AddPaperModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Home;
