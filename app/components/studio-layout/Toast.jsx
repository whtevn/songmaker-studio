'use client'

import { useState, useEffect } from 'react'
import { Transition } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { XMarkIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { CameraIcon } from "@heroicons/react/16/solid";
import { BadgeButton } from "~/components/catalyst-theme/badge";

export default function Example({ show, setShow, viewSnapshots, version, wait = 3}) {
  useEffect(() => {
    if (show) {
      const timeout = setTimeout(() => {
        setShow(false);
      }, wait * 1000);

      // Cleanup timeout on unmount or when `show` changes
      return () => clearTimeout(timeout);
    }
  }, [show, wait, setShow]);

  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition show={show}>
            <div className="pointer-events-auto border border-gray-600 w-1/2 max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5 transition data-[closed]:data-[enter]:translate-y-2 data-[enter]:transform data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:data-[enter]:sm:translate-x-2 data-[closed]:data-[enter]:sm:translate-y-0">
              <div className="bg-gray-700 p-4">
                <div className="flex items-start">
                  <div className="shrink-0">
                    <CameraIcon aria-hidden="true" className="size-6 text-green-400" />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-300">Snapshot #{version} Saved</p>
                  </div>
                  <div className="ml-4 flex shrink-0">
                    <button
                      type="button"
                      onClick={() => setShow(false)}
                      className="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon aria-hidden="true" className="size-5" />
                    </button>
                  </div>
                </div>
                {/* Flex this to the right */}
                <div className="flex justify-end mt-4">
                  <BadgeButton className="text-sm font-small text-gray-300 flex flex-row items-center" onClick={viewSnapshots}>
                    View Snapshots <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </BadgeButton>
                </div>
                {/* End flex */}
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
}

