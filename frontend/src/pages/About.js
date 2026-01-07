import { motion } from "framer-motion";
import { Target, Users, Award, Zap } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = ({ user, setUser }) => {
  const values = [
    { icon: <Target size={32} />, title: "Mission-Driven", description: "We are committed to delivering excellence in every project" },
    { icon: <Users size={32} />, title: "Client-Centric", description: "Your success is our success. We prioritize your needs" },
    { icon: <Award size={32} />, title: "Quality First", description: "We never compromise on the quality of our deliverables" },
    { icon: <Zap size={32} />, title: "Innovation", description: "Staying ahead with cutting-edge solutions and creativity" }
  ];

  return (
    <div className="min-h-screen">
      <Navbar user={user} setUser={setUser} />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[150px] glow-effect" />
        
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
              About Us
            </motion.p>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-heading font-bold tracking-tight leading-none mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              data-testid="about-title"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400">
                Building Digital
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400">
                Excellence
              </span>
            </motion.h1>
          </motion.div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.unsplash.com/photo-1631038506857-6c970dd9ba02?crop=entropy&cs=srgb&fm=jpg&q=85"
                alt="Teamacy team"
                className="rounded-3xl w-full h-[500px] object-cover border border-white/10"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-6" data-testid="about-subtitle">
                Who We Are
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Teamacy is a leading digital services company specializing in software development, digital marketing, branding, event management, and comprehensive tech solutions.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                With over 15 years of combined experience, we've helped businesses, startups, colleges, institutions, and professionals achieve their goals through innovative and scalable solutions.
              </p>
              <p className="text-lg text-muted-foreground">
                Our team of 50+ dedicated professionals works tirelessly to deliver exceptional results that drive growth and create lasting impact.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-6">Our Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do at Teamacy
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 hover:border-primary/50 transition-all duration-500 text-center"
              >
                <div className="text-primary mb-4 flex justify-center">{value.icon}</div>
                <h3 className="text-xl font-heading font-semibold text-white mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="backdrop-blur-xl bg-gradient-to-br from-violet-600/20 to-blue-600/20 border border-white/10 rounded-3xl p-12"
            >
              <h3 className="text-3xl font-heading font-bold mb-6">Our Vision</h3>
              <p className="text-lg text-muted-foreground">
                To be the most trusted digital partner for businesses worldwide, empowering them with innovative solutions that drive sustainable growth and success.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="backdrop-blur-xl bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border border-white/10 rounded-3xl p-12"
            >
              <h3 className="text-3xl font-heading font-bold mb-6">Our Mission</h3>
              <p className="text-lg text-muted-foreground">
                To deliver exceptional digital services that exceed client expectations, foster innovation, and create meaningful impact in every project we undertake.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;