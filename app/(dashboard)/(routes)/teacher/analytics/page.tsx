
import { checkRole } from "@/lib/role";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Chart } from "./_components/chart";
import { DataCard } from "./_components/data-card";
import { getAnalytics } from "@/app/actions/get-analytics";

export const maxDuration = 60;

// Define the type for params
type AnalyticsPageParams = {
  searchParams: { search?: string };
};

const AnalyticsPage = async (params: AnalyticsPageParams) => {
  const { sessionClaims } = auth();

  // If the user does not have the admin role, redirect them to the home page
  if (sessionClaims?.metadata.role !== "admin") {
    redirect("/sign-in");
  }
  const { data, totalRevenue, totalSales } = await getAnalytics();

  return (
    <div className="p-6 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard label="Total Revenue" value={totalRevenue} shouldFormat />
        <DataCard label="Total Sales" value={totalSales} />
      </div>
      <Chart data={data} />
    </div>
  );
};

export default AnalyticsPage;
