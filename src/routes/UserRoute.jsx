import { useSelector } from "react-redux";

import LoadingToRedirect from "./LoadingToRedirect";

const UserRoute = ({ children }) => {
  const { user } = useSelector((state) => ({ ...state }));
  return (user && user?.role === "user") || user?.role === "vendor" ? (
    <div>{children}</div>
  ) : (
    <LoadingToRedirect to="/" message="You are not logged in." />
  );
};

export default UserRoute;
