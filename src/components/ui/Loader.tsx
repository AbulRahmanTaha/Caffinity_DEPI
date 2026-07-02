import React from "react";
import { Loader2 } from "lucide-react";

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64 w-full col-span-full">
      <Loader2 className="animate-spin text-brand-black h-12 w-12" />
    </div>
  );
};

export default Loader;
