import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { ChevronDown, Plus, Minus } from "lucide-react";
import { productService } from "../services/api";
import { Product } from "../types";
import Loader from "../components/ui/Loader";

// Filter components
const FilterSection = ({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-brand-gray-dark/50 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center"
      >
        <h3 className="font-semibold uppercase tracking-wider">{title}</h3>
        {isOpen ? <Minus size={20} /> : <Plus size={20} />}
      </button>
      {isOpen && <div className="mt-4 space-y-2">{children}</div>}
    </div>
  );
};

const FilterCheckbox = ({
  label,
  isChecked,
  onChange,
}: {
  label: string;
  isChecked: boolean;
  onChange: (label: string) => void;
}) => (
  <label className="flex items-center gap-3 cursor-pointer capitalize">
    <input
      type="checkbox"
      className="h-4 w-4 rounded border-brand-black text-brand-black focus:ring-brand-black"
      checked={isChecked}
      onChange={() => onChange(label)}
    />
    <span className="text-sm">{label}</span>
  </label>
);

const CollectionsPage = () => {
  const location = useLocation();
  const [drinks, setDrinks] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    productService
      .getProducts()
      .then((res) => setDrinks(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getInitialCategory = () => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    return category ? [category] : [];
  };

  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(getInitialCategory);
  const [selectedCollection, setSelectedCollection] = useState<string>("Collections");
  const [sortOption, setSortOption] = useState<string>("default");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    setSelectedCategories(getInitialCategory());
  }, [location.search]);

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleCollectionChange = (collection: string) => {
    setSelectedCollection(collection);
    if (collection === "Collections") {
      setSelectedCategories([]);
    } else if (collection === "Hot Drinks") {
      setSelectedCategories(["Hot Drinks"]);
    } else if (collection === "Cold Drinks") {
      setSelectedCategories(["Cold Drinks"]);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedCollection("Collections");
    setPriceRange([0, 1000]);
    setShowAvailableOnly(false);
    setMinRating(0);
    setSortOption("default");
  };

  const categories = Array.from(new Set(drinks.map((d) => d.category)));

  const displayedProducts = useMemo(() => {
    let filtered = drinks;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) => selectedCategories.includes(p.category));
    }

    // Filter by price range
    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Filter by availability
    if (showAvailableOnly) {
      filtered = filtered.filter((p) => p.isAvailable);
    }

    // Filter by minimum rating
    if (minRating > 0) {
      filtered = filtered.filter((p) => (p.ratingsAverage || 0) >= minRating);
    }

    const sorted = [...filtered];
    switch (sortOption) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "title-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "title-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return sorted;
  }, [drinks, selectedCategories, sortOption, priceRange, showAvailableOnly, minRating]);

  return (
    <>
      <title>Caffinity - Collections</title>

      <div className="mt-[-7rem]">
        <section className="relative h-96 bg-brand-gray-light">
          <img
            src={"/assets/img/collection-background.webp"}
            alt="Collections"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center pt-24">
            <h1 className="font-heading text-5xl text-brand-white text-center">
              Our Drinks
            </h1>
          </div>
        </section>

        <div className="container mx-auto px-6 py-12">
          <p className="text-sm uppercase tracking-wider text-brand-black/70 mb-8">
            Home / Collections
          </p>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Filters */}
            <aside className="lg:w-1/4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg uppercase tracking-wider">Filters</h2>
                <button
                  onClick={handleResetFilters}
                  className="text-sm text-brand-black/60 hover:text-brand-black underline"
                >
                  Reset All
                </button>
              </div>

              <FilterSection title="Collections" defaultOpen={true}>
                {["Collections", "Hot Drinks", "Cold Drinks"].map((collection) => (
                  <label key={collection} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="collection"
                      className="h-4 w-4 border-brand-black text-brand-black focus:ring-brand-black"
                      checked={selectedCollection === collection}
                      onChange={() => handleCollectionChange(collection)}
                    />
                    <span className="text-sm">{collection}</span>
                  </label>
                ))}
              </FilterSection>

              <FilterSection title="Categories" defaultOpen={true}>
                {categories.map((cat) => (
                  <FilterCheckbox
                    key={cat}
                    label={cat}
                    isChecked={selectedCategories.includes(cat)}
                    onChange={handleCategoryChange}
                  />
                ))}
              </FilterSection>

              <FilterSection title="Price Range" defaultOpen={true}>
                <div className="space-y-4">
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full px-3 py-2 border border-brand-gray-dark rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-black"
                      placeholder="Min"
                    />
                    <span className="text-brand-black/60">-</span>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full px-3 py-2 border border-brand-gray-dark rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-black"
                      placeholder="Max"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-brand-black"
                  />
                </div>
              </FilterSection>

              <FilterSection title="Availability" defaultOpen={true}>
                <FilterCheckbox
                  label="Available Only"
                  isChecked={showAvailableOnly}
                  onChange={() => setShowAvailableOnly(!showAvailableOnly)}
                />
              </FilterSection>

              <FilterSection title="Rating" defaultOpen={true}>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        className="h-4 w-4 border-brand-black text-brand-black focus:ring-brand-black"
                        checked={minRating === rating}
                        onChange={() => setMinRating(rating)}
                      />
                      <span className="text-sm flex items-center gap-1">
                        {rating}+ ⭐
                      </span>
                    </label>
                  ))}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      className="h-4 w-4 border-brand-black text-brand-black focus:ring-brand-black"
                      checked={minRating === 0}
                      onChange={() => setMinRating(0)}
                    />
                    <span className="text-sm">All Ratings</span>
                  </label>
                </div>
              </FilterSection>
            </aside>

            {/* Products Grid */}
            <main className="lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-brand-black/70">
                  {displayedProducts.length} drinks
                </p>
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="appearance-none bg-transparent border border-brand-gray-dark rounded-md py-2 pl-3 pr-8 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-brand-black"
                  >
                    <option value="default">Sort By</option>
                    <option value="title-asc">Name: A-Z</option>
                    <option value="title-desc">Name: Z-A</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                  <ChevronDown className="h-5 w-5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {loading ? (
                <Loader />
              ) : displayedProducts.length === 0 ? (
                <div className="text-center py-20 col-span-full">
                  <p className="text-lg text-brand-black/70">
                    No drinks match your current selection.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
                  {displayedProducts.map((product, index) => (
                    <ProductCard key={product._id} product={product} index={index} />
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default CollectionsPage;