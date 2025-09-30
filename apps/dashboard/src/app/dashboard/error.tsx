"use client";

interface iErrorProps {
  error: Error &  { digest?: string };
  reset: () => void;
}

const Error = (props: iErrorProps) => {
  const { error, reset } = props;
  
  const clickReset = () => reset();
  
  return (
    <div className="m-4 rounded-2xl border border-red-200 bg-red-50 p-4">
      <h2 className="text-lg font-semibold text-red-800">
        Dashboard failed to load
      </h2>
      <p className="mt-2 text-sm text-red-700">
        {error.message || "Something went wrong while fetching data."}
      </p>
      <div className="mt-3">
        <button
          onClick={clickReset}
          className="rounded-lg border px-3 py-1.5 text-sm hover:bg-white"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export default Error