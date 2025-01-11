import React, { useEffect, useRef, useState } from "react";
import { Button } from "~/components/catalyst-theme/button";
import { Textarea } from "~/components/catalyst-theme/textarea";
import { BoltIcon, CameraIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { Fieldset, Field, Label } from '~/components/catalyst-theme/fieldset'
import { Listbox, ListboxLabel, ListboxOption } from '~/components/catalyst-theme/listbox'
import VersionSelector from '~/components/studio-layout/versionSelector'
import Toast from "~/components/studio-layout/Toast";

const CreateLyrics = ({ headerRef, store }) => {
  const { lyrics, setLyrics, lyricVersions, addLyricVersion } = store;
  const [showToast, setShowToast] = useState(false)
  const [textareaRows, setTextareaRows] = useState(5); // Initial row count
  const [lyricWriterOptionsOpen, setLyricWriterOptionsOpen] = useState(false); 
  const containerRef = useRef(null);

  const handleAddVersion = () => {
    console.log(lyricVersions, lyrics)
    const doesVersionExist = lyricVersions.some((version) => version.lyrics === lyrics);
    console.log(doesVersionExist)

    if (lyrics && !doesVersionExist) {
      addLyricVersion(lyrics); 
    }
    setShowToast(true)
  };

  const onViewSnapshotsClick = () => {

    setShowToast(false)
    setLyricWriterOptionsOpen(true)
  }

  const handleResize = () => {
    if (containerRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const footerHeight = 64; // Assume footer height is 64px
      const lineHeight = 24; // Assume line height of textarea is 24px
      const availableHeight = containerHeight - footerHeight;
      const calculatedRows = Math.floor(availableHeight / lineHeight);
    console.log(calculatedRows)
      setTextareaRows(calculatedRows);
    }
  };

  const handleFocus = () => {
    if (headerRef.current) {
      headerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    // Run once after the component has mounted
    handleResize();

    // Attach resize event listener
    window.addEventListener("resize", handleResize);
    return () => {
      // Cleanup the event listener on unmount
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array ensures it runs once on mount

  return (
    <div ref={containerRef} className="h-[calc(100vh-30px)] min-h-full flex flex-col">
      {/* Main content */}
      <main className="flex-grow overflow-auto">
        <Textarea
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          onFocus={handleFocus}
          placeholder="Write your lyrics here..."
          className="w-full resize-none"
          rows={textareaRows} // Dynamically calculated rows
        />
      </main>
      <div className={`bg-gray-700 border border-gray-600 rounded-lg fixed bottom-10 right-16 lg:right-24 ${
        lyricWriterOptionsOpen ? 'p-4 w-1/3' : '' 
      }`}>
        <button className={`p-4 text-gray-300 ${lyricWriterOptionsOpen ? "absolute right-0 top-0" : "" }`} onClick={lyricWriterOptionsOpen ? ()=>setLyricWriterOptionsOpen(false) : handleAddVersion} >
          { lyricWriterOptionsOpen  
            ? <XMarkIcon className='h-4 w-4 text-lg' />
            : <CameraIcon className='h-4 w-4 text-lg' />
          }
        </button>
        { lyricWriterOptionsOpen && 
            <VersionSelector addVersion={addLyricVersion} versions={lyricVersions} lyrics={lyrics} setLyrics={setLyrics} />
        }
      </div>
      <Toast show={showToast} setShow={setShowToast} wait={5} viewSnapshots={onViewSnapshotsClick} version={lyricVersions.length} />
    </div>
  );
};

export default CreateLyrics;

