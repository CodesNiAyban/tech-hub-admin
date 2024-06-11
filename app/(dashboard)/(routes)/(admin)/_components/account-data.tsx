// AccountDataTable.tsx
"use client";
import { setRole } from '@/app/actions/set-role';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from '@clerk/nextjs/server';
import { SortAsc, SortDesc } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';

type AccountDataTableProps = {
    users: User[];
};

const AccountDataTable: React.FC<AccountDataTableProps> = ({ users }) => {
    const [query, setQuery] = useState<string>("");
    const [sortField, setSortField] = useState<string>("firstName");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [offset, setOffset] = useState<number>(0);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);

    const router = useRouter();

    const handleSort = (field: string) => {
        const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortOrder(order);
    };

    const handlePageClick = (data: { selected: number }) => {
        setOffset(data.selected * itemsPerPage);
    };

    const formattedLastActiveAt = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString(); // Adjust date format as needed
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        const formData = new FormData();
        formData.append("id", userId);
        formData.append("role", newRole);

        const response = await setRole(formData);

        // Handle response message if necessary
        console.log(response.message);
        router.refresh();
    };

    const sortedAndFilteredUsers = users
        .filter((user) => {
            const firstName = user.firstName?.toLowerCase() || "";
            const lastName = user.lastName?.toLowerCase() || "";
            const emailAddresses = user.emailAddresses?.map(email => email.emailAddress.toLowerCase()) || [];

            return firstName.includes(query.toLowerCase()) ||
                lastName.includes(query.toLowerCase()) ||
                emailAddresses.some(email => email.includes(query.toLowerCase()));
        })
        .sort((a, b) => {
            const fieldA = (sortField === 'publicMetadata.role' ? a.publicMetadata.role : a[sortField as keyof User]) || "";
            const fieldB = (sortField === 'publicMetadata.role' ? b.publicMetadata.role : b[sortField as keyof User]) || "";

            if (sortOrder === "asc") {
                return fieldA > fieldB ? 1 : -1;
            } else {
                return fieldA < fieldB ? 1 : -1;
            }
        });

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search users..."
                    className="border border-gray-300 rounded px-3 py-2"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            <Table>
                <TableCaption>A list of users and their roles.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Name</TableHead>
                        <TableHead>Username</TableHead> {/* Add Username header */}
                        <TableHead>Email</TableHead>
                        <TableHead>
                            Role
                            <button onClick={() => handleSort('publicMetadata.role')}>
                                {sortField === 'publicMetadata.role' && sortOrder === 'asc' ? <SortAsc /> : <SortDesc />}
                            </button>
                        </TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>
                            Created At
                            <button onClick={() => handleSort('createdAt')}>
                                {sortField === 'createdAt' && sortOrder === 'asc' ? <SortAsc /> : <SortDesc />}
                            </button>
                        </TableHead>
                        <TableHead>Last Active At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedAndFilteredUsers.slice(offset, offset + itemsPerPage).map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">
                                {user.firstName} {user.lastName}
                            </TableCell>
                            <TableCell>{user.username}</TableCell> {/* Display Username */}
                            <TableCell>
                                {user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)
                                    ?.emailAddress || ""}
                            </TableCell>
                            <TableCell>{user.publicMetadata.role as string}</TableCell>
                            <TableCell>
                                <Image
                                    src={user.imageUrl}
                                    alt={`${user.firstName} ${user.lastName}`}
                                    width={40} // Set appropriate width
                                    height={40} // Set appropriate height
                                    className="w-10 h-10 rounded-full"
                                />
                            </TableCell>
                            <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{formattedLastActiveAt(user.lastActiveAt ? user.lastActiveAt : 0)}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex space-x-2">
                                    <div>
                                        <Button
                                            onClick={() => handleRoleChange(user.id, "admin")}
                                        >
                                            Make Admin
                                        </Button>
                                    </div>
                                    <div>
                                        <Button
                                            onClick={() => handleRoleChange(user.id, "moderator")}
                                        >
                                            Make Moderator
                                        </Button>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={Math.ceil(users.length / itemsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
                disabledClassName={'disabled'}
                previousClassName={offset === 0 ? 'disabled' : ''}
                nextClassName={offset + itemsPerPage >= users.length ? 'disabled' : ''}
            />
        </div>
    );
};

export default AccountDataTable;
