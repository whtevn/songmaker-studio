import { useState } from "react"
import DashboardSection from "~/components/common/cardSection";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "~/components/catalyst-theme/table";
import { Link } from "~/components/catalyst-theme/link";
import KeyFinder from "~/components/studio-layout/Dashboard/KeyFinder";
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/16/solid';
import { Text } from '~/components/catalyst-theme/text'

export default function SongPromptSection({onEdit, onAdd, prompts}){
  const [showKeyfinder, setShowKeyfinder] = useState(false)
  return (
    <DashboardSection>
        <Table className="mb-4">
          <TableHead>
            <TableRow>
              <TableHeader>
                <span  className="flex flex-row items-center gap-2 cursor-pointer" onClick={()=>setShowKeyfinder(!showKeyfinder)}>
                <div className="flex items-center justify-center h-4 w-4 rounded-full bg-zinc-400 text-zinc-900 cursor-pointer">
                { showKeyfinder 
                  ? <ChevronDownIcon className="h-4 w-4 cursor-pointer"  /> 
                  : <ChevronRightIcon className="h-4 w-4 cursor-pointer"  />
                }</div> <span className="cursor-pointer">Find A Key</span>
                </span>
              </TableHeader> 
            </TableRow>
          </TableHead>
        </Table>
        { showKeyfinder
            ? <KeyFinder />
            : <Text>Open this panel for a visual search for keys that include notes that you choose</Text>
        }
      </DashboardSection>
  )
}

