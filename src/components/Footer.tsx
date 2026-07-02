import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';
import { productService } from "../services/api";
import { useEffect, useState } from 'react';
import Loader from './ui/Loader';

const Footer = () => {
  const [categories, setCategories] = useState<string[] | null>(null)

  useEffect(() => {
    const getCategories = async () => {
      try {
        const drinks = await productService.getProducts();
        const data = drinks?.data || [];
        setCategories(Array.from(new Set(data.map((d: any) => d.category))));
      } catch (error) {
        console.error("Error fetching categories for footer:", error);
        setCategories([]);
      }
    }
    getCategories();
  }, [])

  const learn = ["About us", "About our teas", "Tea academy"];
  const customerService = ["Ordering and payment", "Delivery", "Privacy and policy", "Terms & Conditions"];

  return (<footer className="bg-brand-gray-light font-body">
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        <div>
          <h3 className="font-heading text-lg font-semibold uppercase text-brand-black mb-4">Collections</h3>
          <ul className="space-y-2">
            {categories ? categories.map(item => (
              <li key={item}>
                <Link
                  to={`/collections?category=${encodeURIComponent(item)}`}
                  className="text-sm text-brand-black/70 hover:text-brand-black transition-colors"
                  viewTransition
                >
                  {item}
                </Link>
              </li>
            ))
              :
              <Loader />
            }
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-lg font-semibold uppercase text-brand-black mb-4">Learn</h3>
          <ul className="space-y-2">
            {learn.map(item => (
              <li key={item}><Link to="#" className="text-sm text-brand-black/70 hover:text-brand-black transition-colors" viewTransition>{item}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-lg font-semibold uppercase text-brand-black mb-4">Customer Service</h3>
          <ul className="space-y-2">
            {customerService.map(item => (
              <li key={item}><Link to="#" className="text-sm text-brand-black/70 hover:text-brand-black transition-colors" viewTransition>{item}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-lg font-semibold uppercase text-brand-black mb-4">Contact us</h3>
          <ul className="space-y-4 text-sm text-brand-black/70">
            <li className="flex items-start gap-3">
              <MapPin className="h-5 w-5 flex-shrink-0 mt-1" />
              <span>3 Falahi, Falahi St, Pasdaran Ave, Shiraz, Fars Province, Iran</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-5 w-5 flex-shrink-0" />
              <a href="mailto:amoopur@gmail.com" className="hover:text-brand-black transition-colors">amoopur@gmail.com</a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 flex-shrink-0" />
              <a href="tel:+989173038406" className="hover:text-brand-black transition-colors">+98 9173038406</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-12 border-t border-brand-gray pt-8 text-center text-xs text-brand-black/50">
        <p>&copy; {new Date().getFullYear()} Caffinity. All Rights Reserved.</p>
      </div>
    </div>
  </footer>);
};

export default Footer;