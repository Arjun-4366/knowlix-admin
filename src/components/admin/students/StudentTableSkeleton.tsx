import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function StudentTableSkeleton() {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Search & Filter Header Bar Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
        <div className="relative flex-1 max-w-xl">
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-9 w-32 rounded-xl" />
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>
      </div>

      {/* Directory Table Skeleton */}
      <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
        <Table className="table-fixed">
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="px-6 py-4 w-[12%]">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="px-6 py-4 w-[24%]">
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead className="px-6 py-4 w-[12%]">
                <Skeleton className="h-4 w-12" />
              </TableHead>
              <TableHead className="px-6 py-4 w-[20%]">
                <Skeleton className="h-4 w-28" />
              </TableHead>
              <TableHead className="px-6 py-4 w-[18%]">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="px-6 py-4 w-[14%]">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="px-6 py-4 text-right w-[10%]">
                <Skeleton className="h-4 w-12 ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100">
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="px-6 py-4">
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Skeleton className="h-7 w-24 rounded-full" />
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2.5">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <Skeleton className="w-8 h-8 rounded-lg" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
