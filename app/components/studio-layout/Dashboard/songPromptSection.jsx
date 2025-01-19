import DashboardSection from "~/components/common/cardSection";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "~/components/catalyst-theme/table";
import { Text } from "~/components/catalyst-theme/text";
import { PlusCircleIcon } from '@heroicons/react/16/solid';

export default function SongPromptSection({onEdit, onAdd, prompts}){
  return (
    <DashboardSection
      title="Song Prompts"
      onAction={onAdd}
      actionButton={<PlusCircleIcon className="h-4 w-4" />}
    >
      {prompts.length > 0
        ? prompts.map((fragment) => (
          <div className="flex flex-row items-center gap-2" key={fragment.localId || fragment.id}>
            <Text>{fragment.lines}</Text>
            <button
              className="text-blue-500 hover:underline text-sm"
              onClick={onEdit} 
            >
              Edit
            </button>
          </div>
        ))
        : <Text>
            Add a song prompt here. If you have an idea for a song, or an idea for an idea for a song,
            jot it down here and get to it later. 
        </Text>
      }
      </DashboardSection>
  )
}
