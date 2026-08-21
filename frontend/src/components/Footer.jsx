import { 
  Award, BookUser, Building, Building2, ChartColumnDecreasing, 
  Home, LogIn, User2, Mail, Phone, MapPin, 
  Facebook, Twitter, Linkedin, Youtube, Instagram,
  ArrowUpRight, Clock, Calendar, Users, Briefcase
} from 'lucide-react';
import { MdContactPhone, MdEmail } from "react-icons/md";
import React, { useState, useEffect } from 'react';
import { RiStockLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const Links = [
    { icon: <Home size={18} />, name: "Home", href: "/" },
    { icon: <User2 size={18} />, name: "About", href: "/about" },
    { icon: <Award size={18} />, name: "Placements", href: "/placements" },
    // { icon: <Building2 size={18} />, name: "Departments", href: "/departments" },
    { icon: <Building size={18} />, name: "Drives", href: "/drives" },
    { icon: <LogIn size={18} />, name: "Login", href: "/login" },
  ];

  const socialLinks = [
    { icon: <Linkedin size={20} />, href: "#", label: "LinkedIn", color: "hover:bg-[#0A66C2]" },
    { icon: <Instagram size={20} />, href: "#", label: "Instagram", color: "hover:bg-gradient-to-r from-[#E4405F] to-[#F58529]" },
  ];


  return (
    <footer className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 ">
          
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  RGUKT (IIIT) AP
                </h2>
                <span className="text-xs text-gray-400">Srikakulam Campus</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-300 leading-relaxed max-w-xs">
              Rajiv Gandhi University of Knowledge Technologies — nurturing future 
              engineers and innovators since 2008.
            </p>

            
            {/* Social Links */}
            {/* <div className="flex gap-2 pt-2">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-lg bg-white/10 hover:text-white transition-all duration-300 ${social.color}`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div> */}
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-8 h-0.5 bg-blue-500"></span>
              Quick Links
            </h3>
            <ul className="space-y-2">
              {Links.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to={link.href}
                    className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-300 group"
                  >
                    <span className="text-blue-400 group-hover:scale-110 transition-transform">
                      {link.icon}
                    </span>
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-8 h-0.5 bg-blue-500"></span>
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-200 hover:text-white transition-colors">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm">RGUKT (IIIT) AP,<br />Srikakulam, Andhra Pradesh</span>
              </li>
              <li className="flex items-center gap-3 text-gray-200 hover:text-white transition-colors">
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="text-sm">+91 12345 67890</span>
              </li>
              <li className="flex items-center gap-3 text-gray-200 hover:text-white transition-colors">
                <Mail className="w-5 h-5 text-blue-400" />
                <span className="text-sm">info@rguktsklm.ac.in</span>
              </li>
              <li className="flex items-center gap-3 text-gray-200 hover:text-white transition-colors">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-sm">Mon-Fri: 9:00 AM - 5:00 PM</span>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter / Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-8 h-0.5 bg-blue-500"></span>
              Location
            </h3>
            <div className="rounded-xl overflow-hidden shadow-lg shadow-blue-500/20 h-48">
              <iframe
                className="w-full h-full border-0  transition-all duration-500 hover:scale-105"
                src="https://www.google.com/maps?q=RGUKT+Srikakulam&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="RGUKT Srikakulam Location"
              />
            </div>
            
            
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 pt-6 border-t border-gray-700 flex flex-col  sm:flex-row justify-center items-center gap-4"
        >
          <p className="text-sm text-gray-400 ">
            © {currentYear} RGUKT (IIIT) AP. All rights reserved.
          </p>
          
        </motion.div>
      </div>

      {/* Decorative Gradient Line */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
    </footer>
  );
};

export default Footer;