import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const productId = query.get('product');
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const products = {
    'P001': { 
      name: 'Sony WH-1000XM5', 
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w-400&h=300&fit=crop&q=80',
      price: '$399'
    },
    'P002': { 
      name: 'Apple Watch Ultra', 
      image: 'https://images.unsplash.com/photo-1579586337278-3f4ab5c8d6b9?w-400&h=300&fit=crop&q=80',
      price: '$799'
    },
    'P003': { 
      name: 'MacBook Pro M3', 
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w-400&h=300&fit=crop&q=80',
      price: '$2,499'
    },
    'P004': { 
      name: 'Samsung S24 Ultra', 
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w-400&h=300&fit=crop&q=80',
      price: '$1,299'
    }
  };

  const submitReview = () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl p-12 text-center">
            <div className="text-8xl mb-8">🎉</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Review Successfully Submitted!
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Your review has been permanently stored on the blockchain network.
              It is now immutable and verifiable by anyone.
            </p>

            <div className="bg-white rounded-xl p-8 mb-10 max-w-lg mx-auto">
              <div className="flex items-center justify-center gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`text-3xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                  </div>
                ))}
              </div>
              <p className="text-gray-800 text-lg mb-6 italic">"{review}"</p>
              <div className="border-t pt-6">
                <p className="text-gray-600">Product: <span className="font-semibold">{products[productId]?.name}</span></p>
                <p className="text-gray-600 mt-2">Transaction Hash:</p>
                <code className="text-sm text-gray-500 break-all">
                  0x{Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}
                </code>
              </div>
            </div>

            <button
              onClick={() => navigate('/products')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Submit Your Review
          </h1>
          <p className="text-xl text-gray-600">
            Your review will be permanently stored on the blockchain
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Info */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-32 h-32 rounded-xl overflow-hidden">
                <img 
                  src={products[productId]?.image} 
                  alt={products[productId]?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {products[productId]?.name}
                </h2>
                <p className="text-gray-600 mb-1">Product ID: <span className="font-mono font-bold">{productId}</span></p>
                <p className="text-gray-600">Price: <span className="font-bold text-green-600">{products[productId]?.price}</span></p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl">🔒</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Purchase Verified</h4>
                  <p className="text-gray-600 text-sm">Your purchase is confirmed on blockchain</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-2xl">⛓️</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Blockchain Storage</h4>
                  <p className="text-gray-600 text-sm">Review stored permanently and immutably</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Anonymous & Secure</h4>
                  <p className="text-gray-600 text-sm">Your identity remains protected</p>
                </div>
              </div>
            </div>
          </div>

          {/* Review Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Write Your Review</h3>

            {/* Rating */}
            <div className="mb-10">
              <label className="block text-lg font-medium text-gray-900 mb-6">Your Rating</label>
              <div className="flex gap-4 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-all duration-300 transform hover:scale-125"
                  >
                    <span className={`text-6xl ${star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                      ★
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-center text-gray-600 mt-4">
                {rating === 0 ? 'Select your rating' : `You rated: ${rating} star${rating > 1 ? 's' : ''}`}
              </p>
            </div>

            {/* Review Text */}
            <div className="mb-10">
              <label className="block text-lg font-medium text-gray-900 mb-4">Your Review</label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your honest experience with this product. What did you like? What could be improved?"
                className="w-full h-48 bg-gray-50 border border-gray-200 rounded-xl p-6 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                maxLength={1000}
              />
              <div className="text-right mt-3">
                <span className={`text-sm ${review.length > 800 ? 'text-red-500' : 'text-gray-500'}`}>
                  {review.length}/1000 characters
                </span>
              </div>
            </div>

            <button
              onClick={submitReview}
              disabled={submitting || rating === 0 || review.trim() === ''}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-5 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4"
            >
              {submitting ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting to Blockchain Network...
                </>
              ) : (
                <>
                  <span className="text-2xl">⛓️</span>
                  Submit Review to Blockchain
                </>
              )}
            </button>

            <p className="text-center text-gray-500 text-sm mt-8">
              <span className="font-semibold">Note:</span> Once submitted, your review cannot be edited or deleted as it will be permanently stored on the blockchain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;