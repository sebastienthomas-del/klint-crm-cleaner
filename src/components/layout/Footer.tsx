import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, Linkedin, Twitter, Youtube } from 'lucide-react';
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
    { label: t('footer.terms'), path: '#' },
    { label: t('footer.privacy'), path: '#' },
    { label: t('footer.cookies'), path: '#' },
  ];

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold gradient-text">Kleant</span>
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
