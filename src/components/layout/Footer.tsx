import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Linkedin, Twitter, Youtube } from 'lucide-react';

const BroomIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="2" x2="9" y2="12" />
    <path d="M5 12 L9 12 L11 20 L3 20 Z" />
    <line x1="5" y1="20" x2="4" y2="23" />
    <line x1="7" y1="20" x2="7" y2="23" />
    <line x1="9" y1="20" x2="10" y2="23" />
    <path d="M20 8 L20.5 6 L21 8 L23 8.5 L21 9 L20.5 11 L20 9 L18 8.5 Z" strokeWidth="1" fill="currentColor" />
    <path d="M15 3 L15.3 2 L15.6 3 L16.6 3.3 L15.6 3.6 L15.3 4.6 L15 3.6 L14 3.3 Z" strokeWidth="1" fill="currentColor" />
  </svg>
);
import { LanguageSelector } from './LanguageSelector';

export const Footer = () => {
  const { t } = useTranslation();

  const productLinks = [
    { label: t('footer.features'), path: '/features' },
    { label: t('footer.integrations'), path: '/features#integrations' },
    { label: t('footer.changelog'), path: '#' },
  ];

  const resourceLinks = [
    { label: t('footer.documentation'), path: '#' },
    { label: t('footer.guides'), path: '#' },
    { label: t('footer.blog'), path: '#' },
    { label: t('footer.apiDocs'), path: '#' },
  ];

  const companyLinks = [
    { label: t('footer.about'), path: '/about' },
    { label: t('footer.contact'), path: '/contact' },
    { label: t('footer.careers'), path: '#' },
  ];

  const legalLinks = [
    { label: t('footer.terms'), path: '/terms' },
    { label: t('footer.privacy'), path: '/privacy' },
    { label: t('footer.cookies'), path: '/privacy#cookies' },
  ];

  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
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
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="w-5 h-5" />
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

          {/* Resources Column */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4">{t('footer.resources')}</h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
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
