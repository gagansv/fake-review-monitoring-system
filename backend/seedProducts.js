const mongoose = require("mongoose");
const Product = require("./models/Product");
require('dotenv').config();  // Load environment variables

const products = [
  {
    productId: "P001",
    name: "Sony WH-1000XM5",
    price: 399,
    description: "Premium noise-cancelling headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    category: "Audio"
  },
  {
    productId: "P002",
    name: "Apple Watch Ultra",
    price: 799,
    description: "Premium smartwatch for fitness",
    image: "https://images.unsplash.com/photo-1579586337278-3f4ab5c8d6b9",
    category: "Wearables"
  },
  {
    productId: "P003",
    name: "MacBook Pro M3",
    price: 2499,
    description: "Professional laptop for creators",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    category: "Laptops"
  },
  {
    productId: "P004",
    name: "Samsung S24 Ultra",
    price: 1299,
    description: "Flagship smartphone with advanced camera",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    category: "Phones"
  }
];

async function seedProducts() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    console.log("Connection string:", process.env.MONGODB_URI ? "Found" : "Not found");
    
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log("✅ Connected to MongoDB Atlas!");
    console.log(`Database: ${mongoose.connection.db.databaseName}`);
    
    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");
    
    // Insert new products
    await Product.insertMany(products);
    console.log("✅ Products seeded successfully!");
    
    // List seeded products
    const seeded = await Product.find();
    console.log(`\n📦 Seeded ${seeded.length} products:`);
    seeded.forEach(p => console.log(`  - ${p.name} (ID: ${p.productId}) - $${p.price}`));
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding products:", error.message);
    
    if (error.message.includes('Authentication failed')) {
      console.log("\n⚠️ MongoDB Atlas Authentication Failed!");
      console.log("Check your .env file - MONGODB_URI might have wrong credentials");
      console.log("Format should be: mongodb+srv://username:password@cluster.mongodb.net/database");
    }
    
    process.exit(1);
  }
}

seedProducts();