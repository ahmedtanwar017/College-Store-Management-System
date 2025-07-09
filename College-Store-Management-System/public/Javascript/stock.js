import { ProductsLedger } from "./functions.js";


const ProductinputBox = document.getElementById('Product-input-box');


ProductinputBox.addEventListener('onclick',ProductsLedger(ProductinputBox));

// document.addEventListener('DOMContentLoaded', function() {
//     const submitButton = document.getElementById('submitButton');
//     submitButton.addEventListener('click', function(event) {
//         event.preventDefault(); // Prevent default form submission
        
//         ProductinputBox.value = ProductValue;

//         // Get the current timestamp
//         const timestamp = createTimestamp();
        
//         // Set the value of the hidden input field to the timestamp
//         const timestampInput = document.getElementById('timestampInput');
//         timestampInput.value = timestamp;
        
//         // Submit the form
//         const myForm = document.getElementById('stockForm');
//         myForm.submit();
//     });
// });
