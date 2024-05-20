import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 inset-0 bg-opacity-75 backdrop-filter backdrop-blur-sm">
      <Loader2 size={30} className="animate-spin text-primary" />
    </div>
  );
}
