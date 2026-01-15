import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Phone, MapPin, Instagram, Linkedin, Youtube, Send } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "../components/ui/sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Contact = ({ user, setUser }) => {
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [feedbackForm, setFeedbackForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [loadingEnquiry, setLoadingEnquiry] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  // 🔥 ENQUIRY → unified messages API
  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setLoadingEnquiry(true);

    try {
      await axios.post(`${API}/messages`, {
        ...enquiryForm,
        type: "enquiry"
      });

      toast.success("Enquiry sent successfully!");
      setEnquiryForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to send enquiry. Try again.");
    } finally {
      setLoadingEnquiry(false);
    }
  };

  // 🔥 FEEDBACK → unified messages API
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setLoadingFeedback(true);

    try {
      await axios.post(`${API}/messages`, {
        ...feedbackForm,
        type: "feedback"
      });

      toast.success("Feedback sent successfully!");
      setFeedbackForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to send feedback. Try again.");
    } finally {
      setLoadingFeedback(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Toaster richColors position="top-right" />
      <Navbar user={user} setUser={setUser} />

      {/* HERO */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 text-center">
          <motion.h1
            className="text-5xl md:text-7xl font-heading font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Let’s Talk with Teamacy
          </motion.h1>
          <p className="text-muted-foreground text-lg">
            Send us your enquiry or feedback — we’ll respond fast.
          </p>
        </div>
      </section>

      {/* CONTACT INFO */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
          <div className="bg-white/5 p-6 rounded-xl text-center">
            <Mail className="mx-auto text-primary mb-3" />
            <p>teamacy.info@gmail.com</p>
          </div>
          <div className="bg-white/5 p-6 rounded-xl text-center">
            <Phone className="mx-auto text-primary mb-3" />
            <p>+91 90255 87446</p>
          </div>
          <div className="bg-white/5 p-6 rounded-xl text-center">
            <MapPin className="mx-auto text-primary mb-3" />
            <p>India</p>
          </div>
        </div>
      </section>

      {/* FORMS */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 px-6">

          {/* ENQUIRY */}
          <div className="bg-white/5 p-8 rounded-2xl">
            <h2 className="text-3xl font-bold mb-6">Send Enquiry</h2>
            <form onSubmit={handleEnquirySubmit} className="space-y-4">
              <input placeholder="Name" required className="input" value={enquiryForm.name} onChange={e => setEnquiryForm({...enquiryForm, name:e.target.value})} />
              <input placeholder="Email" required className="input" value={enquiryForm.email} onChange={e => setEnquiryForm({...enquiryForm, email:e.target.value})} />
              <input placeholder="Subject" required className="input" value={enquiryForm.subject} onChange={e => setEnquiryForm({...enquiryForm, subject:e.target.value})} />
              <textarea placeholder="Message" required className="input" rows={4} value={enquiryForm.message} onChange={e => setEnquiryForm({...enquiryForm, message:e.target.value})}></textarea>

              <button className="btn w-full" disabled={loadingEnquiry}>
                {loadingEnquiry ? "Sending..." : "Send Enquiry"}
              </button>
            </form>
          </div>

          {/* FEEDBACK */}
          <div className="bg-white/5 p-8 rounded-2xl">
            <h2 className="text-3xl font-bold mb-6">Send Feedback</h2>
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <input placeholder="Name" required className="input" value={feedbackForm.name} onChange={e => setFeedbackForm({...feedbackForm, name:e.target.value})} />
              <input placeholder="Email" required className="input" value={feedbackForm.email} onChange={e => setFeedbackForm({...feedbackForm, email:e.target.value})} />
              <input placeholder="Subject" required className="input" value={feedbackForm.subject} onChange={e => setFeedbackForm({...feedbackForm, subject:e.target.value})} />
              <textarea placeholder="Message" required className="input" rows={4} value={feedbackForm.message} onChange={e => setFeedbackForm({...feedbackForm, message:e.target.value})}></textarea>

              <button className="btn w-full" disabled={loadingFeedback}>
                {loadingFeedback ? "Sending..." : "Send Feedback"}
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* SOCIAL */}
      <section className="py-20 text-center">
        <div className="flex justify-center gap-6">
          <a href="https://www.instagram.com/teamacy_info" target="_blank"><Instagram size={32} /></a>
          <a href="https://linkedin.com/company/teamacy" target="_blank"><Linkedin size={32} /></a>
          <a href="https://youtube.com/@teamacy_techpartner" target="_blank"><Youtube size={32} /></a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
