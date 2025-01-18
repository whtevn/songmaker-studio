import DashboardSection from "~/components/common/cardSection";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "~/components/catalyst-theme/table";
import { PlusCircleIcon } from '@heroicons/react/16/solid';

export default function SongPromptSection({onEdit, onAdd, prompts}){
  return (
    <DashboardSection>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader className="flex flex-row items-center gap-2 cursor-pointer" onClick={onAdd}>
                <PlusCircleIcon className="h-4 w-4 cursor-pointer"  /><span>Song Prompts</span>
              </TableHeader> 
              <TableHeader className="w-[120px]"></TableHeader> 
            </TableRow>
          </TableHead>
          <TableBody>
            {prompts.map((fragment) => (
              <TableRow key={fragment.localId || fragment.id}>
                <TableCell className="font-medium pre-wrap">{fragment.lines}</TableCell>
                <TableCell className="text-right">
                  <button
                    className="text-blue-500 hover:underline text-sm"
                    onClick={onEdit} 
                  >
                    Edit
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </DashboardSection>
  )
}
