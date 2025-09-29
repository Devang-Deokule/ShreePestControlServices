import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <motion.div
      className="sticky top-0 z-50 w-full h-[100px] flex justify-between items-center px-8"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Logo */}
      <motion.img
        src="src/assets/logo.png"
        className="w-[79px] h-[79px] flex-shrink-0 aspect-square"
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
        <li><a href="#home" className="hover:text-[#03DCE0] transition-colors duration-300">Home</a></li>
        <li><a href="#about" className="hover:text-[#03DCE0] transition-colors duration-300">About</a></li>
        <li><a href="#services" className="hover:text-[#03DCE0] transition-colors duration-300">Services</a></li>
        <li><a href="#features" className="hover:text-[#03DCE0] transition-colors duration-300">Features</a></li>
        <li><a href="#contact" className="hover:text-[#03DCE0] transition-colors duration-300">Contact</a></li>
      </motion.ul>

      {/* Button */}
      <Link to="/booking">
    <motion.button
  className="flex w-[165px] h-[46px] px-[17px] py-[13px] pl-[19px] justify-center items-center flex-shrink-0 rounded-[5px] bg-[#03DCE0] cursor-pointer mt-4"
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
  )
}

export default Navbar
