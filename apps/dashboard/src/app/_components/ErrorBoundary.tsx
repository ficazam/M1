export const Error = ({ e, r }: { e: Error; r: () => void }) => {
  console.error(e);

  return (
    <div className="space-y-3 rounded-2xl border border-red-200 bg-red-50 p-4">
      <h2 className="text-lg font-semibold text-red-800">
        Something went wrong.
      </h2>
      <p className="text-sm text-red-700">{e.message}</p>
      <button onClick={r} className="rounded-lg border px-3 py-1.5">
        Try again
      </button>
    </div>
  );
};
