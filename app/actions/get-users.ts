import db from "@/lib/db";

export const getEnrolledUsers = async (courseId: string): Promise<string[]> => {
    try {
        // Find users who have progress in any chapter of the given course
        const usersWithProgress = await db.userProgress.findMany({
            where: {
                chapter: {
                    courseId: courseId
                }
            },
            select: {
                userId: true
            }
        });

        // Extract unique user IDs using a Set to remove duplicates and filter out empty results
        const userIdsSet = new Set(
            usersWithProgress
                .filter(progress => progress.userId) // Ensure userId is not empty
                .map(progress => progress.userId)    // Map to userId array
        );

        // Convert Set back to an array and sort it
        const userIds = Array.from(userIdsSet).sort();

        // Only log if userIds array is not empty
        if (userIds.length > 0) {
            console.log(userIds);
        }

        return userIds;
    } catch (error) {
        console.log("[GET_ENROLLED_USERS]: ", error);
        return [];
    }
};
