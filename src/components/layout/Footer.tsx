import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Linkedin } from 'lucide-react';

const BroomIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="2" x2="9" y2="12" />
    <path d="M5 12 L9 12 L11 20 L3 20 Z" />
    <line x1="5" y1="20" x2="4" y2="23" />
    <line x1="7" y1="20" x2="7" y2="23" />
    <line x1="9" y1="20" x2="10" y2="23" />
    <path d="M2,0.5 L2.5,1.5 L3.5,2 L2.5,2.5 L2,3.5 L1.5,2.5 L0.5,2 L1.5,1.5 Z" strokeWidth="0.5" fill="currentColor" />
    <path d="M13,1.5 L13.5,2.5 L14.5,3 L13.5,3.5 L13,4.5 L12.5,3.5 L11.5,3 L12.5,2.5 Z" strokeWidth="0.5" fill="currentColor" />
    <path d="M22,4.5 L22.5,5.5 L23.5,6 L22.5,6.5 L22,7.5 L21.5,6.5 L20.5,6 L21.5,5.5 Z" strokeWidth="0.5" fill="currentColor" />
    <path d="M2,8.5 L2.5,9.5 L3.5,10 L2.5,10.5 L2,11.5 L1.5,10.5 L0.5,10 L1.5,9.5 Z" strokeWidth="0.5" fill="currentColor" />
    <path d="M22,15.5 L22.5,16.5 L23.5,17 L22.5,17.5 L22,18.5 L21.5,17.5 L20.5,17 L21.5,16.5 Z" strokeWidth="0.5" fill="currentColor" />
    <path d="M15,20.5 L15.5,21.5 L16.5,22 L15.5,22.5 L15,23.5 L14.5,22.5 L13.5,22 L14.5,21.5 Z" strokeWidth="0.5" fill="currentColor" />
  </svg>
);
import { LanguageSelector } from './LanguageSelector';

export const Footer = () => {
  const { t } = useTranslation();

  const productLinks = [
    { label: t('footer.features'), path: '/features' },
    { label: t('nav.pricing'), path: '/pricing' },
  ];

  const companyLinks = [
    { label: t('footer.about'), path: '/about' },
    { label: t('footer.contact'), path: '/contact' },
  ];

  const legalLinks = [
    { label: t('footer.terms'), path: '/terms' },
    { label: t('footer.privacy'), path: '/privacy' },
  ];

  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <BroomIcon className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold gradient-text">Klea</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-4 mb-6">
              <a href="https://linkedin.com/company/klea-crm" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <LanguageSelector />
          </div>

          {/* Product Column */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4">{t('footer.product')}</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4">{t('footer.company')}</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};
