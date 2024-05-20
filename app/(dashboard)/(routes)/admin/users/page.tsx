import { User, auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { columns } from "../_components/columns";
import { DataTable } from "../_components/data-table";

const Courses = async () => {
	const { userId } = auth();

	if (!userId) {
		return redirect("/")
	}

	const getUsers = await clerkClient.users.getUserList();
	const users: User[] = JSON.parse(JSON.stringify(getUsers.data));

	return (
		<>
			{users ? (
				<div className="items-center m-4 mt-16">
					<h1 className="text-lg font-semibold md:text-2xl">Users</h1>
					<DataTable columns={columns} data={users} />
				</div>
			) : (
				<div
					className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm m-4 p-10 mt-16" x-chunk="dashboard-02-chunk-1"
				>
					<div className="flex flex-col items-center gap-1 text-center">
						<h3 className="text-2xl font-bold tracking-tight">
							Bruh no users? Impossible
						</h3>
					</div>
				</div>
			)}
		</>
	)
}

export default Courses;

