import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { store } from "../../app/store";
import { notesApiSlice } from "../../app/api/notesApiSlice";
import { usersApiSlice } from "../../app/api/usersApiSlice";
import { useRolePermissions } from "../../hooks";

const Prefetch: React.FC = () => {
  const { canRetrieveUsers } = useRolePermissions({});

  useEffect(() => {
    store.dispatch(
      notesApiSlice.util.prefetch("getNotes", undefined, { force: true })
    );

    if (canRetrieveUsers) {
      store.dispatch(
        usersApiSlice.util.prefetch("getUsers", undefined, { force: true })
      );
    }
  }, []);

  return <Outlet />;
};

export default Prefetch;
