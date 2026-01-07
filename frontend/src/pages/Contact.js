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

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setLoadingEnquiry(true);
    
    try {
      await axios.post(`${API}/enquiries`, enquiryForm);
      toast.success("Enquiry submitted successfully! We'll get back to you soon.");
      setEnquiryForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to submit enquiry. Please try again.");
    } finally {
      setLoadingEnquiry(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setLoadingFeedback(true);
    
    try {
      await axios.post(`${API}/feedback`, feedbackForm);
      toast.success("Feedback submitted successfully! Thank you for your input.");
      setFeedbackForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setLoadingFeedback(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Toaster richColors position="top-right" />
      <Navbar user={user} setUser={setUser} />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] glow-effect" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.p 
              className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Contact Us
            </motion.p>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-heading font-bold tracking-tight leading-none mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              data-testid="contact-title"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400">
                Let's Start a
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400">
                Conversation
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Have a project in mind or want to provide feedback? We'd love to hear from you.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
            >
              <Mail className="text-primary mx-auto mb-4" size={32} />
              <h3 className="font-heading font-semibold text-white mb-2">Email</h3>
              <p className="text-muted-foreground">teamacyadmin@gmail.com</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
            >
              <Phone className="text-primary mx-auto mb-4" size={32} />
              <h3 className="font-heading font-semibold text-white mb-2">Phone</h3>
              <p className="text-muted-foreground">+1 (555) 123-4567</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
            >
              <MapPin className="text-primary mx-auto mb-4" size={32} />
              <h3 className="font-heading font-semibold text-white mb-2">Location</h3>
              <p className="text-muted-foreground">Global Services</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Forms Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enquiry Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8"
            >
              <h2 className="text-3xl font-heading font-bold mb-6" data-testid="enquiry-form-title">Send an Enquiry</h2>
              <form onSubmit={handleEnquirySubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2" htmlFor="enquiry-name">Name</label>
                  <input
                    id="enquiry-name"
                    type="text"
                    required
                    value={enquiryForm.name}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                    className="w-full bg-white/5 border-white/10 focus:border-primary focus:ring-primary/20 rounded-xl h-12 px-4 text-white placeholder:text-gray-500 border outline-none"
                    placeholder="Your name"
                    data-testid="enquiry-name-input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2" htmlFor="enquiry-email">Email</label>
                  <input
                    id="enquiry-email"
                    type="email"
                    required
                    value={enquiryForm.email}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                    className="w-full bg-white/5 border-white/10 focus:border-primary focus:ring-primary/20 rounded-xl h-12 px-4 text-white placeholder:text-gray-500 border outline-none"
                    placeholder="your@email.com"
                    data-testid="enquiry-email-input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2" htmlFor="enquiry-subject">Subject / Service</label>
                  <input
                    id="enquiry-subject"
                    type="text"
                    required
                    value={enquiryForm.subject}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, subject: e.target.value })}
                    className="w-full bg-white/5 border-white/10 focus:border-primary focus:ring-primary/20 rounded-xl h-12 px-4 text-white placeholder:text-gray-500 border outline-none"
                    placeholder="Service you're interested in"
                    data-testid="enquiry-subject-input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2" htmlFor="enquiry-message">Message</label>
                  <textarea
                    id="enquiry-message"
                    required
                    value={enquiryForm.message}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    rows={5}
                    className="w-full bg-white/5 border-white/10 focus:border-primary focus:ring-primary/20 rounded-xl p-4 text-white placeholder:text-gray-500 border outline-none resize-none"
                    placeholder="Tell us about your project..."
                    data-testid="enquiry-message-input"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loadingEnquiry}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-4 text-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  data-testid="enquiry-submit-btn"
                >
                  {loadingEnquiry ? "Submitting..." : "Send Enquiry"}
                  <Send size={20} />
                </button>
              </form>
            </motion.div>

            {/* Feedback Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8"
            >
              <h2 className="text-3xl font-heading font-bold mb-6" data-testid="feedback-form-title">Share Your Feedback</h2>
              <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2" htmlFor="feedback-name">Name</label>
                  <input
                    id="feedback-name"
                    type="text"
                    required
                    value={feedbackForm.name}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                    className="w-full bg-white/5 border-white/10 focus:border-primary focus:ring-primary/20 rounded-xl h-12 px-4 text-white placeholder:text-gray-500 border outline-none"
                    placeholder="Your name"
                    data-testid="feedback-name-input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2" htmlFor="feedback-email">Email</label>
                  <input
                    id="feedback-email"
                    type="email"
                    required
                    value={feedbackForm.email}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                    className="w-full bg-white/5 border-white/10 focus:border-primary focus:ring-primary/20 rounded-xl h-12 px-4 text-white placeholder:text-gray-500 border outline-none"
                    placeholder="your@email.com"
                    data-testid="feedback-email-input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2" htmlFor="feedback-subject">Subject</label>
                  <input
                    id="feedback-subject"
                    type="text"
                    required
                    value={feedbackForm.subject}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, subject: e.target.value })}
                    className="w-full bg-white/5 border-white/10 focus:border-primary focus:ring-primary/20 rounded-xl h-12 px-4 text-white placeholder:text-gray-500 border outline-none"
                    placeholder="Feedback subject"
                    data-testid="feedback-subject-input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2" htmlFor="feedback-message">Message</label>
                  <textarea
                    id="feedback-message"
                    required
                    value={feedbackForm.message}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                    rows={5}
                    className="w-full bg-white/5 border-white/10 focus:border-primary focus:ring-primary/20 rounded-xl p-4 text-white placeholder:text-gray-500 border outline-none resize-none"
                    placeholder="Share your thoughts..."
                    data-testid="feedback-message-input"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loadingFeedback}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-4 text-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  data-testid="feedback-submit-btn"
                >
                  {loadingFeedback ? "Submitting..." : "Send Feedback"}
                  <Send size={20} />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-heading font-bold mb-8">Connect With Us</h2>
            <div className="flex justify-center gap-6">
              <a 
                href="https://www.instagram.com/teamacy_info" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 rounded-full p-6 transition-all hover:scale-110"
                data-testid="contact-instagram"
                aria-label="Instagram"
              >
                <Instagram size={32} className="text-white" />
              </a>
              <a 
                href="https://linkedin.com/company/teamacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 rounded-full p-6 transition-all hover:scale-110"
                data-testid="contact-linkedin"
                aria-label="LinkedIn"
              >
                <Linkedin size={32} className="text-white" />
              </a>
              <a 
                href="https://youtube.com/@teamacy_techpartner" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 rounded-full p-6 transition-all hover:scale-110"
                data-testid="contact-youtube"
                aria-label="YouTube"
              >
                <Youtube size={32} className="text-white" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;