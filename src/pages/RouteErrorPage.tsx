import { useRouteError } from "react-router-dom";

interface RouteError {
  statusText?: string;
  message?: string;
}

export default function RouteErrorPage() {
  const error = useRouteError() as RouteError;

  console.error(error);

  return (
    <>
      <title>Error 404</title>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Oops! Something went wrong
          </h1>

          <p className="text-gray-600 mb-6">
            An unexpected error occurred while loading this page.
          </p>

          <p className="text-red-500 font-medium mb-6">
            {error?.statusText || error?.message || "Unknown error"}
          </p>

          <button
            onClick={() => window.location.replace("/")}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </>
  );
}
