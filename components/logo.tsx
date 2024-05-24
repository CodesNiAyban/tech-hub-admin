import Link from "next/link";
import Image from "next/image";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";

const headingFont = localFont({
  src: "../public/fonts/CalSans-SemiBold.woff2",
});

export const Logo = () => {
  return (
    <Link href="/">
      <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
        <Image src="/logo.svg" alt="Logo" height={40} width={40} />
        <p
          className={cn(
            "font-bold", // Use a bold font
            "text-yellow-500"
          )}
        >
          <span className="text-foreground mr-[0.5px]">Admin</span>
          <span className="bg-primary text-black rounded-md px-1 py-1">
            Hub
          </span>
        </p>
      </div>
    </Link>
  );
};
