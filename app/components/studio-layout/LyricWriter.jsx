import React, { useEffect, useRef, useState } from "react";
import { Button } from "~/components/catalyst-theme/button";
import { Textarea } from "~/components/catalyst-theme/textarea";
import { BoltIcon, CameraIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { Fieldset, Field, Label } from '~/components/catalyst-theme/fieldset'
import { Listbox, ListboxLabel, ListboxOption } from '~/components/catalyst-theme/listbox'
import VersionSelector from '~/components/studio-layout/versionSelector'
import Toast from "~/components/studio-layout/Toast";

const placeholderText = `Tap here to write your lyrics 

Use empty lines to separate sections

You will arrange these lyrics into song sections in the Structure tab above

Tap the camera icon below after writing some lyrics to save your progress or revisit a saved version`


const CreateLyrics = ({ headerRef, store }) => {
  const { lyrics, setLyrics, getSortedLyricVersions, addLyricVersion, setLyricVersion} = store;
  const lyricVersions = getSortedLyricVersions()
  const [showToast, setShowToast] = useState(false)
  const [textareaRows, setTextareaRows] = useState(5); // Initial row count
  const [lyricWriterOptionsOpen, setLyricWriterOptionsOpen] = useState(false); 
  const [isFocused, setIsFocused] = useState(false); 
  const containerRef = useRef(null);

  const findVersion = (lyricVersions, lyrics) => {
    return lyricVersions.find((version) => version.lyrics.trim() === lyrics.trim()) || false;
  };
  const handleAddVersion = () => {
    const foundVersion = findVersion(lyricVersions, lyrics)
    if (lyrics && !foundVersion) {
      addLyricVersion(lyrics); 
    }
    setShowToast(foundVersion || true)
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
    setIsFocused(true)
    setLyricWriterOptionsOpen(false)
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
          onBlur={()=>setIsFocused(false)}
          placeholder={isFocused ? '' : placeholderText}
          className="w-full resize-none"
          rows={textareaRows} // Dynamically calculated rows
        />
      </main>
      { lyricWriterOptionsOpen
        ?
          <div className="fixed bottom-0 left-0 w-full bg-gray-700 border border-gray-600 
             sm:w-auto sm:right-24 sm:bottom-12 sm:left-auto sm:rounded-md sm:shadow-lg">
            <div className="overflow-y-auto">
              <VersionSelector lyricVersions={lyricVersions} store={store} />
            </div>
          </div>

        : 
          <div className="bg-gray-700 border border-gray-600 rounded-lg fixed bottom-10 right-16 lg:right-24 p-2">
            <button className="text-gray-300" onClick={handleAddVersion} >
              <CameraIcon className='h-4 w-4 text-lg' />
            </button>
          </div>
      }
      <Toast show={showToast} setShow={setShowToast} wait={5} viewSnapshots={onViewSnapshotsClick} version={store.lyricVersionTally} />
    </div>
  );
};

export default CreateLyrics;

