import DashboardSection from "~/components/common/cardSection";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "~/components/catalyst-theme/table";
import { PlusCircleIcon } from '@heroicons/react/16/solid';

export default function AlbumSection({onEdit, onAdd, albums}){
  return (
      <DashboardSection>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader className="flex flex-row items-center gap-2 w-[120px] cursor-pointer" onClick={onAdd}>
                <PlusCircleIcon className="h-4 w-4 cursor-pointer"  /><span>Albums</span>
              </TableHeader> {/* Adjust header width */}
              <TableHeader></TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {albums.map((album) => (
              <TableRow key={album.localId || album.id}>
                <TableCell className="w-8 text-center">
                  {album.image ? (
                    <img
                      src={album.image}
                      alt={`${album.name} Artwork`}
                      className="object-cover rounded-md mx-auto"
                    />
                  ) : (
                    <div className="h-[100px] w-[100px] bg-gray-200 flex items-center justify-center text-sm text-gray-500 rounded-md">
                      No Image
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium align-middle">{album.title}</TableCell>
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
