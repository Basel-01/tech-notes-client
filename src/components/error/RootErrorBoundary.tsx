import { Outlet, useLocation } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from ".";

const RootErrorBoundary: React.FC = () => {
  const location = useLocation();

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      resetKeys={[location.pathname]}
    >
      <Outlet />
    </ErrorBoundary>
  );
};

export default RootErrorBoundary;
