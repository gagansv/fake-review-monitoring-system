import ReviewBox from "../components/ReviewBox";
import { Link } from "react-router-dom";

export default function Home() {
  const dummyProductId = "695262787a501b9583c44943";

  // Featured products with real images
  const featuredProducts = [
    { 
      id: "P001", 
      name: "Sony Wireless Headphones", 
      price: "$299", 
      category: "Audio",
      img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop"
    },
    { 
      id: "P002", 
      name: "Apple Watch Series 8", 
      price: "$429", 
      category: "Wearables",
      img: "https://images.unsplash.com/photo-1579586337278-3f4ab5c8d6b9?w=600&h=400&fit=crop"
    },
    { 
      id: "P003", 
      name: "MacBook Pro 14-inch", 
      price: "$1999", 
      category: "Laptops",
      img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop"
    },
    { 
      id: "P004", 
      name: "Samsung Galaxy S23", 
      price: "$899", 
      category: "Phones",
      img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner - Full Width */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="w-full px-4 py-24 md:py-32 lg:py-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Trust Through Technology
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl mb-10 opacity-90 max-w-2xl">
                Shop with confidence. Every review on our platform is verified through blockchain technology,
                ensuring authentic feedback from real customers only.
              </p>
              <Link to="/products">
                <button className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transition duration-300 text-lg md:text-xl">
                  Shop Now →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width */}
      <div className="w-full">
        {/* Trust Badges - Full Width Container */}
        <div className="w-full py-12 md:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
              <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-2xl transition-shadow duration-300">
                <div className="text-5xl mb-6">🔒</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Verified Purchases</h3>
                <p className="text-gray-600 text-lg">Only genuine buyers can submit reviews</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-2xl transition-shadow duration-300">
                <div className="text-5xl mb-6">⛓️</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Blockchain Secured</h3>
                <p className="text-gray-600 text-lg">Reviews stored permanently on blockchain</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-2xl transition-shadow duration-300">
                <div className="text-5xl mb-6">🤖</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">AI Detection</h3>
                <p className="text-gray-600 text-lg">Advanced fake review detection system</p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Products Section - Full Width */}
        <div className="w-full py-12 md:py-16 lg:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 md:mb-12 lg:mb-16">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-0">Featured Products</h2>
                <Link to="/products" className="text-blue-600 hover:text-blue-700 font-semibold text-lg">
                  View All Products →
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {featuredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="h-64 md:h-72 lg:h-80 overflow-hidden">
                      <img 
                        src={product.img} 
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-6 md:p-8">
                      <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">{product.category}</span>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-800 mt-3 mb-2">{product.name}</h3>
                      <div className="flex items-center justify-between mt-6">
                        <span className="text-2xl md:text-3xl font-bold text-gray-900">{product.price}</span>
                        <Link to={`/verify?product=${product.id}`}>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300 text-lg">
                            Buy Now
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How It Works - Full Width */}
            <div className="w-full py-12 md:py-16 lg:py-20">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 md:p-12 lg:p-16 rounded-3xl">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-12 md:mb-16 text-center">
                  How Our System Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                  <div className="text-center p-6">
                    <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-3xl md:text-4xl">🛒</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">1. Purchase Product</h3>
                    <p className="text-gray-600 text-lg">Buy any product from our store</p>
                  </div>
                  <div className="text-center p-6">
                    <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-3xl md:text-4xl">✅</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">2. Verification</h3>
                    <p className="text-gray-600 text-lg">Purchase is verified on blockchain</p>
                  </div>
                  <div className="text-center p-6">
                    <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-3xl md:text-4xl">✍️</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">3. Submit Review</h3>
                    <p className="text-gray-600 text-lg">Write your honest experience</p>
                  </div>
                  <div className="text-center p-6">
                    <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-3xl md:text-4xl">🔐</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">4. Permanent Storage</h3>
                    <p className="text-gray-600 text-lg">Review stored permanently on blockchain</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section - Full Width */}
            <div className="w-full py-16 md:py-20 lg:py-24 text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 md:mb-8">
                Ready to Shop with Confidence?
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 mb-10 md:mb-12 max-w-3xl mx-auto">
                Join thousands of customers who trust our blockchain-verified review system.
              </p>
              <Link to="/products">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-5 rounded-xl font-semibold text-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  Start Shopping Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}