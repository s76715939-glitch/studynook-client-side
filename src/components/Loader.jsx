import React from "react";
import { Loader2 } from "lucide-react";

export default function Loader({ message = "Gathering library files..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <Loader2 className="w-10 h-10 text-[#b4833e] animate-spin mb-4" />
      <p className="text-sm font-mono text-stone-500 dark:text-stone-400">{message}</p>
    </div>
  );
}
