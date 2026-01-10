import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const VerifyPurchase = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const productId = query.get('product');
  
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [step, setStep] = useState(1);

  const products = {
    'P001': { name: 'Sony WH-1000XM5', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&q=80' },
    'P002': { name: 'Apple Watch Ultra', image: 'https://images.unsplash.com/photo-1579586337278-3f4ab5c8d6b9?w=400&h=300&fit=crop&q=80' },
    'P003': { name: 'MacBook Pro M3', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop&q=80' },
    'P004': { name: 'Samsung S24 Ultra', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop&q=80' }
  };

  const verifyPurchase = () => {
    setVerifying(true);
    // Simulate blockchain verification steps
    setTimeout(() => setStep(2), 1000);
    setTimeout(() => setStep(3), 2000);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
      setStep(4);
    }, 3000);
  };

  const goToReview = () => {
    navigate(`/review?product=${productId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Purchase Verification
          </h1>
          <p className="text-xl text-gray-600">
            Verify your purchase on the blockchain to unlock review capabilities
          </p>
        </div>

        {/* Product Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-48 h-48 rounded-xl overflow-hidden">
              <img 
                src={products[productId]?.image} 
                alt={products[productId]?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {products[productId]?.name}
              </h2>
              <div className="mb-6">
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  Product ID: {productId}
                </span>
              </div>
              <p className="text-gray-600 text-lg">
                Complete purchase verification to submit a blockchain-secured review for this product.
              </p>
            </div>
          </div>
        </div>

        {/* Verification Process */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Progress Steps */}
          <div className="relative mb-12">
            <div className="flex justify-between">
              {[1, 2, 3, 4].map((stepNum) => (
                <div key={stepNum} className="flex flex-col items-center relative z-10">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    ${step >= stepNum 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                      : 'bg-gray-100 text-gray-400'
                    }
                    transition-all duration-500
                  `}>
                    {stepNum}
                  </div>
                  <span className="mt-3 font-medium">
                    {stepNum === 1 && 'Initiate'}
                    {stepNum === 2 && 'Processing'}
                    {stepNum === 3 && 'Confirming'}
                    {stepNum === 4 && 'Verified'}
                  </span>
                </div>
              ))}
            </div>
            <div className="absolute top-6 left-12 right-12 h-1 bg-gray-200">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Verification Content */}
          {!verified ? (
            <div className="text-center">
              <div className="text-6xl mb-8">🔐</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Verify Purchase on Blockchain
              </h3>
              <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
                This will record your purchase transaction on the blockchain network,
                enabling you to submit a permanent, tamper-proof review.
              </p>
              
              <button
                onClick={verifyPurchase}
                disabled={verifying}
                className="w-full max-w-md mx-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verifying ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {step === 1 && 'Initializing Verification...'}
                    {step === 2 && 'Processing Transaction...'}
                    {step === 3 && 'Confirming on Blockchain...'}
                  </span>
                ) : (
                  'Start Blockchain Verification'
                )}
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-6xl mb-8 text-green-500">✅</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Purchase Verified Successfully!
              </h3>
              <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
                Your purchase has been permanently recorded on the blockchain.
                You can now submit a review that will be stored securely forever.
              </p>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl mb-10 max-w-md mx-auto">
                <p className="text-gray-800 font-semibold">Transaction Hash:</p>
                <code className="text-sm text-gray-600 break-all">
                  0x{Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}
                </code>
              </div>

              <button
                onClick={goToReview}
                className="w-full max-w-md mx-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300"
              >
                Submit Your Review Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyPurchase;