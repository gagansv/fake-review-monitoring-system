import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../api/api'; // Import the API function

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching products from backend...");
      const data = await getProducts(); // CALL BACKEND API
      console.log("✅ Products received:", data.length, "products");
      setProducts(data);
      setError(null);
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      setError('Backend not responding. Using demo products.');
      // Fallback to hardcoded products if API fails
      setProducts([
        { 
          productId: "P001", 
          name: "Sony WH-1000XM5", 
          price: 399, 
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop&q=80",
          category: "Premium Audio",
          description: "Premium noise-cancelling headphones",
          rating: 4.8
        },
        { 
          productId: "P002", 
          name: "Apple Watch Ultra", 
          price: 799, 
          image: "https://images.unsplash.com/photo-1579586337278-3f4ab5c8d6b9?w=600&h=400&fit=crop&q=80",
          category: "Smart Wearables",
          description: "Premium smartwatch for fitness",
          rating: 4.9
        },
        { 
          productId: "P003", 
          name: "MacBook Pro M3", 
          price: 2499, 
          image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop&q=80",
          category: "Pro Laptops",
          description: "Professional laptop for creators",
          rating: 4.7
        },
        { 
          productId: "P004", 
          name: "Samsung S24 Ultra", 
          price: 1299, 
          image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop&q=80",
          category: "Flagship Phone",
          description: "Flagship smartphone with advanced camera",
          rating: 4.6
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleBuy = (productId) => {
    navigate(`/verify?product=${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Premium Collection
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            Shop with confidence. Every purchase unlocks blockchain-verified review capabilities.
          </p>
          {error && (
            <div className="mt-6 bg-yellow-500/20 backdrop-blur-sm p-4 rounded-xl max-w-2xl mx-auto">
              <p className="text-yellow-200">⚠️ {error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <div key={product.productId || product._id} className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ${product.price}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                      {product.category || "Electronics"}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mt-1 mb-2">
                      {product.name}
                    </h3>
                  </div>
                </div>
                
                <div className="mb-4">
                  <span className="text-sm text-gray-500">Product ID:</span>
                  <p className="font-mono text-gray-800 font-semibold">{product.productId || product._id}</p>
                  {product.description && (
                    <p className="text-gray-600 text-sm mt-2">{product.description}</p>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                    <p className="text-sm text-gray-500">Blockchain Verified</p>
                  </div>
                  <button 
                    onClick={() => handleBuy(product.productId || product._id)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Database Status */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
            <div className={`w-3 h-3 rounded-full ${!error ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-sm text-gray-600">
              {!error ? `Loaded ${products.length} products from database` : 'Using fallback products'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;