import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import ROLES from "../config/ROLES";
import { Layout, Public } from "../components/public";
import { Login, Prefetch, PersistLogin, RequireAuth } from "../components/auth";
import { DashLayout, Welcome } from "../components/dash";
import { UsersList, CreateUserForm, EditUser } from "../components/users";
import { NotesList, ViewNote, CreateNote, EditNote } from "../components/notes";
import { RootErrorBoundary, ErrorPage } from "../components/error";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootErrorBoundary />}>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
      </Route>

      <Route element={<PersistLogin />}>
        <Route
          element={
            <RequireAuth allowedRoles={[...Object.values(ROLES)]} to="/login" />
          }
        >
          <Route element={<Prefetch />}>
            <Route path="/dash" element={<DashLayout />}>
              <Route index element={<Welcome />} />

              <Route path="notes">
                <Route index element={<NotesList />} />
                <Route path=":noteId/view" element={<ViewNote />} />
                <Route
                  element={
                    <RequireAuth
                      allowedRoles={[ROLES.Manager, ROLES.Admin]}
                      to="/dash/notes"
                    />
                  }
                >
                  <Route path="create" element={<CreateNote />} />
                </Route>
                <Route path=":noteId" element={<EditNote />} />
              </Route>

              <Route
                element={
                  <RequireAuth
                    allowedRoles={[ROLES.Manager, ROLES.Admin]}
                    to="/dash"
                  />
                }
              >
                <Route path="users">
                  <Route index element={<UsersList />} />
                  <Route path="create" element={<CreateUserForm />} />
                  <Route path=":userId" element={<EditUser />} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
      <Route
        path="*"
        element={
          <ErrorPage
            status={404}
            description={"Oops! The page you're looking for doesn't exist."}
          />
        }
      />
    </Route>
  )
);

export default router;
