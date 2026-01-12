import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { initiatePurchase, verifyPurchase } from '../api/api'; // Import API functions

const VerifyPurchase = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const productId = query.get('product');
  
  const [product, setProduct] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [purchaseId, setPurchaseId] = useState('');
  const [error, setError] = useState('');

  const products = {
    'P001': { 
      name: 'Sony WH-1000XM5', 
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      price: 399,
      description: 'Premium noise-cancelling headphones'
    },
    'P002': { 
      name: 'Apple Watch Ultra', 
      image: 'https://images.unsplash.com/photo-1579586337278-3f4ab5c8d6b9?w=400&h=300&fit=crop',
      price: 799,
      description: 'Premium smartwatch for fitness'
    },
    'P003': { 
      name: 'MacBook Pro M3', 
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
      price: 2499,
      description: 'Professional laptop for creators'
    },
    'P004': { 
      name: 'Samsung S24 Ultra', 
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
      price: 1299,
      description: 'Flagship smartphone with advanced camera'
    }
  };

  useEffect(() => {
    setProduct(products[productId]);
  }, [productId]);

  const handlePurchase = async () => {
    setError('');
    setVerifying(true);
    
    try {
      console.log(`🔄 Initiating purchase for product ${productId}`);
      
      // CALL BACKEND API
      const result = await initiatePurchase(productId);
      
      console.log('✅ Purchase initiated:', result);
      
      if (result.success) {
        setTransactionHash(result.transactionHash);
        setPurchaseId(result.purchaseId);
        
        // Verify purchase after a short delay
        setTimeout(async () => {
          try {
            console.log(`🔄 Verifying purchase ${result.purchaseId}`);
            const verification = await verifyPurchase(result.purchaseId, result.transactionHash);
            
            console.log('✅ Verification result:', verification);
            
            if (verification.verified) {
              setVerified(true);
              // Transaction hash is already stored in state, will be passed via URL
            } else {
              setError('Purchase verification failed');
            }
          } catch (verifyError) {
            console.error('❌ Verification failed:', verifyError);
            setError('Verification failed. Please try again.');
          } finally {
            setVerifying(false);
          }
        }, 2000);
      } else {
        setError('Purchase initiation failed');
        setVerifying(false);
      }
      
    } catch (error) {
      console.error('❌ Purchase failed:', error);
      setError(error.response?.data?.error || 'Purchase failed. Please try again.');
      setVerifying(false);
    }
  };

  const goToReview = () => {
    // Pass both product ID and transaction hash as URL parameters
    navigate(`/review?product=${productId}&tx=${transactionHash}`);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Complete Purchase
          </h1>
          <p className="text-xl text-gray-600">
            Purchase this product to unlock blockchain review capabilities
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-48 h-48 rounded-xl overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h2>
              <div className="mb-6">
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  Product ID: {productId}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-4">
                ${product.price}
              </div>
              <p className="text-gray-600">{product.description}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          {!verified ? (
            <div className="text-center">
              <div className="text-6xl mb-8">🔐</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Complete Purchase
              </h3>
              <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
                Click "Purchase Product" to initiate blockchain verification.
                This will call the backend API to generate a transaction.
              </p>
              
              {transactionHash && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-blue-700 font-semibold">Transaction Generated:</p>
                  <code className="text-sm text-blue-600 break-all block mt-1">
                    {transactionHash.substring(0, 50)}...
                  </code>
                  <p className="text-sm text-blue-500 mt-2">Verifying on blockchain...</p>
                </div>
              )}
              
              <button
                onClick={handlePurchase}
                disabled={verifying}
                className="w-full max-w-md mx-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verifying ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {transactionHash ? 'Verifying Purchase...' : 'Initiating Purchase...'}
                  </span>
                ) : (
                  'Purchase Product'
                )}
              </button>
              
              <p className="text-gray-500 text-sm mt-6">
                Check backend terminal for API call logs
              </p>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-6xl mb-8 text-green-500">✅</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Purchase Successful!
              </h3>
              <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
                Your purchase has been verified on the blockchain.
                You can now submit a verified review.
              </p>
              
              {transactionHash && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl max-w-md mx-auto">
                  <p className="text-green-700 font-semibold">Verified Transaction:</p>
                  <code className="text-sm text-green-600 break-all block mt-1">
                    {transactionHash}
                  </code>
                  <p className="text-sm text-green-500 mt-2">
                    This transaction hash will be passed to the review page
                  </p>
                </div>
              )}

              <button
                onClick={goToReview}
                className="w-full max-w-md mx-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300"
              >
                Submit Your Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyPurchase;