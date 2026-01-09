import { motion } from "framer-motion";
import { ArrowRight, Code, Palette, Calendar, TrendingUp, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = ({ user, setUser }) => {
  const services = [
    {
      icon: <Code size={32} />,
      title: "Software Development",
      description: "Custom software solutions tailored to your business needs.",
      image: "https://images.unsplash.com/photo-1753998943413-8cba1b923c0e?crop=entropy&cs=srgb&fm=jpg&q=85"
    },
    {
      icon: <TrendingUp size={32} />,
      title: "Digital Marketing",
      description: "Drive growth with data-driven marketing strategies.",
      image: "https://images.unsplash.com/photo-1578070581071-d9b52bf80993?crop=entropy&cs=srgb&fm=jpg&q=85"
    },
    {
      icon: <Palette size={32} />,
      title: "Branding",
      description: "Create memorable brand identities that resonate.",
      image: "https://images.unsplash.com/photo-1627543858482-b98694bcb2fe?crop=entropy&cs=srgb&fm=jpg&q=85"
    },
    {
      icon: <Calendar size={32} />,
      title: "Event Management",
      description: "Flawless execution of events from concept to completion.",
      image: "https://images.unsplash.com/photo-1618613403887-ed08ea9f8f6e?crop=entropy&cs=srgb&fm=jpg&q=85"
    }
  ];

  const stats = [
    { number: "2+", label: "Projects Completed" },
    { number: "2+", label: "Happy Clients" },
    { number: "5+", label: "Team Members" },
    { number: "2+", label: "Years Experience" }
  ];

  return (
    <div className="min-h-screen">
      <Navbar user={user} setUser={setUser} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] glow-effect" />
        
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
              Welcome to Teamacy
            </motion.p>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-heading font-bold tracking-tight leading-none mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              data-testid="hero-title"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400">
                Transform Your Vision
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400">
                Into Reality
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              data-testid="hero-description"
            >
              We deliver exceptional digital marketing, software development, branding, and event management services to businesses, startups, and institutions worldwide.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Link
                to="/contact"
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-4 text-lg font-medium transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] inline-flex items-center justify-center gap-2"
                data-testid="hero-cta-contact"
              >
                Get Started
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/services"
                className="bg-secondary hover:bg-secondary/80 text-white rounded-full px-8 py-4 text-lg font-medium border border-white/10 transition-all hover:scale-105 inline-flex items-center justify-center"
                data-testid="hero-cta-services"
              >
                View Services
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-4">Our Services</p>
            <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-6" data-testid="services-section-title">
              What We Offer
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive solutions to help your business thrive in the digital age
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative h-[400px] rounded-3xl overflow-hidden group cursor-pointer"
                data-testid={`service-card-${index}`}
              >
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="text-primary mb-4">{service.icon}</div>
                  <h3 className="text-2xl font-heading font-semibold text-white mb-2">{service.title}</h3>
                  <p className="text-gray-300">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link
              to="/services"
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-4 text-lg font-medium transition-all hover:scale-105 inline-flex items-center gap-2"
              data-testid="view-all-services-btn"
            >
              View All Services
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-6">Why Choose Teamacy?</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Expert Team", description: "Skilled professionals with years of industry experience" },
              { title: "Quality Delivery", description: "On-time delivery without compromising on quality" },
              { title: "Client-Focused", description: "Your success is our priority. We listen and deliver." },
              { title: "Innovative Solutions", description: "Cutting-edge technology and creative approaches" },
              { title: "Affordable Pricing", description: "Premium services at competitive rates" },
              { title: "24/7 Support", description: "Round-the-clock assistance for your peace of mind" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 hover:border-primary/50 transition-all duration-500"
              >
                <CheckCircle className="text-primary mb-4" size={32} />
                <h3 className="text-xl font-heading font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 relative">
        <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="backdrop-blur-xl bg-gradient-to-r from-violet-600/20 via-blue-600/20 to-cyan-500/20 border border-white/10 rounded-3xl p-12"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's discuss how we can help transform your business with our comprehensive services.
            </p>
            <Link
              to="/contact"
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-4 text-lg font-medium transition-all hover:scale-105 inline-flex items-center gap-2"
              data-testid="cta-contact-btn"
            >
              Contact Us Today
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;