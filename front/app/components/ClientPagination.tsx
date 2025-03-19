// components/ClientPagination.tsx
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

type ClientPaginationProps = {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export default function ClientPagination({ page, totalPages, onPageChange }: ClientPaginationProps) {
    return (
        <Pagination className="mt-4">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => onPageChange(page - 1)}
                        className={page === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext
                        onClick={() => onPageChange(page + 1)}
                        className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}