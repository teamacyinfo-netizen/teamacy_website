import { motion } from "framer-motion";
import { Code, TrendingUp, Palette, Calendar, Smartphone, Cloud, Shield, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Services = ({ user, setUser }) => {
  const services = [
    {
      icon: <Code size={48} />,
      title: "Software Development",
      description: "Custom software solutions built with cutting-edge technologies to meet your unique business requirements.",
      features: ["Web Applications", "Mobile Apps", "Desktop Software", "API Development", "System Integration"],
      image: "https://images.unsplash.com/photo-1753998943413-8cba1b923c0e?crop=entropy&cs=srgb&fm=jpg&q=85"
    },
    {
      icon: <TrendingUp size={48} />,
      title: "Digital Marketing",
      description: "Data-driven marketing strategies to boost your online presence and drive measurable results.",
      features: ["SEO Optimization", "Social Media Marketing", "Content Strategy", "PPC Campaigns", "Analytics & Reporting"],
      image: "https://images.unsplash.com/photo-1578070581071-d9b52bf80993?crop=entropy&cs=srgb&fm=jpg&q=85"
    },
    {
      icon: <Palette size={48} />,
      title: "Branding & Design",
      description: "Create memorable brand identities that resonate with your target audience and stand out from competition.",
      features: ["Logo Design", "Brand Strategy", "Visual Identity", "Marketing Collateral", "Brand Guidelines"],
      image: "https://images.unsplash.com/photo-1627543858482-b98694bcb2fe?crop=entropy&cs=srgb&fm=jpg&q=85"
    },
    {
      icon: <Calendar size={48} />,
      title: "Event Management",
      description: "End-to-end event planning and execution services for corporate events, conferences, and special occasions.",
      features: ["Event Planning", "Venue Management", "Vendor Coordination", "On-site Execution", "Post-Event Analysis"],
      image: "https://images.unsplash.com/photo-1618613403887-ed08ea9f8f6e?crop=entropy&cs=srgb&fm=jpg&q=85"
    },
    {
      icon: <Smartphone size={48} />,
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications that deliver exceptional user experiences.",
      features: ["iOS Development", "Android Development", "React Native", "Flutter", "App Store Deployment"],
      image: "https://images.unsplash.com/photo-1753998943413-8cba1b923c0e?crop=entropy&cs=srgb&fm=jpg&q=85"
    },
    {
      icon: <Cloud size={48} />,
      title: "Cloud Solutions",
      description: "Scalable and secure cloud infrastructure to power your digital transformation.",
      features: ["Cloud Migration", "AWS/Azure Services", "DevOps", "Cloud Security", "Infrastructure Management"],
      image: "https://images.unsplash.com/photo-1578070581071-d9b52bf80993?crop=entropy&cs=srgb&fm=jpg&q=85"
    },
    {
      icon: <Shield size={48} />,
      title: "Projects",
      description: "We offer end-to-end project support in both hardware and software, helping you design, develop, and successfully complete real-world projects..",
      features: ["College Projects", "School Projects", "Iot Projects", "Project Training"],
      image: "https://images.unsplash.com/photo-1627543858482-b98694bcb2fe?crop=entropy&cs=srgb&fm=jpg&q=85"
    },
    {
      icon: <Megaphone size={48} />,
      title: "Content Creation",
      description: "Engaging content that tells your story and connects with your audience across all platforms.",
      features: ["Copywriting", "Video Production", "Graphic Design", "Photography", "Social Media Content"],
      image: "https://images.unsplash.com/photo-1618613403887-ed08ea9f8f6e?crop=entropy&cs=srgb&fm=jpg&q=85"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar user={user} setUser={setUser} />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] glow-effect" />
        
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
              Our Services
            </motion.p>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-heading font-bold tracking-tight leading-none mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              data-testid="services-title"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400">
                Comprehensive
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400">
                Digital Solutions
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              From concept to execution, we provide end-to-end services to help your business thrive
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-500"
                data-testid={`service-detail-${index}`}
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-primary">
                    {service.icon}
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-heading font-semibold text-white mb-4">{service.title}</h3>
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-white mb-3">Key Features:</p>
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
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
            <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-6">Let's Build Something Amazing</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Ready to take your project to the next level? Get in touch with us today.
            </p>
            <Link
              to="/contact"
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-4 text-lg font-medium transition-all hover:scale-105 inline-flex items-center gap-2"
              data-testid="services-cta-btn"
            >
              Request a Quote
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;