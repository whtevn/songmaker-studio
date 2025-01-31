import React from "react";
import { Heading } from "~/components/catalyst-theme/heading";
import { Divider } from "~/components/catalyst-theme/divider";
import { PlusCircleIcon } from '@heroicons/react/16/solid';

const DashboardSection = ({ title, width, children, onAction, actionButton }) => {
  return (
    <section className={`rounded-lg shadow-md items-center border dark:border-gray-700 dark:bg-black p-4 space-y-2 ${width || "w-full"}`}>
      <Heading className="flex flex-row items-center gap-2 cursor-pointer" onClick={onAction} >{ onAction && actionButton }{title}</Heading>
      <Divider />
      {children}
    </section>
  );
};

export default DashboardSection;

