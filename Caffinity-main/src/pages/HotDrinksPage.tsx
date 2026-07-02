import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { productService } from "../services/api";
import { Product } from "../types";
import Loader from "../components/ui/Loader";

const HotDrinksPage = () => {
  const [hotDrinksProducts, setHotDrinksProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    productService
      .getProducts({ category: "Hot Drinks" })
      .then((res) => {
        setHotDrinksProducts(res.data);
      })
      .catch((err) => console.error("Error fetching hot drinks:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <title>Caffinity - Hot Drinks</title>

      <div className="bg-brand-white mt-[-7rem]">
        <section className="relative h-96 bg-brand-gray-light bg-[url('https://images.unsplash.com/photo-1635956541209-cae00c9481a8?q=80&w=1200&h=600&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center">
          <div className="absolute inset-0 text-brand-black bg-brand-gray/30 text-center flex-col flex items-center justify-center pt-24">
            <h1 className="font-heading text-5xl mb-1">Hot Drinks</h1>
            <p className="mx-3 max-w-2xl lg:mx-auto shadow-brand-gray-dark/70 shadow-md bg-brand-white/80 backdrop-blur-md py-1 px-2 rounded-xl text-sm">
              Savor our exceptional hot drinks. Every sip warms you with comfort
              and flavor.
            </p>
          </div>
        </section>

        <main className="container mx-auto px-6 py-16">
          {loading ? (
            <Loader />
          ) : hotDrinksProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
              {hotDrinksProducts.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-brand-black/70">No Hot Drinks found.</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default HotDrinksPage;
