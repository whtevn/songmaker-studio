import React from "react";
import { Heading } from "~/components/catalyst-theme/heading";
import { PlusCircleIcon } from '@heroicons/react/16/solid';

const DashboardSection = ({ title, width, children, onAdd }) => {
  return (
    <section className={`space-y-2 ${width || "w-full"}`}>
      <Heading className="flex flex-row items-center gap-2">{ onAdd && <PlusCircleIcon className="h-4 w-4" onClick={onAdd} /> } {title}</Heading>
      <div className="rounded-lg shadow-md items-center border border-gray-700 bg-black p-4">
        {children}
      </div>
    </section>
  );
};

export default DashboardSection;

