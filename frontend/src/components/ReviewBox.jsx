import { useState } from "react";
import API from "../api/api";
import Popup from "./Popup";

export default function ReviewBox({ productId }) {
  const [reviewText, setReviewText] = useState("");
  const [popup, setPopup] = useState(null);

  const submitReview = async () => {
    if (!reviewText.trim()) {
      setPopup({
        type: "error",
        message: "Please enter a review before submitting.",
      });
      return;
    }

    try {
      const res = await API.post("/review/analyze", {
        reviewText,
        productId,
      });

      const review = res.data.review;

      setPopup({
        type: "success",
        message: review.onBlockchain
          ? "Review submitted and verified on blockchain ✅"
          : "Review submitted successfully (not blockchain verified)",
      });

      setReviewText("");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setPopup({
        type: "error",
        message: "Failed to submit review. Please try again.",
      });
    }
  };

  return (
    <div className="border p-4 rounded">
      <h3 className="text-lg font-bold mb-2">Write a Review</h3>

      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        rows={4}
        className="w-full border p-2 rounded"
      />

      <button
        onClick={submitReview}
        className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
      >
        Submit Review
      </button>

      {popup && (
        <Popup
          type={popup.type}
          message={popup.message}
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  );
}
