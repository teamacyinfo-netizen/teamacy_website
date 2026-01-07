import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import "@/App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const ProtectedRoute = ({ children, adminOnly = false }) => {
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    
    if (adminOnly && user.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
    
    return children;
  };

  return (
    <div className="App noise-overlay">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home user={user} setUser={setUser} />} />
          <Route path="/about" element={<About user={user} setUser={setUser} />} />
          <Route path="/services" element={<Services user={user} setUser={setUser} />} />
          <Route path="/portfolio" element={<Portfolio user={user} setUser={setUser} />} />
          <Route path="/contact" element={<Contact user={user} setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/admin/login" element={<AdminLogin setUser={setUser} />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard user={user} setUser={setUser} />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;