import React from "react";
import { Heading } from "~/components/catalyst-theme/heading";
import { PlusCircleIcon } from '@heroicons/react/16/solid';

const DashboardSection = ({ title, width, children, onAdd }) => {
  return (
    <section className={`space-y-2 ${width || "w-full"}`}>
      <div className="rounded-lg shadow-md items-center border border-gray-700 bg-black p-4">
        {children}
      </div>
    </section>
  );
};

export default DashboardSection;

