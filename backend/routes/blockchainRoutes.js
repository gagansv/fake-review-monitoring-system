// Add this route
router.post("/initiate-purchase", async (req, res) => {
  try {
    const { productId, amount } = req.body;
    
    // Your existing Metamask integration code
    // This should return a transaction hash
    
    res.json({
      success: true,
      message: "Please confirm the transaction in Metamask",
      transactionHash: "0x..." // Replace with actual hash
    });
  } catch (error) {
    console.error("Purchase initiation error:", error);
    res.status(500).json({ error: error.message });
  }
});