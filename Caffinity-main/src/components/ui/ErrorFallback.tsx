import { FallbackProps } from "react-error-boundary";

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div className="text-center p-5">
      <h2>There is error in loading❌</h2>
      <p className="text-red-500">{error.message}</p>

      <button onClick={resetErrorBoundary}>try aagain</button>
    </div>
  );
};

export default ErrorFallback;
