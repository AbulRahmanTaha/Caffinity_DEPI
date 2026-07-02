import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productService, reviewService } from '../services/api';
import { useUser } from '../contexts/UserContext';
import { Review, Product } from '../types';

interface EnrichedReview extends Review {
  productImage?: string;
  productName?: string;
}

const ReviewsPage = () => {
  const { token } = useUser();
  const [reviews, setReviews] = useState<EnrichedReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchReviews = async () => {
      if (!token) return;
      try {
        const [res, productsRes] = await Promise.all([
          reviewService.getAllReviews(token),
          productService.getProducts()
        ]);

        if (res.status === 'success') {
          const productsMap = new Map();
          if (productsRes.data) {
            productsRes.data.forEach((p: Product) => {
              productsMap.set(p._id, { image: p.image, name: p.name });
            });
          }

          const enrichedReviews = res.data.map((r: Review) => {
            const productInfo = productsMap.get(r.product);
            return {
              ...r,
              productImage: productInfo?.image,
              productName: productInfo?.name,
            };
          });

          setReviews(enrichedReviews);
        } else {
          setError('Failed to fetch reviews.');
        }
      } catch (err: any) {
        console.error(err);
        setError('An error occurred while fetching reviews.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [token]);

  // Framer motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-gray-light flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-gray-light flex items-center justify-center">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <>
      <title>Caffinity - All Reviews</title>
      <div className="min-h-screen bg-brand-gray-light py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl text-brand-black mb-4">Customer Reviews</h1>
            <p className="text-brand-black/70 max-w-2xl mx-auto">
              See what our amazing customers are saying about our products and their experience with Caffinity.
            </p>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center text-brand-black/70 py-12 bg-white rounded-xl shadow-sm border border-brand-gray/50">
              <p>No reviews found yet.</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {reviews.map((review) => (
                <motion.div
                  key={review._id}
                  variants={cardVariants}
                  className="bg-white rounded-xl p-6 shadow-sm border border-brand-gray/50 hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-gray rounded-full flex items-center justify-center text-brand-black font-semibold uppercase">
                        {review.user?.firstName?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <p className="font-medium text-brand-black">
                          {review.user ? `${review.user.firstName} ${review.user.lastName}` : 'Anonymous User'}
                        </p>
                        <p className="text-xs text-brand-black/60">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>

                  <p className="text-brand-black/80 text-sm italic leading-relaxed flex-grow">
                    "{review.review}"
                  </p>

                  {review.productImage && (
                    <Link to={`/products/${review.product}`} className="mt-4 pt-4 border-t border-brand-gray/30 flex items-center gap-3 group" viewTransition>
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-brand-gray-light flex-shrink-0">
                        <img
                          src={review.productImage}
                          alt={review.productName || "Product"}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-sm font-medium text-brand-black group-hover:text-brand-black/70 transition-colors">
                        View {review.productName ? 'Product' : 'Details'}
                      </span>
                    </Link>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default ReviewsPage;
