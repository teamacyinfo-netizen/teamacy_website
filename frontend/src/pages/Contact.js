import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Phone, MapPin, Instagram, Linkedin, Youtube, Send } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "../components/ui/sonner";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Contact = ({ user, setUser }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    subject: "",
    message: "",
    type: "enquiry",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    // 🔐 Login check
    if (!token) {
      toast.error("Please login to send enquiry or feedback");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${API}/messages`,
        {
          subject: form.subject,
          message: form.message,
          type: form.type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Message sent successfully!");
      setForm({ subject: "", message: "", type: "enquiry" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Toaster richColors position="top-right" />
      <Navbar user={user} setUser={setUser} />

      {/* HERO */}
      <section className="pt-24 text-center">
        <h1 className="text-5xl font-bold mb-4">Contact Teamacy</h1>
        <p className="text-muted-foreground">
          Send us an enquiry or feedback (login required)
        </p>
      </section>

      {/* CONTACT INFO */}
      <section className="py-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-6">
        <div className="bg-white/5 p-6 rounded-xl text-center">
          <Mail className="mx-auto mb-2" />
          <p>teamacy.info@gmail.com</p>
        </div>
        <div className="bg-white/5 p-6 rounded-xl text-center">
          <Phone className="mx-auto mb-2" />
          <p>+91 90255 87446</p>
        </div>
        <div className="bg-white/5 p-6 rounded-xl text-center">
          <MapPin className="mx-auto mb-2" />
          <p>India</p>
        </div>
      </section>

      {/* SINGLE FORM */}
      <section className="py-16 max-w-xl mx-auto px-6">
        <div className="bg-white/5 p-8 rounded-2xl">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Send Enquiry or Feedback
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* TYPE */}
            <select
              className="w-full p-3 rounded bg-black/40 border border-white/10"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="enquiry">Enquiry</option>
              <option value="feedback">Feedback</option>
            </select>

            {/* SUBJECT */}
            <input
              className="w-full p-3 rounded bg-black/40 border border-white/10"
              placeholder="Subject"
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />

            {/* MESSAGE */}
            <textarea
              className="w-full p-3 rounded bg-black/40 border border-white/10"
              rows="4"
              placeholder="Your message"
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />

            {/* BUTTON */}
            <button
              className="w-full bg-primary py-3 rounded-full flex justify-center gap-2 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
              <Send size={18} />
            </button>
          </form>
        </div>
      </section>

      {/* SOCIAL */}
      <section className="py-12 text-center flex justify-center gap-6">
        <a href="https://www.instagram.com/teamacy_info" target="_blank" rel="noreferrer">
          <Instagram />
        </a>
        <a href="https://linkedin.com/company/teamacy" target="_blank" rel="noreferrer">
          <Linkedin />
        </a>
        <a href="https://youtube.com/@teamacy_techpartner" target="_blank" rel="noreferrer">
          <Youtube />
        </a>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
