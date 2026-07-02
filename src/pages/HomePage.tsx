import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Coffee, Award, Truck, Tag, Star, } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useState } from "react";
import { productService } from "../services/api";
import { Product } from "../types";
import Loader from "../components/ui/Loader";

const features = [
  { icon: Coffee, text: "WIDE SELECTION" },
  { icon: Award, text: "TOP QUALITY PRODUCTS" },
  { icon: Truck, text: "FREE DELIVERY" },
  { icon: Tag, text: "GREAT DEALS" },
];

const categories = [
  {
    id: 1,
    name: "Hot Drinks",
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    name: "Cold Drinks",
    image:
      "https://plus.unsplash.com/premium_photo-1677607237294-b041e4b57391?w=400&h=400&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    name: "Fresh Juices",
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop",
  },
  {
    id: 4,
    name: "Smoothies",
    image:
      "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=400&fit=crop",
  },
  {
    id: 5,
    name: "Milkshakes",
    image:
      "https://images.unsplash.com/photo-1641665271888-575e46923776?w=400&h=400&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 6,
    name: "Specialty Drinks",
    image:
      "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=400&fit=crop",
  },
  {
    id: 7,
    name: "Energy Drinks",
    image:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop",
  },
];

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);


  const [drinks, setDrinks] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService
      .getProducts()
      .then((res) => {
        setDrinks(res.data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <title>Caffinity</title>

      <div className="bg-brand-white">
        {/* Hero Section */}
        <section className="relative container mx-auto mt-3 flex flex-col lg:flex-row items-center justify-center lg:justify-start py-20 lg:py-0 lg:h-[calc(100vh-6rem)]">
          <div className="lg:w-1/2 text-center lg:text-left z-10 p-8">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-brand-black mb-6">
              Taste the perfect moment.
            </h1>
            <p className="text-brand-black/80 mb-8 max-w-md mx-auto lg:mx-0">
              Your daily dose of delicious. Order your finest drink,
              delivered right to your door.
            </p>
            <Button className="cursor-pointer" asChild onClick={() => navigate("/collections", { viewTransition: true })}>Browse Collections</Button>
          </div>
          <div className="lg:absolute lg:right-0 lg:top-0 lg:w-1/2 lg:h-full w-full mt-8 lg:mt-0 px-4 h-auto">
            <img
              src="/assets/img/drinks-photo.webp"
              alt="Featured products"
              className="w-full lg:h-[80vh] object-cover rounded-3xl"
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-brand-gray-light py-12">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-center gap-4 justify-center"
                >
                  <feature.icon className="h-8 w-8 text-brand-black" />
                  <p className="font-semibold text-sm uppercase tracking-wider">
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Collections Section */}
        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="font-heading text-4xl mb-12">Our Collections</h2>
            <div className="flex items-center justify-center flex-wrap gap-x-[5vw] gap-y-12">
              {categories.map((cat) => (
                <Link
                  to={`/collections?category=${cat.name}`}
                  key={cat.id}
                  className="group"
                >
                  <div className="bg-brand-gray-light aspect-square overflow-hidden rounded-full max-w-48">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="mt-4 font-semibold tracking-wider capitalize">
                    {cat.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Most Popular Section */}
        <section className="bg-brand-gray-light py-20">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center gap-3 mb-12">
              <Star className="h-8 w-8 text-brand-black" fill="currentColor" />
              <h2 className="font-heading text-4xl text-center">Most Popular</h2>
              <Star className="h-8 w-8 text-brand-black" fill="currentColor" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
              {loading ? (
                <Loader />
              ) : (
                drinks.slice(0, 10).map((drink, index) => (
                  <ProductCard product={drink} key={drink._id} index={index} />
                ))
              )}
            </div>
            <div className="text-center mt-12">
              <Button asChild to="/collections">
                View All Products
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
