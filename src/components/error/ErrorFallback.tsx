import { ErrorPage } from ".";

const ErrorFallback: React.FC = () => {
  return (
    <ErrorPage
      status={500}
      description="Somthing went wrong! Try again later."
    />
  );
};

export default ErrorFallback;
