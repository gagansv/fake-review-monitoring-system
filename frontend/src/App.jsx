import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminDashboard from "./components/AdminDashboard";
import ProductsPage from "./pages/ProductsPage";
import VerifyPurchase from "./pages/VerifyPurchase";
import ReviewPage from "./pages/ReviewPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductsPage />} />
        <Route path="/verify" element={<VerifyPurchase />} />
        <Route path="/review" element={<ReviewPage />} />
      </Routes>
    </BrowserRouter>
  );
}
