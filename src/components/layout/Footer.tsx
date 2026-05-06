import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const BroomIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="2" x2="9" y2="12" />
    <path d="M5 12 L9 12 L11 20 L3 20 Z" />
    <path d="M2,-2 L4,2 L8,4 L4,6 L2,10 L0,6 L-4,4 L0,2 Z" strokeWidth="0" fill="currentColor" />
    <path d="M22,1 L24,5 L28,7 L24,9 L22,13 L20,9 L16,7 L20,5 Z" strokeWidth="0" fill="currentColor" />
    <path d="M21,10 L23,14 L27,16 L23,18 L21,22 L19,18 L15,16 L19,14 Z" strokeWidth="0" fill="currentColor" />
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
