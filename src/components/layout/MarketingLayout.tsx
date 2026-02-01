import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface MarketingLayoutProps {
  children: ReactNode;
}

export const MarketingLayout = ({ children }: MarketingLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16 lg:pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};
