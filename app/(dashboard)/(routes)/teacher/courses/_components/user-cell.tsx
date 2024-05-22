import getUser from '@/app/actions/get-user';
import React from 'react';

interface UserCellProps {
    userId: string;
}

const UserCell: React.FC<UserCellProps> = async ({ userId }) => {
    const user = await getUser(userId)

    return <div>{user?.username}</div>;
};

export default UserCell;
