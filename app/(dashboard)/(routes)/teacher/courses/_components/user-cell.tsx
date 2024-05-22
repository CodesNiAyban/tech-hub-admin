import getUser from '@/app/actions/get-user';
import React from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface UserCellProps {
    userId: string;
}

const UserCell: React.FC<UserCellProps> = async ({ userId }) => {
    const user = await getUser(userId)

    return <div>{user?.username}</div>;
};

export default UserCell;
