import { User, auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { columns } from "../_components/columns";
import { DataTable } from "../_components/data-table";
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
				<div className="p-6 mt-10">
					<Breadcrumb className="pb-3 mt-3">
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink href="/admin/users">Users</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<DropdownMenu>
								<DropdownMenuTrigger className="flex items-center gap-1">
									<BreadcrumbEllipsis className="h-4 w-4" />
									<span className="sr-only">Toggle menu</span>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									<DropdownMenuItem>Design Ugh</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</BreadcrumbList>
					</Breadcrumb>
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

