import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Portfolio = ({ user, setUser }) => {
  const projects = [
    {
      title: "E-Commerce Platform",
      category: "Software Development",
      description: "A comprehensive online marketplace with advanced features and seamless user experience.",
      image: "https://images.unsplash.com/photo-1753998943413-8cba1b923c0e?crop=entropy&cs=srgb&fm=jpg&q=85",
      tags: ["React", "Node.js", "MongoDB"]
    },
    {
      title: "Brand Identity Redesign",
      category: "Branding",
      description: "Complete brand transformation for a leading tech startup, including logo, guidelines, and marketing materials.",
      image: "https://images.unsplash.com/photo-1627543858482-b98694bcb2fe?crop=entropy&cs=srgb&fm=jpg&q=85",
      tags: ["Branding", "Design", "Strategy"]
    },
    
    {
      title: "Mobile Banking App",
      category: "Software Development",
      description: "Secure and user-friendly mobile banking application with biometric authentication.",
      image: "https://images.unsplash.com/photo-1753998943413-8cba1b923c0e?crop=entropy&cs=srgb&fm=jpg&q=85",
      tags: ["React Native", "Security", "FinTech"]
    },
    {
      title: "Corporate Event Series",
      category: "Event Management",
      description: "Managed a series of corporate events including product launches and team building activities.",
      image: "https://images.unsplash.com/photo-1618613403887-ed08ea9f8f6e?crop=entropy&cs=srgb&fm=jpg&q=85",
      tags: ["Corporate", "Planning", "Execution"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar user={user} setUser={setUser} />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[150px] glow-effect" />
        
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
              Portfolio
            </motion.p>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-heading font-bold tracking-tight leading-none mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              data-testid="portfolio-title"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400">
                Our Work
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400">
                Speaks Volumes
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Explore our successful projects and see how we've helped businesses achieve their goals
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-500 cursor-pointer"
                data-testid={`portfolio-item-${index}`}
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute top-4 right-4 bg-primary/80 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-medium">
                    {project.category}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="text-white" size={32} />
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-heading font-semibold text-white mb-3">{project.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="backdrop-blur-xl bg-gradient-to-r from-violet-600/20 via-blue-600/20 to-cyan-500/20 border border-white/10 rounded-3xl p-12"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">04+</div>
                <div className="text-muted-foreground">Projects Delivered</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">99%</div>
                <div className="text-muted-foreground">Client Satisfaction</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">04+</div>
                <div className="text-muted-foreground">Happy Clients</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">02+</div>
                <div className="text-muted-foreground">Years Experience</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Portfolio;