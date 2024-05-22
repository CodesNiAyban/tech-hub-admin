import { clerkClient } from '@clerk/nextjs/server';

export default async function getUser(userId: string) {
    try {
        const response = await clerkClient.users.getUser(userId);
        console.log("test " + response.username)
        return response;
    } catch (error) {
        console.log(error)
    }
}