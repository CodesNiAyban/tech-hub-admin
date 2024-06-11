"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import Image from "next/image";
import { Category } from "@prisma/client";

interface CategoryItemProps {
    label: string;
    value?: string;
    iconSrc?: string;
}

export const CategoryItem = ({
    label,
    value,
    iconSrc,
}: CategoryItemProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentCategoryId = searchParams.get("categoryId");
    const currentTitle = searchParams.get("title");

    const isSelected = currentCategoryId === value;

    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                title: currentTitle,
                categoryId: isSelected ? null : value,
            }
        }, { skipNull: true, skipEmptyString: true });

        router.push(url);
    }

    return (
        <button
            onClick={onClick}
            className={cn(
                "py-2 px-3 text-sm border rounded-full flex items-center gap-x-1 hover:border-primary hover:bg-primary/20 transition",
                isSelected && "border-primary bg-primary text-primary-800"
            )}
        >
            {iconSrc && <Image src={iconSrc} alt={label} width={20} height={20} />}
            <div className="truncate ml-2">
                {label}
            </div>
        </button>
    );
};
