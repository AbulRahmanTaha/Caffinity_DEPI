import React from 'react';
import { Button } from '../components/ui/Button';

interface PlaceholderPageProps {
  pageName: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ pageName }) => {
  return (
    <div className="container mx-auto px-6 py-20 text-center flex flex-col items-center justify-center min-h-[50vh]">
      <h1 className="font-heading text-4xl mb-4">{pageName}</h1>
      <p className="text-lg text-brand-black/70 mb-8">This page is currently under construction. Please check back later!</p>
      <Button asChild to="/">
        Go to Homepage
      </Button>
    </div>
  );
};

export default PlaceholderPage;
