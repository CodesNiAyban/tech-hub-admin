"use client"
import { AlertTriangleIcon, CheckCircleIcon, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useState } from "react";

const bannerVariants = cva(
    "border text-center p-4 text-sm flex items-center w-full rounded-md",
    {
        variants: {
            variant: {
                warning: "bg-yellow-100/90 border-yellow-300 text-yellow-800",
                success: "bg-green-100 border-green-300 text-green-800"
            }
        },
        defaultVariants: {
            variant: "warning",
        }
    }
);

interface BannerProps extends VariantProps<typeof bannerVariants> {
    label: string;
};

const iconMap = {
    warning: AlertTriangleIcon,
    success: CheckCircleIcon,
}

export const Banner = ({
    label,
    variant,
}: BannerProps) => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) {
        return null;
    }

    const Icon = iconMap[variant || "warning"]
    return (
        <div className={cn(bannerVariants({ variant }))}>
            <div className="flex items-center">
                <Icon className="h-4 w-4 mr-2 text-destructive" />
                {label}
            </div>
            <button className="ml-auto" onClick={() => setIsVisible(false)}>
                <X className="h-4 w-4 text-destructive" />
            </button>
        </div>
    )
}
