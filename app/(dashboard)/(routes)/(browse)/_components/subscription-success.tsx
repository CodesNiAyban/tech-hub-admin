"use client";
import { Logo } from "@/components/logo";
import {
    AlertDialog,
    AlertDialogContent
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { StripeCustomer } from "@prisma/client";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SubscriptionSuccessProps {
    user: StripeCustomer | null;
    success: string | null;
}

export const SubscriptionSuccess = ({ user }: SubscriptionSuccessProps, success: string | null) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        console.log("Success param:", success);
        if (success) {
            setOpen(true);
        }
    }, [success]);

    const handleConfirm = () => {
        router.push(`/`)
        setOpen(false);
    };

    // Define subscription details based on user's subscription type
    let subscriptionDetails: JSX.Element | null = null;
    if (user?.subscription === 'BASIC') {
        subscriptionDetails = (
            <div>
                <p className="text-sm mb-4">You have subscribed to the Basic plan. With this plan, you&apos;ll get access to:</p>
                <ul className="list-disc pl-5">
                    <li className="mb-1">Basic tech courses</li>
                    <li className="mb-1">AI-generated quizzes</li>
                    <li className="mb-1">Basic video courses with chapters</li>
                </ul>
            </div>
        );
    } else if (user?.subscription === 'PRO') {
        subscriptionDetails = (
            <div>
                <p className="text-sm mb-4">Thank you for subscribing to the Pro plan, With this plan, you can access:</p>
                <ul className="list-disc pl-5">
                    <li className="mb-1">All features of the Basic plan</li>
                    <li className="mb-1">More advanced courses</li>
                    <li className="mb-1">Access to Teacher Mode allowing you to upload and edit your courses and manage students</li>
                </ul>
            </div>
        );
    } else if (user?.subscription === 'LIFETIME') {
        subscriptionDetails = (
            <div>
                <p className="text-sm mb-4">Thank you for choosing the Lifetime plan! Enjoy your lifetime access to:</p>
                <ul className="list-disc pl-5">
                    <li className="mb-1">Priority support</li>
                    <li className="mb-1">Enterprise-grade security</li>
                    <li className="mb-1">Lifetime access to all courses</li>
                    <li className="mb-1">All features of the Basic plan</li>
                </ul>
            </div>
        );
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <CardHeader className="p-4 items-center justify-center">
                    <Logo />
                </CardHeader>
                <CardContent>
                    <p className="text-lg mb-4 flex items-center justify-center">
                        <CheckCircle2 size={24} className="mr-2 flex text-green-600" />Your subscription has been activated.
                    </p>
                    {subscriptionDetails}
                </CardContent>
                <Button onClick={handleConfirm} className="mt-1">Let&apos;s Go</Button>
                <CardFooter className="justify-center border-t p-4">
                    <p className="text-xs text-muted-foreground">
                        Information about your account, billing, and usage can be found in the Preferences.
                    </p>
                </CardFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
