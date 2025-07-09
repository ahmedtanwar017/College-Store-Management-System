// import React from 'react';


let i = 9;
let add = document.getElementById("addCourse");
let branches = document.querySelector(".branches");
let cross = document.getElementsByClassName("cross");
let branch = document.getElementsByClassName("branch");
let products = document.querySelectorAll(".Pro")
console.log(products[0])
// function simulateGetRequestAndRedirect(id) {
//     let invisibleLink = document.createElement('a');
//         invisibleLink.href = `../../views/${id}`; // Replace with your desired URL
//         invisibleLink.style.display = 'none';

//         // Append the link to the document body
//         document.body.appendChild(invisibleLink);

//         // Event listener for when the link has been clicked
//         invisibleLink.addEventListener('click', function (event) {
//             // Prevent the default behavior of the link (navigating to the href)
//             event.preventDefault();

//             // Make a GET request using JavaScript
//             fetch(invisibleLink.href, {
//                 method: 'GET',
//                 // Add headers if needed
//             })
//             .then(response => {
//                 // Handle the response as needed
//                 let data = response.json;
//                 // Redirect to a new page after the GET request is completed
//                 fetch('../../views/index.ejs',{
//                     method:'GET',
//                 })
//                 .then(response =>{
//                     response.send('index.ejs',data)
//                 })
//             })
//             .catch(error => {
//                 // Handle errors
//                 console.error('Error making GET request:', error);
//             });
//         });
//         invisibleLink.click();

//         // Remove the link from the document body (optional)
//         document.body.removeChild(invisibleLink);
//     }






add.addEventListener("click", () => {
    let course = prompt("Enter name of the Department");
    if (course != null) {
        i++;
        //Creating Department Dynamically
        let div = document.createElement("div");
        div.setAttribute("style","text-transform:uppercase");
        div.classList.add("branch");
        // div.setAttribute("id", `${i}`);
        div.innerHTML =
        `<div class="cross" id =${i}>
            <img src="/Images/cross.svg" alt="cancel">
        </div>
        <div class="circle relative">
            <img src="/Images/book.svg" alt="book" />
        </div>
        <div class="name">
             <h4><b>${course}</b></h4>
        </div>`;
        document.querySelector(".branches").prepend(div);
        // //Department -> Products
        let ae = document.getElementById(`${i}`);
        // ae.parentElement.addEventListener("click",(e)=>{
        //     console.log(e);
        //     window.location.href = "/Html/products.html";
        // });
        //Delete Department Dynamically
        ae.addEventListener("dblclick", (e) => {
            e.stopPropagation;
            if(confirm("Are you sure you want to DELETE this Department?")){
                let del = ae.parentElement;
                branches.removeChild(del);

            // let id = i;
            // let im = document.getElementById(id);
            // console.log(im);
            // let del = im.parentElement.parentElement;
            // branches.removeChild(del);
            }
        });
    }
});
//Delete Inbuild Departments & Department -> Products
for (let j = 0; j < cross.length; j++) {
    // cross[j].parentElement.addEventListener("click",()=>{
    //     window.location.href = "/Html/products.html";
    // });
    cross[j].addEventListener("dblclick", (e) => {
        e.stopPropagation;
        if(confirm("Are you sure you want to DELETE this Department?")){
        let id = e.target.id;
        let im = document.getElementById(id);
        let del = im.parentElement.parentElement;
        branches.removeChild(del);
        }
    });
}
//Sidebar
let hamburger = document.querySelector(".hamburger");
hamburger.addEventListener("click", ()=>{
      document.querySelector(".left").style.left="0";
})
document.querySelector(".cross1").addEventListener("click", ()=>{
    document.querySelector(".left").style.left="-100%";
});

for (let j=0;j<branch.length;j++){
    branch[j].addEventListener("click",()=>{
        let id = branch[j].id;
        simulateGetRequestAndRedirect(id);
        

    })
}
