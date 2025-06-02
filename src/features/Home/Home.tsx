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

const Home = () => {
  const navigate = useNavigate();
  const { page = 1 } = useSearch({
    from: "/_auth",
  }) as { page: number };

  const deleteFn = useDeletePaper();
  const resetHeader = useHeaderStore((state) => state.reset);
  const resetBuilder = useQuestionBuilderStore((state) => state.reset);
  const resetPageSettings = usePageSettingsStore((state) => state.reset);
  const invalidateRelatedQueries = useQuestionBuilderStore(
    (state) => state.invalidateRelatedQueries,
  );

  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  });

  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data, isPending } = useGetPapers({
    page,
    order,
    searchTerm: debouncedSearch,
    date,
  });

  const rowCount = data?.total || 0;

  useEffect(() => {
    resetHeader();
    resetBuilder();
    resetPageSettings();
    invalidateRelatedQueries();
    localStorage.removeItem("optimized");
  }, [invalidateRelatedQueries, resetBuilder, resetHeader, resetPageSettings]);

  const handleSort = () => {
    setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handlePageChange = (page: number) => {
    navigate({ to: "/", search: { page } });
  };

  const handleDeletePaper = (id: number) => {
deleteFn.mutate({ body: { id } })
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
            <Plus className="mr-2 h-4 w-4" /> Add Question Paper
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex w-full items-center justify-between space-x-4">
        <IconInput
          placeholder="Search question papers..."
          className="w-[320px]"
          startIcon={Search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex space-x-4">
          <DatePickerWithRange date={date} setDate={setDate} />

          <Button variant="outline" onClick={handleSort}>
            {order === "asc" ? <SortAscIcon /> : <SortDescIcon />} 
            <span className="ml-2">Sort by Date</span>
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isPending && (
        <div className="flex items-center justify-center py-8">
          <p>Loading question papers...</p>
        </div>
      )}

      {/* Cards Grid */}
      {!isPending && data?.examData && data.examData.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.examData.map((card) => (
            <Card key={card.ID} className="group p-5 transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs text-slate-600">
                    Last edited{" "}
                    {formatDistance(new Date(card.date), new Date(), {
                      addSuffix: true,
                    })}
                  </p>

                  <h2 className="mb-4 text-xl font-semibold line-clamp-2">
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
                      className="text-red-600 focus:text-red-600"
                      onClick={() => handleDeletePaper(card.ID)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
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
                  size="sm"
                  onClick={() =>
                    navigate({
                      to: "/builder/$examId",
                      params: { examId: card.ID.toString() },
                    })
                  }
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State - Centered */}
      {!isPending && (!data?.examData || data.examData.length === 0) && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg text-gray-500 mb-2">No question papers found</p>
          <p className="text-sm text-gray-400 mb-4">
            {searchTerm || (date?.from && date?.to) ? 
              "Try adjusting your search or date filters" : 
              "Create your first question paper to get started"
            }
          </p>
          {!searchTerm && (!date?.from || !date?.to) && (
            <Button onClick={() => navigate({ to: "/exam-type" })}>
              <Plus className="mr-2 h-4 w-4" /> Create Question Paper
            </Button>
          )}
        </div>
      )}

      {/* Pagination */}
      {data?.examData && data.examData.length > 0 && (
      <Pagination
        totalPages={Math.ceil(rowCount / 10)}
        onPageChange={handlePageChange}
      />
      )}
    </div>
  );
};

export default Home;
