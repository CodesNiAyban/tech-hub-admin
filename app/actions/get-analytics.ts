import db from "@/lib/db";

export const getAnalytics = async () => {
  try {
    const purchases = await db.purchase.findMany({
      include: {
        course: true,
      },
    });

    const data = purchases.map(purchase => ({
      name: purchase.course.title,
      total: purchase.course.price || 0, // Assuming price is the total
    }));

    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
    const totalSales = purchases.length;

    return {
      data,
      totalRevenue,
      totalSales,
    };
  } catch (error) {
    console.error("[GET_ANALYTICS]", error);
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
};
