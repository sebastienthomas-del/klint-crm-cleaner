import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MarketingLayout } from '@/components/layout';
import { toast } from 'sonner';

const CONTACT_EMAIL = 'monsieurpipeline@transitionseocrm.fr';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('Message envoyé !', {
      description: 'Nous vous répondrons dans les 24 heures.',
    });
    setIsSubmitting(false);
  };

  return (
    <MarketingLayout>
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="font-display text-4xl lg:text-5xl font-bold mb-4">Contact</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une question, une demande de démo ou un besoin spécifique ?
              Notre équipe vous répond dans les 24 heures.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-5xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-card border border-border rounded-xl p-6 lg:p-8">
                <h2 className="font-display text-xl font-semibold mb-6">
                  Envoyez-nous un message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input id="name" placeholder="Jean Dupont" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="jean@entreprise.com" required />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Entreprise</Label>
                      <Input id="company" placeholder="Mon Entreprise" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="size">Taille de l'équipe</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 personnes</SelectItem>
                          <SelectItem value="11-50">11-50 personnes</SelectItem>
                          <SelectItem value="51-200">51-200 personnes</SelectItem>
                          <SelectItem value="201-1000">201-1000 personnes</SelectItem>
                          <SelectItem value="1000+">1000+ personnes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="crm">CRM utilisé</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner votre CRM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hubspot">HubSpot</SelectItem>
                        <SelectItem value="pipedrive">Pipedrive</SelectItem>
                        <SelectItem value="salesforce">Salesforce</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Décrivez votre besoin..."
                      rows={4}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full gradient-primary shadow-glow hover:shadow-glow-lg gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Envoi en cours...'
                    ) : (
                      <>
                        Envoyer le message
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Contact Info & Demo */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Direct Contact */}
              <div className="bg-accent/50 border border-primary/20 rounded-xl p-6 lg:p-8">
                <h2 className="font-display text-xl font-semibold mb-5">
                  Contactez-nous directement
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="w-5 h-5 text-primary shrink-0" />
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="hover:text-foreground transition-colors break-all"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Linkedin className="w-5 h-5 text-primary shrink-0" />
                    <a
                      href="https://linkedin.com/in/nolwenngrivet"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors"
                    >
                      linkedin.com/in/nolwenngrivet
                    </a>
                  </div>
                </div>
              </div>

              {/* Demo CTA */}
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-6 lg:p-8 text-center">
                <h3 className="font-display text-lg font-semibold mb-2">
                  Envie d'une démo ?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Réservez un créneau de 30 minutes avec notre équipe
                </p>
                <a href={`mailto:${CONTACT_EMAIL}?subject=Demande de démo Kléa`}>
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    Planifier une démo
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Contact;
