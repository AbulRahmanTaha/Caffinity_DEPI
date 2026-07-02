import React from 'react';
import { Button } from '../components/ui/Button';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Accordion, AccordionItem } from '../components/ui/Accordion';
import toast from 'react-hot-toast';

const InputField = ({ label, name, type = 'text', placeholder, required = false }: { label: string, name: string, type?: string, placeholder: string, required?: boolean }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-brand-black mb-1">{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 border border-brand-gray rounded-md focus:ring-brand-black focus:border-brand-black transition"
    />
  </div>
);

const TextareaField = ({ label, name, placeholder, required = false }: { label: string, name: string, placeholder: string, required?: boolean }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-brand-black mb-1">{label}</label>
    <textarea
      id={name}
      name={name}
      rows={5}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 border border-brand-gray rounded-md focus:ring-brand-black focus:border-brand-black transition"
    />
  </div>
);

const faqItems = [
  {
    title: "What are the shipping times?",
    content: "Standard shipping takes 3-5 business days within the country. International shipping times may vary depending on the destination."
  },
  {
    title: "How can I track my order?",
    content: "Once your order is shipped, you will receive an email with a tracking number and a link to the carrier's website where you can track your package."
  },
  {
    title: "What is your return policy?",
    content: "We accept returns within 30 days of purchase for a full refund. The item must be unused and in its original packaging. Please contact our customer service to initiate a return."
  },
  {
    title: "Do you offer wholesale pricing?",
    content: "Yes, we do! Please visit our 'For Wholesalers' section or contact us directly through the form on this page with your business details for more information."
  }
];

const ContactPage = () => {
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    e.currentTarget.reset();
  };

  return (
    <>
      <title>Caffinity - Contacts</title>

      <div className="bg-brand-white">
        <section className="bg-brand-gray-light text-center py-20">
          <div className="container mx-auto px-6">
            <h1 className="font-heading text-5xl mb-4">Contact Us</h1>
            <p className="text-lg text-brand-black/70 max-w-2xl mx-auto">
              Have a question or want to work with us? We'd love to hear from you.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <div className="bg-brand-gray-light p-8 md:p-12 rounded-lg">
              <h2 className="font-heading text-3xl mb-6">Send us a Message</h2>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <InputField label="Full Name" name="name" placeholder="John Doe" required />
                <InputField label="Email Address" name="email" type="email" placeholder="you@example.com" required />
                <InputField label="Subject" name="subject" placeholder="Question about an order" />
                <TextareaField label="Your Message" name="message" placeholder="Type your message here..." required />
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8 mt-8 lg:mt-0">
              <div>
                <h2 className="font-heading text-3xl mb-6">Contact Information</h2>
                <div className="space-y-4 text-brand-black/80">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-brand-black flex-shrink-0 mt-1" />
                    <span>3 Falahi, Falahi St, Pasdaran Ave, Shiraz, Fars Province, Iran</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="h-6 w-6 text-brand-black flex-shrink-0" />
                    <a href="mailto:support@caffinity.com" className="hover:text-brand-yellow transition-colors">support@caffinity.com</a>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="h-6 w-6 text-brand-black flex-shrink-0" />
                    <a href="tel:+989173038406" className="hover:text-brand-yellow transition-colors">+98 9173038406</a>
                  </div>
                </div>
              </div>
              <div className="h-64 bg-brand-gray rounded-lg overflow-hidden">
                <img src="https://cafemystiquecoffeeshop.com/wp-content/uploads/2019/07/Contact-us-banner.jpg" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-16">
          <h2 className="font-heading text-4xl text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto">
            <Accordion>
              {faqItems.map((item, index) => (
                <AccordionItem key={index} title={item.title}>
                  <p>{item.content}</p>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactPage;
