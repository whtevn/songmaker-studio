import { Badge } from "~/components/catalyst-theme/badge";
import useCatalogStore from "~/stores/useCatalogStore";
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu }  from  "~/components/catalyst-theme/dropdown";
import ScaleUtil from "~/utils/scales"
export default ({ songData, songSections }) => {
  const { notes, modes } = ScaleUtil;
  const updateSongKey = (update) => {
    updateSong({...songData, key: { ...songData.key, ...update } })
  }
  const { updateSong } = useCatalogStore.getState()
  return (
    <div>
      <span>Song Key</span>
      <Dropdown>
        <DropdownButton outline>
          <Badge color="green">{ songData.key.root }</Badge>
        </DropdownButton>
        <DropdownMenu>
          { notes.map(note => {
              const key = note.labels[0]; 
              return <DropdownItem key={key} onClick={()=>updateSongKey({root: key})}>{key}</DropdownItem>
          }) }
        </DropdownMenu>
      </Dropdown>
      <Dropdown>
        <DropdownButton outline>
          <Badge color="green">{ songData.key.mode }</Badge>
        </DropdownButton>
        <DropdownMenu>
          { modes.map(mode => 
            <DropdownItem key={mode.label} onClick={()=>updateSongKey({mode: mode.label})}>{mode.name || mode.label}</DropdownItem>
          ) }
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}
