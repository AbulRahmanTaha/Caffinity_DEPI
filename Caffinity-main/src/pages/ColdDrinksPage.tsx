import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { productService } from "../services/api";
import { Product } from "../types";
import Loader from "../components/ui/Loader";

const ColdDrinksPage = () => {
  const [coldDrinksProducts, setColdDrinksProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    productService
      .getProducts()
      .then((res) => {
        setColdDrinksProducts(
          res.data.filter((drink: Product) => drink.category !== "Hot Drinks")
        );
      })
      .catch((err) => console.error("Error fetching cold drinks:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <title>Caffinity - Cold Drinks</title>

      <div className="bg-brand-white mt-[-7rem]">
        <section className="relative h-96 bg-brand-gray-light bg-[url('https://plus.unsplash.com/premium_photo-1670055280031-764eb9f017b7?w=1200&h=600&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center">
          <div className="absolute inset-0 text-brand-black bg-brand-gray/30 text-center flex-col flex items-center justify-center pt-24">
            <h1 className="font-heading text-5xl mb-1">Cold Drinks</h1>
            <p className="mx-3 max-w-2xl lg:mx-auto shadow-brand-gray-dark/70 shadow-md bg-brand-white/80 backdrop-blur-md py-1 px-2 rounded-xl text-sm">
              Refresh yourself with our selection of cold beverages. Perfect for
              any time.
            </p>
          </div>
        </section>

        <main className="container mx-auto px-6 py-16">
          {loading ? (
            <Loader />
          ) : coldDrinksProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
              {coldDrinksProducts.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-brand-black/70">No Cold Drinks found.</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default ColdDrinksPage;
