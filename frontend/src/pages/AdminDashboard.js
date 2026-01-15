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
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("enquiry");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const res = await axios.get(`${API}/admin/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (err) {
      toast.error("Failed to load messages");
      if (err.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  const enquiries = messages.filter(m => m.type === "enquiry");
  const feedback = messages.filter(m => m.type === "feedback");

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const linkify = (text) =>
    text.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
      part.match(/https?:\/\//) ? (
        <a key={i} href={part} target="_blank" rel="noreferrer" className="text-primary underline">
          {part}
        </a>
      ) : part
    );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  const renderCard = (item, index, icon, color) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-6"
    >
      <div className="flex justify-between mb-4">
        <div className="flex gap-3">
          <div className={`${color} p-2 rounded-full`}>{icon}</div>
          <div>
            <h3 className="text-white font-semibold">{item.name}</h3>
            <a href={`mailto:${item.email}`} className="text-primary text-sm">
              {item.email}
            </a>
          </div>
        </div>
        <div className="flex gap-2 text-sm text-muted-foreground">
          <Calendar size={16} />
          {formatDate(item.created_at)}
        </div>
      </div>

      <p className="text-white font-semibold">Subject:</p>
      <p className="text-muted-foreground mb-3">{item.subject}</p>

      <p className="text-white font-semibold">Message:</p>
      <p className="text-muted-foreground whitespace-pre-wrap">{linkify(item.message)}</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors />

      <header className="flex justify-between items-center p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white">Teamacy Admin</h1>
        <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded flex gap-2">
          <LogOut size={18} /> Logout
        </button>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white/5 p-6 rounded-xl">
            <Mail size={32} className="text-primary" />
            <p className="text-3xl text-white">{enquiries.length}</p>
            <p className="text-muted-foreground">Enquiries</p>
          </div>
          <div className="bg-white/5 p-6 rounded-xl">
            <MessageSquare size={32} className="text-accent" />
            <p className="text-3xl text-white">{feedback.length}</p>
            <p className="text-muted-foreground">Feedback</p>
          </div>
        </div>

        <div className="flex gap-6 mb-6">
          <button onClick={() => setActiveTab("enquiry")} className={activeTab === "enquiry" ? "text-primary" : ""}>
            Enquiries
          </button>
          <button onClick={() => setActiveTab("feedback")} className={activeTab === "feedback" ? "text-primary" : ""}>
            Feedback
          </button>
        </div>

        <div className="space-y-6">
          {(activeTab === "enquiry" ? enquiries : feedback).map((item, i) =>
            renderCard(
              item,
              i,
              activeTab === "enquiry" ? <Mail size={18} /> : <MessageSquare size={18} />,
              activeTab === "enquiry" ? "bg-primary/20" : "bg-accent/20"
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
