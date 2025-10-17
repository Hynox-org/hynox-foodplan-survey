"use client";

import Image from "next/image"; // Import the Image component
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.1 }}
          className="flex items-center space-x-2"
        >
          <Image
            src="/hynox_logo.jpg"
            alt="HYNOX Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="text-2xl font-bold text-foreground hover:text-red-600 transition-colors">
            Forms
          </div>
          <div className="flex space-x-1">
            <motion.div
              className="w-2 h-2 rounded-full bg-red-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
            ></motion.div>
            <motion.div
              className="w-2 h-2 rounded-full bg-blue-600"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
            ></motion.div>
            <motion.div
              className="w-2 h-2 rounded-full bg-green-800"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}
            ></motion.div>
            <motion.div
              className="w-2 h-2 rounded-full bg-yellow-400"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.9 }}
            ></motion.div>
          </div>
        </motion.div>

        <nav className="hidden md:flex items-center space-x-8">
          <motion.a
            href="/"
            className="text-foreground hover:text-red-600 transition-colors relative group"
            whileHover={{ y: -2 }}
          >
            Home
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </motion.a>
          <motion.a
            href="https://www.hynox.in/about"
            target="_blank"
            className="text-foreground hover:text-blue-600 transition-colors relative group"
            whileHover={{ y: -2 }}
          >
            About
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </motion.a>
          <motion.a
            href="https://www.hynox.in/#services"
            target="_blank"
            className="text-foreground hover:text-teal-400 transition-colors relative group"
            whileHover={{ y: -2 }}
          >
            Services
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </motion.a>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex">
            <motion.a
              href="https://www.hynox.in/#services"
              target="_blank"
              className="text-white bg-blue-600 hover:bg-red-700 transition-colors py-2 px-4 rounded-md"
              whileHover={{ scale: 1.05 }}
            >
              Explore more
            </motion.a>
          </div>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground hover:text-red-600"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-background/95 backdrop-blur-md border-t border-border"
        >
          <nav className="flex flex-col space-y-4 p-4 text-center">
            <a
              href="#"
              className="text-foreground hover:text-red-600 transition-colors py-2"
            >
              Home
            </a>
            <a
              href="https://www.hynox.in/about"
              target="_blank"
              className="text-foreground hover:text-blue-600 transition-colors py-2"
            >
              About
            </a>
            <a
              href="https://www.hynox.in/#services"
              target="_blank"
              className="text-foreground hover:text-teal-400 transition-colors py-2"
            >
              Services
            </a>
            <a
              href="https://www.hynox.in/#services"
              target="_blank"
              className="text-white bg-red-600 hover:bg-red-700 transition-colors py-2 px-4 rounded-md"
            >
              Our Services
            </a>
          </nav>
        </motion.div>
      )}
    </header>
  );
}
