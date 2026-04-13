import { getDashboardData } from "@/api/dashboard";
import { DashboardPanel } from "@/features/dashboard/dashboard-panel";

export async function DashboardPage() {
  const data = await getDashboardData("WEEK");

  return <DashboardPanel data={data} />;
}
