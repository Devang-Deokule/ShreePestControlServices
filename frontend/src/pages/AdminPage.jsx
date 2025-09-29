import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AdminPage() {
  // ✅ Login state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Dashboard states
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ pending: 0, completed: 0, rescheduled: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // ✅ Reschedule modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  // ✅ Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "Shreepest" && password === "Shree@123") {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid username or password ❌");
    }
  };

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/bookings`);
      setBookings(res.data || []);
    } catch (err) {
      console.error("Error fetching bookings:", err.message);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/stats`);
      setStats(res.data || { pending: 0, completed: 0, rescheduled: 0 });
    } catch (err) {
      console.error("Error fetching stats:", err.message);
    }
  };

  // Update status
  const updateStatus = async (id, status, date = null, time = null) => {
    try {
      await axios.put(`${API_URL}/api/admin/bookings/${id}`, { status, date, time });
      fetchBookings();
      fetchStats();
    } catch (err) {
      console.error("Error updating status:", err.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const loadData = async () => {
        await Promise.all([fetchBookings(), fetchStats()]);
        setLoading(false);
      };
      loadData();
    }
  }, [isAuthenticated]);

  // ✅ Filter + Search
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = b?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || b?.status === filter;
    return matchesSearch && matchesFilter;
  });

  // ✅ Pagination
  const totalPages = Math.ceil(filteredBookings.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, startIndex + rowsPerPage);

  // ✅ If not logged in → show login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyan-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-2xl shadow-md w-96"
        >
          <h2 className="text-2xl font-bold mb-4 text-center text-cyan-700">Admin Login</h2>
          {loginError && (
            <p className="text-red-600 text-sm text-center mb-3">{loginError}</p>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button
              type="submit"
              className="w-full bg-cyan-600 text-white py-2 rounded-xl hover:bg-cyan-700 transition"
            >
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyan-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-cyan-700">Admin Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {["Pending", "Completed", "Rescheduled"].map((key, i) => (
          <motion.div
            key={key}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.2 }}
            className="bg-white p-6 rounded-2xl shadow text-center"
          >
            <h2 className="text-xl font-bold text-cyan-700">{key}</h2>
            <p className="text-2xl text-gray-700">{stats[key.toLowerCase()]}</p>
          </motion.div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <input
          type="text"
          placeholder="🔍 Search by name..."
          className="border border-cyan-300 rounded-2xl p-2 w-full md:w-1/3 mb-4 md:mb-0"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <div className="flex space-x-2">
          {["All", "Pending", "Completed", "Rescheduled"].map((status) => (
            <button
              key={status}
              className={`px-4 py-2 rounded-2xl text-sm font-medium transition ${
                filter === status
                  ? "bg-cyan-500 text-white shadow"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => {
                setFilter(status);
                setCurrentPage(1);
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Pagination (top) */}
      {totalPages > 1 && (
        <div className="flex justify-center mb-4 space-x-2">
          <button
            className="px-4 py-2 rounded-2xl bg-gray-200 hover:bg-gray-300 transition"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>
          <span className="px-4 py-2">{currentPage} / {totalPages}</span>
          <button
            className="px-4 py-2 rounded-2xl bg-gray-200 hover:bg-gray-300 transition"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white p-6 rounded-2xl shadow overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : currentBookings.length === 0 ? (
          <p className="text-center text-gray-500">No bookings found</p>
        ) : (
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-cyan-100">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Address</th>
                <th className="p-2 border">Service</th>
                <th className="p-2 border">Urgency</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Time</th>
                <th className="p-2 border">Instructions</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentBookings.map((b) => (
                  <motion.tr
                    key={b._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center border hover:bg-cyan-50 transition"
                  >
                    <td className="p-2 border">{b?.name || "-"}</td>
                    <td className="p-2 border">{b?.phone || "-"}</td>
                    <td className="p-2 border">{b?.email || "-"}</td>
                    <td className="p-2 border">{b?.address || "-"}</td>
                    <td className="p-2 border">{b?.serviceType || "-"}</td>
                    <td className="p-2 border">{b?.urgency || "-"}</td>
                    <td className="p-2 border">{b?.date || "-"}</td>
                    <td className="p-2 border">{b?.time || "-"}</td>
                    <td className="p-2 border">{b?.instructions || "-"}</td>
                    <td
                      className={`p-2 border font-semibold ${
                        b?.status === "Pending"
                          ? "text-yellow-600"
                          : b?.status === "Completed"
                          ? "text-green-600"
                          : "text-blue-600"
                      }`}
                    >
                      {b?.status || "Pending"}
                    </td>
                    <td className="p-2 border space-x-2">
                      <button
                        className="bg-yellow-400 px-3 py-1 rounded-2xl hover:bg-yellow-500 transition"
                        onClick={() => {
                          setSelectedBooking(b);
                          setShowModal(true);
                        }}
                      >
                        Reschedule
                      </button>
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded-2xl hover:bg-green-600 transition"
                        onClick={() => updateStatus(b._id, "Completed")}
                      >
                        Confirm
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}

        {/* Pagination (bottom) */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            <button
              className="px-4 py-2 rounded-2xl bg-gray-200 hover:bg-gray-300 transition"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>
            <span className="px-4 py-2">{currentPage} / {totalPages}</span>
            <button
              className="px-4 py-2 rounded-2xl bg-gray-200 hover:bg-gray-300 transition"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-6 rounded-2xl shadow-lg w-96"
            >
              <h2 className="text-xl font-bold mb-4 text-cyan-700">Reschedule Booking</h2>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full p-2 border rounded-xl mb-3"
              />
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full p-2 border rounded-xl mb-4"
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="bg-gray-300 px-4 py-2 rounded-xl"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded-xl hover:bg-yellow-600 transition"
                  onClick={() => {
                    if (selectedBooking && newDate && newTime) {
                      updateStatus(selectedBooking._id, "Rescheduled", newDate, newTime);
                      setShowModal(false);
                      setNewDate("");
                      setNewTime("");
                    }
                  }}
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminPage;
