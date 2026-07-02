import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Plus, Minus, ShoppingBag, Star, X } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";
import { productService, reviewService } from "../services/api";
import { Product, Review } from "../types";
import Loader from "../components/ui/Loader";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { token, isAuthenticated } = useUser();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchReviewsData = () => {
    if (token && id && isAuthenticated) {
      setReviewsLoading(true);
      reviewService.getProductReviews(id, token)
        .then((revRes) => {
          if (revRes.status === 'success') {
            setReviews(revRes.data);
          }
        })
        .catch((err) => console.error("Error fetching reviews:", err))
        .finally(() => setReviewsLoading(false));
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (id) {
      setLoading(true);
      productService
        .getProductById(id)
        .then((res) => {
          const fetchedProduct = res.data;
          setProduct(fetchedProduct);
          productService
            .getProducts({ category: fetchedProduct.category as string })
            .then((catRes) => {
              setRelatedProducts(
                catRes.data.filter((p: Product) => p._id !== id).slice(0, 4)
              );
            })
            .finally(() => setLoading(false));

          // Auth check before fetching reviews
          fetchReviewsData();
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id, token, isAuthenticated]);

  if (loading)
    return (
      <div className="container mx-auto py-40">
        <Loader />
      </div>
    );

  if (!product)
    return (
      <div className="container mx-auto text-center py-40 text-red-500">
        Product not found.
      </div>
    );



  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const submitReviewAction = async () => {
    setIsSubmittingReview(true);
    try {
      if (!id || !token) throw new Error("Missing data to sumbit review");
      const res = await reviewService.addReview(id, token, { review: newReviewText, rating: newReviewRating });
      if (res.status !== "success" && res.status !== 201 && res.status !== "fail" && !res.data) {
        throw new Error("Failed to post review");
      }
      setNewReviewText("");
      setNewReviewRating(5);
      fetchReviewsData();
      setIsReviewModalOpen(false);
      return res;
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    toast.promise(submitReviewAction(), {
      loading: 'Posting review...',
      success: 'Review posted successfully!',
      error: (err: any) => err.response?.data?.message || 'Failed to post review.'
    });
  };

  const ratingCheck = (bg = false): string => {
    const rating = product.ratingsAverage || 0;

    if (rating >= 4) {
      return bg ? "bg-brand-green/10" : "text-brand-green";
    } else if (rating >= 3) {
      return bg ? "bg-brand-yellow/10" : "text-brand-yellow";
    } else {
      return bg ? "bg-brand-red/10" : "text-brand-red";
    }
  };

  return (
    <>
      <title>Caffinity - {product.name}</title>

      <div className="container mx-auto px-6 py-12">
        <p className="text-sm uppercase tracking-wider text-brand-black/70 mb-8">
          <Link to="/" className="hover:text-brand-black" viewTransition>
            Home
          </Link>{" "}
          /
          <Link to="/collections" className="hover:text-brand-black" viewTransition>
            {" "}
            Collections
          </Link>{" "}
          /<span className="capitalize"> {product.name}</span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-20">
          <div className="bg-brand-gray-light p-3 max-w-[65vh] mx-auto lg:mx-2 rounded-3xl">
            <img
              src={product.image || ""}
              alt={product.name}
              className="w-full h-full object-cover aspect-square rounded-xl"
            />
          </div>

          <div className="flex flex-col">
            <span className="text-sm uppercase tracking-wider text-brand-black/60 mb-2">
              {product.category}
            </span>
            <h1 className="font-heading text-4xl mb-4">{product.name}</h1>
            <p className="text-brand-black/70 mb-4">{product.description}</p>
            <p className="font-heading text-4xl mb-6">
              {product.currency} {product.price.toFixed(2)}
            </p>

            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center border border-brand-black rounded-xl">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3"
                >
                  <Minus size={20} />
                </button>
                <span className="px-6 text-lg font-semibold">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="p-3">
                  <Plus size={20} />
                </button>
              </div>
              <Button onClick={handleAddToCart} className="flex-grow rounded-xl" title="Add to Bag">
                <img src="/assets/svg/add-to-shopping-bag.svg" className="sm:hidden w-6 aspect-square invert" /><ShoppingBag size={20} className="hidden sm:inline mr-2" /> <span className="hidden sm:inline">Add to Bag</span>
              </Button>
            </div>
            <div className="flex flex-row items-center gap-2">
              <span>Rating: </span>
              <div
                className={`w-fit py-[0.125rem] px-2 mt-1 rounded-lg flex items-center gap-1 ${ratingCheck(
                  true
                )}`}
              >
                <small className="font-bold">{product.ratingsAverage}</small>
                <small className={ratingCheck()}>★</small>
              </div></div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="py-12 border-t border-brand-gray">
          <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
              <h2 className="font-heading text-3xl mb-4 sm:mb-0">Customer Reviews</h2>
              {isAuthenticated && (
                <Button onClick={() => setIsReviewModalOpen(true)}>Write a Review</Button>
              )}
            </div>

            {!isAuthenticated ? (
              <div className="bg-brand-gray-light rounded-2xl p-8 text-center border border-brand-gray">
                <p className="text-brand-black/70 mb-4">Please log in to view the reviews for this product.</p>
                <Link to="/login">
                  <Button variant="outline">Log In</Button>
                </Link>
              </div>
            ) : reviewsLoading ? (
              <div className="py-12 flex justify-center">
                <div className="w-8 h-8 border-4 border-brand-black border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-brand-gray-light rounded-2xl p-8 text-center border border-brand-gray mb-8">
                <p className="text-brand-black/70">No reviews yet for this product. Be the first to try it!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {reviews.map((review) => (
                  <div key={review._id} className="bg-white rounded-xl p-6 shadow-sm border border-brand-gray/50 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-brand-gray rounded-full flex items-center justify-center text-brand-black font-semibold uppercase">
                        {review.user?.firstName?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <p className="font-medium text-brand-black">
                          {review.user ? `${review.user.firstName} ${review.user.lastName}` : 'Anonymous User'}
                        </p>
                        <p className="text-xs text-brand-black/60">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <p className="text-brand-black/80 text-sm italic leading-relaxed">
                      "{review.review}"
                    </p>
                  </div>
                ))}
              </div>
            )}

            <AnimatePresence>
              {isReviewModalOpen && isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-black/50 backdrop-blur-sm"
                  onClick={() => !isSubmittingReview && setIsReviewModalOpen(false)}
                >
                  <motion.div
                    onClick={(e) => e.stopPropagation()}
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md relative shadow-xl"
                  >
                    <button
                      onClick={() => !isSubmittingReview && setIsReviewModalOpen(false)}
                      className="absolute top-4 right-4 p-2 text-brand-black/60 hover:text-brand-black transition-colors"
                    >
                      <X size={24} />
                    </button>
                    <h3 className="font-heading text-2xl mb-6">Write a Review</h3>
                    <form onSubmit={handleReviewSubmit} className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-brand-black mb-3">Rating</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewReviewRating(star)}
                              className="focus:outline-none hover:scale-110 transition-transform"
                              disabled={isSubmittingReview}
                            >
                              <Star
                                className={`w-8 h-8 ${star <= newReviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="review" className="block text-sm font-medium text-brand-black mb-2">Your Review</label>
                        <textarea
                          id="review"
                          rows={5}
                          value={newReviewText}
                          onChange={(e) => setNewReviewText(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-black focus:border-transparent transition-all outline-none resize-none"
                          placeholder="Share your experience with this product..."
                          required
                          disabled={isSubmittingReview}
                        ></textarea>
                      </div>
                      <Button
                        type="submit"
                        className="w-full py-4 text-base"
                        disabled={!newReviewText.trim() || isSubmittingReview}
                      >
                        {isSubmittingReview ? "Submitting..." : "Submit Review"}
                      </Button>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="py-20 border-t border-brand-gray">
            <div className="container mx-auto px-6 text-center">
              <h2 className="font-heading text-4xl mb-12">You may also like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
                {relatedProducts.map((p, index) => (
                  <ProductCard key={p._id} product={p} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default ProductDetailPage;
