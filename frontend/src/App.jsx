
import Portfolio from "./pages/Portfolio"
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from "react-router-dom"
import ServiceDetail from "./pages/ServiceDetail"
import Booking from "./pages/Booking"
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/booking" element={<Booking />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}
export default App
