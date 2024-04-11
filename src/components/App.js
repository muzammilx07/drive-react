import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import Login from "./Authentication/Login";
import SignUp from "./Authentication/SignUp";
import DashBoard from "./DashBoard";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute Component={DashBoard} />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
