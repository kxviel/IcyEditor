import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Download,
  MoreVertical,
  Plus,
  Search,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { IconInput } from "@/components/ui/IconInput";
import { useNavigate } from "@tanstack/react-router";
import { useGetPapers } from "./api/getPapers";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import useDebounce from "@/hooks/useDebounce";
import SortAscIcon from "@/assets/Icons/SortAscIcon";
import SortDescIcon from "@/assets/Icons/SortDescIcon";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { DateRange } from "react-day-picker";

const examCards = Array(6).fill({
  lastEdited: "8th Jan 2025",
  title: "End Semester Examination",
  class: "Class ii",
  subject: "English",
});

const Home = () => {
  const navigate = useNavigate();
  const { getUser } = useAuth();

  const userData = getUser();
  const [page, setPage] = useState(1);
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

  const handleSort = () => {
    setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handlePageChange = (page: number) => {
    if (data?.total && page >= 1 && page <= data.total) {
      setPage(page);
    }
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
          <Button variant={"outline"}>
            <Download /> Export All
          </Button>
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
        <div className="grid gap-6 px-8 md:grid-cols-2 lg:grid-cols-3">
          {examCards.map((card, i) => (
            <Card
              key={i}
              className="group p-5"
              onClick={() =>
                navigate({ to: "/builder/$examId", params: { examId: "123" } })
              }
            >
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
      )}

      {!!data?.total && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => handlePageChange(page - 1)}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {[...Array(data.total)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  onClick={() => handlePageChange(index + 1)}
                  className={page === index + 1 ? "font-bold" : ""}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {data.total > 5 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => handlePageChange(page + 1)}
                className={
                  page === data.total ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default Home;
