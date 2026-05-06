import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const BroomIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="2" x2="9" y2="12" />
    <path d="M5 12 L9 12 L11 20 L3 20 Z" />
    <path d="M5,0 L7,2 L9,4 L7,6 L5,8 L3,6 L1,4 L3,2 Z" strokeWidth="0" fill="currentColor" />
    <path d="M20,3 L22,5 L24,7 L22,9 L20,11 L18,9 L16,7 L18,5 Z" strokeWidth="0" fill="currentColor" />
    <path d="M20,12 L22,14 L24,16 L22,18 L20,20 L18,18 L16,16 L18,14 Z" strokeWidth="0" fill="currentColor" />
  </svg>
);
import { LanguageSelector } from './LanguageSelector';

export const Footer = () => {
  const { t } = useTranslation();

  const productLinks = [
    { label: t('footer.features'), path: '/features' },
    { label: t('nav.pricing'), path: '/pricing' },
    { label: t('footer.changelog'), path: '/changelog' },
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
