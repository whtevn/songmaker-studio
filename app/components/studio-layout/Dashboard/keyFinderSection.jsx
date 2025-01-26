import { useState } from "react"
import DashboardSection from "~/components/common/cardSection";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "~/components/catalyst-theme/table";
import { Link } from "~/components/catalyst-theme/link";
import KeyFinder from "~/components/studio-layout/Dashboard/KeyFinder";
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/16/solid';
import { Text } from '~/components/catalyst-theme/text'

export default function KeyFinderSection(){
  const [showKeyfinder, setShowKeyfinder] = useState(false)
  return (
    <DashboardSection
      title="Chord and Key Finder"
      onAction={()=>setShowKeyfinder(!showKeyfinder)}
      actionButton={ showKeyfinder 
        ? <ChevronDownIcon className="h-4 w-4"  /> 
        : <ChevronRightIcon className="h-4 w-4 cursor-pointer"  />
      }
    >
      { showKeyfinder
          ? <KeyFinder />
          : <Text>Open this panel for a visual search for keys that include notes that you choose</Text>
      }
    </DashboardSection>
  )
}

