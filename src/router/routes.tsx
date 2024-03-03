import { createBrowserRouter } from "react-router-dom";
import KanbanBoard from "../pages/KanbanBoard";
import Login from "../pages/Login";
const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,

    },
    {
        path: "/my-task",
        element: <KanbanBoard />,

    },
])
export default router