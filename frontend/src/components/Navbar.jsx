import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useEffect } from 'react';

const Navbar = ({ glossy: glossyProp = false }) => {
  const location = useLocation();
  const isGlossy = glossyProp || location.pathname.includes("/services/"); // only glossy on service detail


  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  return (
    <motion.div
     className={`${
  isGlossy
    ? "fixed top-0 left-0 w-full h-[100px] bg-white/50 text-black backdrop-blur-md shadow-md z-50 px-8 md:px-80 flex justify-between items-center"
    : "sticky top-0 z-50 w-full h-[100px] flex justify-between items-center px-8 text-white"
}`}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Logo */}
      <motion.img
        src={logo}
        className="w-[79px] h-[79px] object-contain"
        alt="Logo"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />

      {/* Nav Links */}
      <motion.ul
        className="text-white font-arial text-[14px] not-italic font-bold leading-normal uppercase cursor-pointer flex gap-[100px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <li>
        <Link
          to="/"
          className={`${isGlossy ? "text-black" : "hover:text-[#03DCE0] transition-colors duration-300"}`}
        >
          Home
        </Link>
      </li>

      <li>
        <Link
          to="/#about"
          className={`${isGlossy ? "text-black" : "hover:text-[#03DCE0] transition-colors duration-300"}`}
        >
          About
        </Link>
      </li>

      <li>
        <Link
          to="/#services"
          className={`${isGlossy ? "text-black" : "hover:text-[#03DCE0] transition-colors duration-300"}`}
        >
          Services
        </Link>
      </li>

      <li>
        <Link
          to="/#features"
          className={`${isGlossy ? "text-black" : "hover:text-[#03DCE0] transition-colors duration-300"}`}
        >
          Features
        </Link>
      </li>

      <li>
        <Link
          to="/#contact"
          className={`${isGlossy ? "text-black" : "hover:text-[#03DCE0] transition-colors duration-300"}`}
        >
          Contact
        </Link>
      </li>
      </motion.ul>

      {/* Button */}
      <Link to="/booking">
        <motion.button
          className="flex w-[165px] h-[46px] px-[17px] py-[13px] pl-[19px] justify-center items-center flex-shrink-0 rounded-[5px] bg-[#03DCE0] cursor-pointer mt-4 text-black font-arial"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          whileHover={{
            scale: 1.08,
            boxShadow: "0 0 25px #03DCE0",
            transition: { duration: 0.3, ease: "easeInOut" }
          }}
          whileTap={{
            scale: 0.95,
            transition: { duration: 0.2, ease: "easeOut" }
          }}
        >
          Schedule Service
        </motion.button>
      </Link>
    </motion.div>
  );
}

export default Navbar  
