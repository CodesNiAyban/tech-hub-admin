export type AccountDataParams = {
  searchParams: { search?: string };
};

export type User = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  primaryEmailAddressId: string | null;
  emailAddresses: { id: string; emailAddress: string }[];
  publicMetadata: { role: string };
  createdAt: string;
  imageUrl: string;
  lastActiveAt?: string; // Replace status with lastActiveAt
  username?: string;
};