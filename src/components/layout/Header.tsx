import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';

const BroomIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Handle */}
    <line x1="19" y1="2" x2="9" y2="12" />
    {/* Brush head */}
    <path d="M5 12 L9 12 L11 20 L3 20 Z" />
    {/* Bristle lines */}
    <line x1="5" y1="20" x2="4" y2="23" />
    <line x1="7" y1="20" x2="7" y2="23" />
    <line x1="9" y1="20" x2="10" y2="23" />
    {/* Sparkle haut-gauche */}
    <path d="M1,1 L2,3 L4,4 L2,5 L1,7 L0,5 L-2,4 L0,3 Z" strokeWidth="0" fill="currentColor" />
    {/* Sparkle haut-centre */}
    <path d="M12,0 L13,2 L15,3 L13,4 L12,6 L11,4 L9,3 L11,2 Z" strokeWidth="0" fill="currentColor" />
    {/* Sparkle droite-haut */}
    <path d="M21,3 L22,5 L24,6 L22,7 L21,9 L20,7 L18,6 L20,5 Z" strokeWidth="0" fill="currentColor" />
    {/* Sparkle droite-bas */}
    <path d="M21,15 L22,17 L24,18 L22,19 L21,21 L20,19 L18,18 L20,17 Z" strokeWidth="0" fill="currentColor" />
    {/* Sparkle bas-centre */}
    <path d="M14,21 L15,23 L17,24 L15,25 L14,27 L13,25 L11,24 L13,23 Z" strokeWidth="0" fill="currentColor" />
  </svg>
);
import { Button } from '@/components/ui/button';
import { LanguageSelector } from './LanguageSelector';
import { motion, AnimatePresence } from 'framer-motion';

export const Header = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navLinks = [
    { path: '/features', label: t('nav.features') },
    { path: '/pricing', label: t('nav.pricing') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow transition-all duration-300 group-hover:shadow-glow-lg">
                <BroomIcon className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>
            <span className="font-display text-xl font-bold gradient-text">Klea</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path) 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSelector />
            <Link to="/auth">
              <Button variant="ghost" size="sm">
                {t('nav.login')}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-background"
          >
            <nav className="container mx-auto px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 text-sm font-medium ${
                    isActive(link.path) 
                      ? 'text-primary' 
                      : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <LanguageSelector />
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">
                    {t('nav.login')}
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
