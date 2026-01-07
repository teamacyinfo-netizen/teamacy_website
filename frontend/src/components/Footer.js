import { Instagram, Linkedin, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black/60 border-t border-white/10 py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-heading font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-400">
                Teamacy
              </span>
            </h3>
            <p className="text-muted-foreground">
              Digital marketing, software development, branding, event management, and tech services company.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/services" className="block text-muted-foreground hover:text-primary transition-colors">
                Services
              </Link>
              <Link to="/portfolio" className="block text-muted-foreground hover:text-primary transition-colors">
                Portfolio
              </Link>
              <Link to="/contact" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Services</h4>
            <div className="space-y-2">
              <p className="text-muted-foreground">Digital Marketing</p>
              <p className="text-muted-foreground">Software Development</p>
              <p className="text-muted-foreground">Branding</p>
              <p className="text-muted-foreground">Event Management</p>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/teamacy_info" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 rounded-full p-3 transition-all hover:scale-110"
                data-testid="footer-instagram"
                aria-label="Instagram"
              >
                <Instagram size={20} className="text-white" />
              </a>
              <a 
                href="https://linkedin.com/company/teamacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 rounded-full p-3 transition-all hover:scale-110"
                data-testid="footer-linkedin"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} className="text-white" />
              </a>
              <a 
                href="https://youtube.com/@teamacy_techpartner" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 rounded-full p-3 transition-all hover:scale-110"
                data-testid="footer-youtube"
                aria-label="YouTube"
              >
                <Youtube size={20} className="text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Teamacy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;