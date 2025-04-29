
import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Youtube } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
          <img src="/images/bikes/dephyr_logo.jpg" alt="Bangalore Wheels Logo" className="w-50 h-16 mb-4 rounded-xl" />
            <p className="text-gray-300 mb-4">
              Dephyr is your trusted platform for renting bikes in Bangalore.
              We connect you with the best rental shops in the city.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg text-orange-500 font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/bikes" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Bikes
                </Link>
              </li>
              <li>
                <Link to="/shops" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Shops
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-orange-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg text-orange-500 font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-300 hover:text-orange-500 transition-colors">
                <Link to="/bikes?type=scooter">Scooter Rentals</Link>
              </li>
              <li className="text-gray-300 hover:text-orange-500 transition-colors">
                <Link to="/bikes?type=cruiser">Cruiser Rentals</Link>
              </li>
              <li className="text-gray-300 hover:text-orange-500 transition-colors">
                <Link to="/bikes?type=sports">Sports Bike Rentals</Link>
              </li>
              <li className="text-gray-300 hover:text-orange-500 transition-colors">
                <Link to="/bikes?type=adventure">Adventure Bike Rentals</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg text-orange-500 font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-orange-500 mr-2 shrink-0 mt-0.5" />
                <span className="text-gray-300">123 MG Road, Bangalore, Karnataka 560001</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-orange-500 mr-2 shrink-0" />
                <span className="text-gray-300">+91 88206 79928</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-orange-500 mr-2 shrink-0" />
                <span className="text-gray-300">contact@dephyr.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Dephyr. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
