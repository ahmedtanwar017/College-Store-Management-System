
// FILTERS



export function Department(inputBox){
  return new Promise((resolve, reject) => {
    function fetchData() {
      return fetch('/DepartmentNames')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the JSON from the response
      })
      .then(data => {
        const departmentData = data.map(obj => {
          return { 
            name: obj.Department_name
          };
        });
        return departmentData;
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        reject(error); // Reject the promise if there's an error
      });
    }

    fetchData().then(departmentData => {
      const resultBox = document.getElementById("Department-result-box");
      
      inputBox.onkeyup = function(){
        let result = [];
        let input = inputBox.value;
        if(input.length){
          result = departmentData.map(obj => obj.name).filter((keyword) => {
            return keyword.toLowerCase().includes(input.toLowerCase());
          });

          display(result);
        } else {
          display([]);
        }
      };

      function display(result){
        const content = result.map((list)=>{
          return  `<li>${list}</li>`;
        });
        resultBox.innerHTML = `<ul> ${content.join("")} </ul>`;
        // Attach event listeners to dynamically created list items
        const listItems = resultBox.querySelectorAll('li');
        listItems.forEach(item => {
          item.addEventListener('click', () => {
            selectInput(item.textContent.trim());
          });
        });
      }

      function selectInput(list){
        inputBox.value =  list;
        resolve(inputBox.value); // Resolve the promise with the input value
        resultBox.innerHTML = "";
      }

    });
  });
}






// export function StaffLab(inputBox) {
//   return new Promise((resolve, reject) => {
//     function fetchStaff() {
//       return fetch('/StaffNames')
//         .then(response => {
//           if (!response.ok) {
//             throw new Error('Network response was not ok');
//           }
//           return response.json(); // Parse the JSON from the response
//         })
//         .then(data => {
//           const StaffData = data.map(obj => {
//             return { 
//               name: obj.Staff_name
//             };
//           });
//           return StaffData;
//         })
//         .catch(error => {
//           console.error('There was a problem with the fetch operation:', error);
//         });
//     }

//     function fetchLab() {
//       return fetch('/LabNames')
//         .then(response => {
//           if (!response.ok) {
//             throw new Error('Network response was not ok');
//           }
//           return response.json(); // Parse the JSON from the response
//         })
//         .then(data => {
//           const LabData = data.map(obj => {
//             return { 
//               name: obj.Lab_name
//             };
//           });
//           return LabData;
//         })
//         .catch(error => {
//           console.error('There was a problem with the fetch operation:', error);
//         });
//     }

//     Promise.all([fetchStaff(), fetchLab()]).then(([StaffData, LabData]) => {
//       const resultBox = document.getElementById("Staff-result-box");
      
//       inputBox.onkeyup = function(){
//         let input = inputBox.value.toLowerCase();
//         let staffNames = [];
//         let labNames = [];

//         if(input.length){
//           staffNames = StaffData.filter(obj => obj.name.toLowerCase().includes(input));
//           labNames = LabData.filter(obj => obj.name.toLowerCase().includes(input));
//         }

//         display(staffNames, labNames);
//       };

//       function display(staffNames, labNames){
//         if(staffNames.length > 0 && labNames.length > 0) {
//         const content = [
//             '<li class="filterName">STAFF</li>', 
//             ...staffNames.map((list)=>{
//               return  `<li>${list.name}</li>`;
//             }),
//             '<li class="filterName">LAB</li>', 
//             ...labNames.map((list)=>{
//               return  `<li>${list.name}</li>`;
//             })  
//         ];
//         resultBox.innerHTML = `<ul> ${content.join("")} </ul>`;
//       }else if(staffNames.length > 0 && labNames.length  == 0){
//         const content = [
//           '<li class="filterName">STAFF</li>', 
//           ...staffNames.map((list)=>{
//             return  `<li>${list.name}</li>`;
//           })]
//           resultBox.innerHTML = `<ul> ${content.join("")} </ul>`;
//       }else if(staffNames.length == 0 && labNames.length > 0){
//         const content = [
//           '<li class="filterName">LAB</li>', 
//           ...labNames.map((list)=>{
//             return  `<li>${list.name}</li>`;
//           })  
//         ]
//         resultBox.innerHTML = `<ul> ${content.join("")} </ul>`;
//       }else{
//         const content =[]
//         resultBox.innerHTML = `<ul> ${content.join("")} </ul>`;
//       }

      
//         const listItems = resultBox.querySelectorAll('li:not(.filterName)');
//         listItems.forEach(item => {
//           item.addEventListener('click', () => {
//             selectInput(item.textContent.trim());
//           });
//         });
//       }
      
//       function selectInput(list){
//         inputBox.value = list;
//         resolve(inputBox.value);
//         resultBox.innerHTML = "";
//       }
//   });
//   })
// }




 export function Product(inputBox){
  return new Promise((resolve, reject) => {
    function fetchData() {
      return fetch('/ProductNames')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the JSON from the response
      })
      .then(data => {
        // console.log(data); // Process the data received from the server
        const ProductData = data.map(obj => {
          return { 
              name: obj.Product_name
          };
      });
        return ProductData;
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
    }
  
    fetchData().then(ProductData => {
      const resultBox = document.getElementById("Product-result-box");
      
      inputBox.onkeyup = function(){
        let result = [];
        let input = inputBox.value;
        console.log(input.length)
        if(input.length){
          result = ProductData.map(obj => obj.name).filter((keyword) => {
            return keyword.toLowerCase().includes(input.toLowerCase());
          });
          // console.log(result);
          display(result);
        }else {
          result =[]
          display(result);
        }
      };
  
      function display(result){
        const content = result.map((list)=>{
          return  `<li>${list}</li>`;
        });
        resultBox.innerHTML = `<ul> ${content.join("")} </ul>`;
        // Attach event listeners to dynamically created list items
        const listItems = resultBox.querySelectorAll('li');
        listItems.forEach(item => {
          item.addEventListener('click', () => {
            selectInput(item.textContent.trim());
          });
        });
      }
      
      function selectInput(list){
        console.log(list)
        inputBox.value =  list;
        resolve(inputBox.value)
        resultBox.innerHTML = "";
      }
    });
  })
}




  export function createTimestamp() {
    // Get the current timestamp
    const date = new Date();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const formattedDate = date.toLocaleString('en-US', options);
    
    // Return the formatted timestamp
    return formattedDate;
}


export function passwordShow(Password,eye){

  eye.onclick = function(){
      if(Password.type === "password"){
          Password.type = "text"
          eye.src = "../Images/eye-open.svg"
      }else{
          Password.type =  "password"
          eye.src = "../Images/eye-close.svg"
      }
  }
}


export function ProductsLedger(inputBox) {
  return new Promise((resolve, reject) => {
    function fetchProducts() {
      return fetch('/ProductNames')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json(); // Parse the JSON from the response
        })
        .then(data => {
          const productsData = data.map(obj => {
            return { 
              name: obj.Product_name
            };
          });
          
          return productsData;
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
    }

    function fetchLedger() {
      return fetch('/LedgerNames')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json(); // Parse the JSON from the response
        })
        .then(data => {
          const ledgerData = data.map(obj => {
            return { 
              name: obj.Ledger_name
            };
          });
          return ledgerData;
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
    }

    Promise.all([fetchProducts(), fetchLedger()]).then(([productsData, ledgerData]) => {
      const resultBox = document.getElementById("Product-result-box");
      
      inputBox.onkeyup = function(){
        let input = inputBox.value.toLowerCase();
        let productsNames = [];
        let ledgerNames = [];

        if(input.length){
          productsNames = productsData.filter(obj => obj.name.toLowerCase().includes(input));
          ledgerNames = ledgerData.filter(obj => obj.name.toLowerCase().includes(input));
        }

        display(productsNames, ledgerNames);
      };

      function display(productsNames, ledgerNames){
        if(productsNames.length > 0 && ledgerNames.length > 0) {
          const content = [
            '<li class="filterName">PRODUCTS</li>', 
            ...productsNames.map((list)=>{
              return  `<li>${list.name}</li>`;
            }),
            '<li class="filterName">LEDGER</li>', 
            ...ledgerNames.map((list)=>{
              return  `<li>${list.name}</li>`;
            })  
          ];
          resultBox.innerHTML = `<ul> ${content.join("")} </ul>`;
        } else if(productsNames.length > 0 && ledgerNames.length  == 0){
          const content = [
            '<li class="filterName">PRODUCTS</li>', 
            ...productsNames.map((list)=>{
              return  `<li>${list.name}</li>`;
            })
          ]
          resultBox.innerHTML = `<ul> ${content.join("")} </ul>`;
        } else if(productsNames.length == 0 && ledgerNames.length > 0){
          const content = [
            '<li class="filterName">LEDGER</li>', 
            ...ledgerNames.map((list)=>{
              return  `<li>${list.name}</li>`;
            })  
          ]
          resultBox.innerHTML = `<ul> ${content.join("")} </ul>`;
        } else {
          const content =[]
          resultBox.innerHTML = `<ul> ${content.join("")} </ul>`;
        }
      
        const listItems = resultBox.querySelectorAll('li:not(.filterName)');
        listItems.forEach(item => {
          item.addEventListener('click', () => {
            selectInput(item.textContent.trim());
          });
        });
      }
      
      function selectInput(list){
        inputBox.value = list;
        resolve(inputBox.value);
        resultBox.innerHTML = "";
      }
    });
  });
}

