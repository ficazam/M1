export const KpiCard = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="rounded-2xl border p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
};
