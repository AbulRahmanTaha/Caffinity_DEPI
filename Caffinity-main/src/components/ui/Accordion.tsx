import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
}

export const Accordion: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
  return <div className={`border-t border-brand-gray ${className}`}>{children}</div>;
};

export const AccordionItem: React.FC<AccordionItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-brand-gray">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-5 text-left"
      >
        <h3 className="font-semibold text-lg">{title}</h3>
        {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-brand-black/70">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
