"use client"

import { CreateCourse } from "../_components/create-course-title";

const CreatePage = () => {

    return (
        <>
        <div
            className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm m-4 mt-20" x-chunk="dashboard-02-chunk-1"
        >
            <div className="max-w-5xl mx-auto flex md:items-center md:justify center h-full p-6">
                <CreateCourse />
            </div>
        </div>
        </>
    );
}

export default CreatePage;
