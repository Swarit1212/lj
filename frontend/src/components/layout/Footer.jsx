import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-[#050B1A] text-white pt-16 pb-8 border-t border-gold-500/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-900/60">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#050B1A] to-[#121E3D] border border-gold-500/40 flex items-center justify-center text-gold-500 font-heading text-lg font-bold">
                LJ
              </div>
              <span className="font-heading text-xl font-bold tracking-widest text-gold-500">
                LJ JEWELRY
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
              Exquisite handcrafted 18K/22K Gold and 925 Sterling Silver jewelry. Designed for elegance, certified for authenticity, and priced with complete transparency.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-sm font-bold tracking-widest text-gold-500 mb-5 uppercase">
              COLLECTIONS
            </h4>
            <ul className="space-y-3 text-[11px] text-neutral-300 font-sans tracking-wide">
              <li><Link to="/shop?category=Rings" className="hover:text-gold-500 transition-colors">Solitaire Rings</Link></li>
              <li><Link to="/shop?category=Necklaces" className="hover:text-gold-500 transition-colors">Gold Necklaces</Link></li>
              <li><Link to="/shop?category=Earrings" className="hover:text-gold-500 transition-colors">Diamond Earrings</Link></li>
              <li><Link to="/shop?category=Bracelets" className="hover:text-gold-500 transition-colors">Custom Bracelets</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-heading text-sm font-bold tracking-widest text-gold-500 mb-5 uppercase">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-3 text-[11px] text-neutral-300 font-sans tracking-wide">
              <li><a href="#size-guide" className="hover:text-gold-500 transition-colors">Ring Size Guide</a></li>
              <li><a href="#certificate" className="hover:text-gold-500 transition-colors">Jewelry Certification</a></li>
              <li><a href="#shipping" className="hover:text-gold-500 transition-colors">Insured Shipping & Returns</a></li>
              <li><a href="#faq" className="hover:text-gold-500 transition-colors">Frequently Asked Questions</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading text-sm font-bold tracking-widest text-gold-500 mb-5 uppercase">
              ATELIER NEWSLETTER
            </h4>
            <p className="text-[11px] text-neutral-400 mb-4 leading-relaxed font-sans">
              Subscribe to receive exclusive invitations to private collection debuts and gold rate insights.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-[#0C1222] border border-gold-500/20 rounded-lg text-[11px] text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/20"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-royal-navy font-bold text-[10px] uppercase tracking-wider rounded-lg hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-neutral-500 gap-4">
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
