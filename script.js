document.addEventListener('DOMContentLoaded', () => {
    // Select all "Buy Now" buttons
    const buyButtons = document.querySelectorAll('.buy-btn');
  
    buyButtons.forEach(button => {
      button.addEventListener('click', async function () {
        // Get book details from the parent element
        const bookCard = this.closest('.product-card');
        const bookId = bookCard.getAttribute('data-book-id'); // e.g., "book1"
        const bookPrice = bookCard.getAttribute('data-book-price'); // Price in INR
  
        if (!bookId || !bookPrice) {
          console.error('Book details are missing!');
          return;
        }
  
        // Razorpay payment options
        const options = {
          key: 'rzp_test_pVZoyNIJWMSmxu', // Replace with your Razorpay API Key
          amount: bookPrice * 100, // Convert INR to paise
          currency: 'INR',
          name: 'Bookstore',
          description: `Purchase of ${bookId}`,
          image: './images/logo.svg', // Optional: Add your store logo
          handler: async function (response) {
            // Send payment details to the backend for verification
            try {
              const paymentResponse = await fetch('https://gola-jade.vercel.app/verify-payment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  payment_id: response.razorpay_payment_id,
                  order_id: response.razorpay_order_id,
                  signature: response.razorpay_signature,
                }),
              });
  
              const paymentResult = await paymentResponse.json();
              if (paymentResult.success) {
                alert('Payment successful! Your book is ready for download.');
                // Redirect to the PDF download URL only after verification
                window.location.href = `/public/path/${bookId}.pdf`; // Update the path to match your server
              } else {
                alert('Payment verification failed. Please try again.');
              }
            } catch (error) {
              console.error('Error during payment verification:', error);
              alert('An error occurred while verifying your payment. Please try again.');
            }
          },
          prefill: {
            name: 'Customer Name', // Update with actual customer data if available
            email: 'customer@example.com', // Update with actual email if available
          },
          theme: {
            color: '#4CAF50', // Customize modal color
          },
        };
  
        // Open Razorpay modal
        const rzp = new Razorpay(options);
        rzp.open();
      });
    });
  });
  