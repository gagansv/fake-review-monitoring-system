// Add this with other route imports
const productRoutes = require("./routes/productRoutes");

// Add this with other route middleware
app.use("/api/products", productRoutes);