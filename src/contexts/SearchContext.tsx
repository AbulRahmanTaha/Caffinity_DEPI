import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
} from "react";
import { productService } from "../services/api";
import { Product } from "../types";

interface SearchContextType {
  isSearchOpen: boolean;
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  filteredDrinks: Product[];
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    productService
      .getProducts()
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products for search:", err));
  }, []);

  const filteredDrinks = useMemo(() => {
    if (!query) return [];
    return products.filter(
      (drink) =>
        drink.name.toLowerCase().includes(query.toLowerCase()) ||
        drink.description.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, products]);

  return (
    <SearchContext.Provider
      value={{ isSearchOpen, setIsSearchOpen, query, setQuery, filteredDrinks }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context)
    throw new Error("useSearch must be used within a SearchProvider");
  return context;
};
