import { Department,Product,ProductsLedger,createTimestamp} from "./functions.js";


const DepartmentinputBox = document.getElementById('Department-input-box');
// const StaffinputBox = document.getElementById('Staff-input-box');
const ProductinputBox = document.getElementById('Product-input-box');

// let departmentValue
// let staffLabValue
// let ProductValue

DepartmentinputBox.addEventListener("onclick",Department(DepartmentinputBox))
// StaffinputBox.addEventListener('onclick', StaffLab(StaffinputBox).then((value) =>{staffLabValue= value})) 
ProductinputBox.addEventListener('onclick',ProductsLedger(ProductinputBox));



// document.addEventListener('DOMContentLoaded', function() {
//     const submitButton = document.getElementById('submitButton');
//     submitButton.addEventListener('click', function(event) {
//         event.preventDefault(); // Prevent default form submission
        
//         DepartmentinputBox.value = departmentValue
//         StaffinputBox.value = staffLabValue
//         ProductinputBox.value = ProductValue;

//         // Get the current timestamp
//         const timestamp = createTimestamp();
        
//         // Set the value of the hidden input field to the timestamp
//         const timestampInput = document.getElementById('timestampInput');
//         timestampInput.value = timestamp;
        
//         // Submit the form
//         const myForm = document.getElementById('myForm');
//         myForm.submit();
//     });
// });





















