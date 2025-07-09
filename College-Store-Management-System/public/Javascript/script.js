function addProduct() {
    // Get form data
    const productName = document.getElementById('productName').value;

    // Validate form data (add more validation as needed)

    // Example: Send data to the server (replace with your actual server-side endpoint)
    fetch('/addProduct', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({productName }),
    })
    .then(response => response.json())
    .then(data => {
        // Handle the server response (if needed)
        console.log('Server response:', data);
        alert('Product added successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error adding product. Please try again.');
    });
}
