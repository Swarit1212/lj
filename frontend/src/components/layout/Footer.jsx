import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-[#0B132B] text-white pt-16 pb-8 border-t border-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-800">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0B132B] font-heading text-lg font-bold">
                LJ
              </div>
              <span className="font-heading text-2xl font-bold tracking-widest text-[#D4AF37]">
                LJ JEWELRY
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Exquisite handcrafted 18K/22K Gold and 925 Sterling Silver jewelry. Designed for elegance, certified for authenticity, and priced with complete transparency.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-bold text-[#D4AF37] mb-4">
              COLLECTIONS
            </h4>
            <ul className="space-y-2 text-xs font-medium text-neutral-300">
              <li><Link to="/shop?category=Rings" className="hover:text-[#D4AF37]">Solitaire Rings</Link></li>
              <li><Link to="/shop?category=Necklaces" className="hover:text-[#D4AF37]">Gold Necklaces</Link></li>
              <li><Link to="/shop?category=Earrings" className="hover:text-[#D4AF37]">Diamond Earrings</Link></li>
              <li><Link to="/shop?category=Bracelets" className="hover:text-[#D4AF37]">Custom Bracelets</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-heading text-lg font-bold text-[#D4AF37] mb-4">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-2 text-xs font-medium text-neutral-300">
              <li><a href="#size-guide" className="hover:text-[#D4AF37]">Ring Size Guide</a></li>
              <li><a href="#certificate" className="hover:text-[#D4AF37]">Jewelry Certification</a></li>
              <li><a href="#shipping" className="hover:text-[#D4AF37]">Insured Shipping & Returns</a></li>
              <li><a href="#faq" className="hover:text-[#D4AF37]">Frequently Asked Questions</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading text-lg font-bold text-[#D4AF37] mb-4">
              ATELIER NEWSLETTER
            </h4>
            <p className="text-xs text-neutral-400 mb-3">
              Subscribe to receive exclusive invitations to private collection debuts and gold rate insights.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-[#16191E] border border-neutral-700 rounded text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#D4AF37] text-[#0B132B] font-bold text-xs uppercase tracking-wider rounded hover:bg-[#b8960f] transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} LJ Luxury Jewellers. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-neutral-400">Privacy Policy</a>
            <a href="#terms" className="hover:text-neutral-400">Terms of Service</a>
            <a href="#sitemap" className="hover:text-neutral-400">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
