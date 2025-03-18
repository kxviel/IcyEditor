import { Button } from "@/components/ui/button";
import { ArrowUpRight, MoreVertical, Plus, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { IconInput } from "@/components/ui/IconInput";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useGetPapers } from "./api/getPapers";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import useDebounce from "@/hooks/useDebounce";
import SortAscIcon from "@/assets/Icons/SortAscIcon";
import SortDescIcon from "@/assets/Icons/SortDescIcon";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { DateRange } from "react-day-picker";
import { formatDistance } from "date-fns";
import { useDeletePaper } from "./api/deletePaper";
import { useHeaderStore } from "@/store/useHeaderStore";
import { useQuestionBuilderStore } from "@/store/useQuestionBuilderStore";
import { usePageSettingsStore } from "@/store/usePageSettingsStore";
import Pagination from "@/components/ui/pagination";
import { useModalStore } from "@/store/useModalStore";

const Home = () => {
  const navigate = useNavigate();
  const { page } = useSearch({
    from: "/_auth",
  }) as { page: number };

  const { getUser } = useAuth();
  const deleteFn = useDeletePaper();
  const userData = getUser();
  const setModal = useModalStore((state) => state.setModal);
  const resetHeader = useHeaderStore((state) => state.reset);
  const resetBuilder = useQuestionBuilderStore((state) => state.reset);
  const resetPageSettings = usePageSettingsStore((state) => state.reset);

  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(), // today
  });

  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data, isPending } = useGetPapers({
    page,
    order,
    userId: userData?.id,
    searchTerm: debouncedSearch,
    date,
  });

  const rowCount = data?.total || 0;

  useEffect(() => {
    if (userData && !userData.isProfileCompleted) {
      setModal("COMPLETE_PROFILE", {
        isOpen: true,
        data: userData,
      });
    }
  }, [setModal, userData]);

  useEffect(() => {
    resetHeader();
    resetBuilder();
    resetPageSettings();
    localStorage.removeItem("optimized");
  }, [resetBuilder, resetHeader, resetPageSettings]);

  const handleSort = () => {
    setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handlePageChange = (page: number) => {
    navigate({ to: "/users", search: { page } });
  };

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Header */}
      <div className="flex w-full items-center justify-between space-x-4 pt-20">
        <div>
          <p className="text-2xl font-semibold">Question Papers</p>
          <p className="text-gray-500">All your papers saved in one place</p>
        </div>

        <div className="flex space-x-4">
          <Button onClick={() => navigate({ to: "/exam-type" })}>
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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex space-x-4">
          <DatePickerWithRange date={date} setDate={setDate} />

          <Button variant={"outline"} onClick={handleSort}>
            {order === "asc" ? <SortAscIcon /> : <SortDescIcon />} Sort By
          </Button>
        </div>
      </div>

      {/* Cards */}
      {isPending ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.examData.map((card, i) => (
            <Card key={i} className="group p-5">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-600">
                    Last edited{" "}
                    {formatDistance(card.date, new Date(), {
                      addSuffix: true,
                    })}
                  </p>

                  <h2 className="mb-4 text-xl font-semibold">
                    {card.EXAM_NAME}
                  </h2>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        navigate({
                          to: "/builder/$examId",
                          params: { examId: card.ID.toString() },
                        })
                      }
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => deleteFn.mutate({ body: { id: card.ID } })}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-purple-50 text-purple-500 hover:bg-purple-50"
                  >
                    {card.Class_NAME}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-pink-50 text-pink-500 hover:bg-pink-50"
                  >
                    {card.Subject_Name}
                  </Badge>
                </div>

                <Button
                  variant="ghost"
                  onClick={() =>
                    navigate({
                      to: "/builder/$examId",
                      params: { examId: card.ID.toString() },
                    })
                  }
                >
                  <ArrowUpRight />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Pagination
        totalPages={Math.ceil(rowCount / 10)}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Home;
