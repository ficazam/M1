import { Suspense } from "react";
import { Fallback } from "../_components/Fallback";
import { DataSection } from "../_components/DataSection";

const Dashboard = () => (
  <main className="mx-auto max-w-5xl p-6">
    <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>
    <Suspense fallback={<Fallback />}>
      <DataSection />
    </Suspense>
  </main>
);

export default Dashboard;
