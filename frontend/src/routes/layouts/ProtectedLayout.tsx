import { Outlet } from "react-router";

import ProtectedRoute from "../ProtectedRoute";

// Pages for signed-in users only
const ProtectedLayout = () => <ProtectedRoute><Outlet /></ProtectedRoute>;

export default ProtectedLayout;
