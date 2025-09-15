import { motion } from "framer-motion";
import { Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as XLSX from "xlsx";

interface ExportMenuProps<T = any> {
  fileName?: string;
  // Prefer a getter to always export latest filtered data
  getData: () => T[];
  // Optional mapper to shape rows before export
  mapRow?: (row: T) => Record<string, any>;
  className?: string;
}

function toPlain<T>(rows: T[], mapRow?: (r: T) => any) {
  if (!rows?.length) return [] as any[];
  if (mapRow) return rows.map(mapRow);
  // shallow copy to plain objects
  return rows.map((r) => ({ ...(r as any) }));
}

export function ExportMenu<T>({ fileName = "export", getData, mapRow, className }: ExportMenuProps<T>) {
  const handleExport = (type: "csv" | "xlsx") => {
    const data = toPlain(getData(), mapRow);
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    const name = `${fileName}.${type}`;
    XLSX.writeFile(wb, name, { bookType: type as any });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="outline" className={`hover-glow btn-press ${className ?? ""}`}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass z-50">
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("xlsx")}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
