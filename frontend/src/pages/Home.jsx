import ReviewBox from "../components/ReviewBox";

export default function Home() {
  const dummyProductId = "695262787a501b9583c44943";

  return (
    <div>
      <h1>E-Commerce Product</h1>
      <p>Awesome Product Description</p>

      <ReviewBox productId={dummyProductId} />
    </div>
  );
}
