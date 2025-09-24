import { DashboardClient } from "./DashboardClient";
import { fetchDashboard } from "../lib/data";

export const DataSection = async () => {
  const data = await fetchDashboard();

  return <DashboardClient data={data} />;
};
