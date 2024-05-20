import { ClerkLoaded, ClerkLoading, SignOutButton } from "@clerk/nextjs";
import { TriangleAlert, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";

const NoAccessAdmin = () => {
    return (
        <div className="flex items-center justify-center h-screen p-10">
            <Card className="w-full sm:w-96">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center">
                        <TriangleAlert className="h-6 w-6 mr-1 text-primary" />
                        Access Denied
                    </CardTitle>
                    <CardDescription className="flex items-center justify-center">
                        You must be an admin to access this page
                    </CardDescription>
                    <div className="flex items-center justify-center mt-5">
                        <ClerkLoading>
                            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                        </ClerkLoading>
                    </div>

                    <ClerkLoaded>
                        <SignOutButton redirectUrl="/sign-in">
                            <Button asChild variant="outline">
                                <Link href="/sign-in">Sign in</Link>
                            </Button>
                        </SignOutButton>
                    </ClerkLoaded>
                </CardHeader>
            </Card>
        </div>
    );
}

export default NoAccessAdmin;