import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Mail, MessageSquare, Calendar } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = ({ user, setUser }) => {
  const [enquiries, setEnquiries] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("enquiries");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      const [enquiriesRes, feedbackRes] = await Promise.all([
        axios.get(`${API}/enquiries`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/feedback`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setEnquiries(enquiriesRes.data);
      setFeedback(feedbackRes.data);
    } catch (error) {
      toast.error("Failed to load data. Please try again.");
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const makeLinksClickable = (text) => {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return text.split(urlPattern).map((part, index) => {
      if (part.match(urlPattern)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:text-primary/80"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors position="top-right" />
      
      {/* Header */}
      <header className="bg-black/60 border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold" data-testid="dashboard-title">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-400">
                  Teamacy Admin
                </span>
              </h1>
              <p className="text-muted-foreground text-sm">Welcome, {user?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-destructive hover:bg-destructive/90 text-white px-6 py-2 rounded-full transition-all hover:scale-105"
              data-testid="logout-btn"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="w-full px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary/20 p-4 rounded-full">
                <Mail className="text-primary" size={32} />
              </div>
              <div>
                <p className="text-3xl font-heading font-bold text-white">{enquiries.length}</p>
                <p className="text-muted-foreground">Total Enquiries</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="bg-accent/20 p-4 rounded-full">
                <MessageSquare className="text-accent" size={32} />
              </div>
              <div>
                <p className="text-3xl font-heading font-bold text-white">{feedback.length}</p>
                <p className="text-muted-foreground">Total Feedback</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-white/10">
          <button
            onClick={() => setActiveTab("enquiries")}
            className={`pb-4 px-6 font-medium transition-colors relative ${
              activeTab === "enquiries" ? "text-primary" : "text-muted-foreground hover:text-white"
            }`}
            data-testid="enquiries-tab"
          >
            Enquiries ({enquiries.length})
            {activeTab === "enquiries" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("feedback")}
            className={`pb-4 px-6 font-medium transition-colors relative ${
              activeTab === "feedback" ? "text-primary" : "text-muted-foreground hover:text-white"
            }`}
            data-testid="feedback-tab"
          >
            Feedback ({feedback.length})
            {activeTab === "feedback" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === "enquiries" && (
            <div data-testid="enquiries-list">
              {enquiries.length === 0 ? (
                <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
                  <Mail className="text-muted-foreground mx-auto mb-4" size={48} />
                  <p className="text-muted-foreground">No enquiries yet</p>
                </div>
              ) : (
                enquiries.map((enquiry, index) => (
                  <motion.div
                    key={enquiry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all"
                    data-testid={`enquiry-item-${index}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/20 p-2 rounded-full">
                          <Mail className="text-primary" size={20} />
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold text-white text-lg">{enquiry.name}</h3>
                          <a href={`mailto:${enquiry.email}`} className="text-primary hover:underline text-sm">
                            {enquiry.email}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Calendar size={16} />
                        {formatDate(enquiry.created_at)}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-white mb-1">Subject:</p>
                        <p className="text-muted-foreground">{enquiry.subject}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-semibold text-white mb-1">Message:</p>
                        <p className="text-muted-foreground whitespace-pre-wrap link-text">
                          {makeLinksClickable(enquiry.message)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {activeTab === "feedback" && (
            <div data-testid="feedback-list">
              {feedback.length === 0 ? (
                <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
                  <MessageSquare className="text-muted-foreground mx-auto mb-4" size={48} />
                  <p className="text-muted-foreground">No feedback yet</p>
                </div>
              ) : (
                feedback.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all"
                    data-testid={`feedback-item-${index}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-accent/20 p-2 rounded-full">
                          <MessageSquare className="text-accent" size={20} />
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold text-white text-lg">{item.name}</h3>
                          <a href={`mailto:${item.email}`} className="text-primary hover:underline text-sm">
                            {item.email}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Calendar size={16} />
                        {formatDate(item.created_at)}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-white mb-1">Subject:</p>
                        <p className="text-muted-foreground">{item.subject}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-semibold text-white mb-1">Message:</p>
                        <p className="text-muted-foreground whitespace-pre-wrap link-text">
                          {makeLinksClickable(item.message)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
