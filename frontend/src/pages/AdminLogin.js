import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminLogin = ({ setUser }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(`${API}/auth/login`, formData);
      const { access_token, user } = response.data;
      
      if (user.role !== 'admin') {
        toast.error("Access denied. Admin credentials required.");
        setLoading(false);
        return;
      }
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      toast.success("Admin login successful!");
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <Toaster richColors position="top-right" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] glow-effect" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
              <Shield className="text-primary" size={32} />
            </div>
            <h2 className="text-2xl font-heading font-bold text-white" data-testid="admin-login-title">Admin Access</h2>
            <p className="text-muted-foreground mt-2">Secure administrator login</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2" htmlFor="admin-email">Admin Email</label>
              <input
                id="admin-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/5 border-white/10 focus:border-primary focus:ring-primary/20 rounded-xl h-12 px-4 text-white placeholder:text-gray-500 border outline-none"
                placeholder="admin@teamacy.com"
                data-testid="admin-email-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2" htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white/5 border-white/10 focus:border-primary focus:ring-primary/20 rounded-xl h-12 px-4 text-white placeholder:text-gray-500 border outline-none"
                placeholder="••••••••"
                data-testid="admin-password-input"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-4 text-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              data-testid="admin-login-submit-btn"
            >
              {loading ? "Verifying..." : "Admin Login"}
              <Shield size={20} />
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="user-login-link">
              User Login
            </Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;