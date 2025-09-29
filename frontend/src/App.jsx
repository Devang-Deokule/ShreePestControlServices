import { Routes, Route } from "react-router-dom";
import Portfolio from "./pages/Portfolio";
import ServiceDetail from "./pages/ServiceDetail";
import Booking from "./pages/Booking";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/services/:id" element={<ServiceDetail />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
