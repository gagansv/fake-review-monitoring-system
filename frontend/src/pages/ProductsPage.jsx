import { useNavigate } from 'react-router-dom';

const ProductsPage = () => {
  const navigate = useNavigate();
  
  const products = [
    { 
      id: "P001", 
      name: "Sony WH-1000XM5", 
      price: "$399", 
      img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop&q=80",
      category: "Premium Audio",
      rating: "4.8"
    },
    { 
      id: "P002", 
      name: "Apple Watch Ultra", 
      price: "$799", 
      img: "https://images.unsplash.com/photo-1579586337278-3f4ab5c8d6b9?w=600&h=400&fit=crop&q=80",
      category: "Smart Wearables",
      rating: "4.9"
    },
    { 
      id: "P003", 
      name: "MacBook Pro M3", 
      price: "$2,499", 
      img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop&q=80",
      category: "Pro Laptops",
      rating: "4.7"
    },
    { 
      id: "P004", 
      name: "Samsung S24 Ultra", 
      price: "$1,299", 
      img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop&q=80",
      category: "Flagship Phone",
      rating: "4.6"
    }
  ];

  const handleBuy = (productId) => {
    navigate(`/verify?product=${productId}`);
  };

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
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <div key={product.id} className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={product.img} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {product.rating} ★
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                      {product.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mt-1 mb-2">
                      {product.name}
                    </h3>
                  </div>
                </div>
                
                <div className="mb-4">
                  <span className="text-sm text-gray-500">Product ID:</span>
                  <p className="font-mono text-gray-800">{product.id}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">{product.price}</span>
                    <p className="text-sm text-gray-500">Blockchain Verified</p>
                  </div>
                  <button 
                    onClick={() => handleBuy(product.id)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl text-center">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Blockchain Security</h3>
            <p className="text-gray-600">Every review is permanently stored and tamper-proof</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Buyers</h3>
            <p className="text-gray-600">Only genuine customers can submit reviews</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI Detection</h3>
            <p className="text-gray-600">Advanced algorithms detect fake reviews</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;