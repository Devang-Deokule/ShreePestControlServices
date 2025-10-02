import { Routes, Route } from "react-router-dom";
import Portfolio from "./pages/Portfolio";
import ServiceDetail from "./pages/ServiceDetail";
import Booking from "./pages/Booking";
import AdminPage from "./pages/AdminPage";
import BookingSuccess from "./pages/BookingSuccess"; // ✅ import it

function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/services/:id" element={<ServiceDetail />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/booking-success" element={<BookingSuccess />} /> {/* ✅ added */}
    </Routes>
  );
}

export default App;
