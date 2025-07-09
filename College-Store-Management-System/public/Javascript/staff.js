// window.onload = function() {
//     var message = typeof message !== 'undefined' ? message : '' ;
//     if (message) {
//         alert(message);
//     }
// };

const navbarToggle = document.getElementById('navbar-toggle');
const navbarLinks = document.getElementById('navbar-links');

        navbarToggle.addEventListener('click', () => {
      navbarLinks.classList.toggle('show');
      // Check if navbarLinks is visible after toggling the class
      if (navbarLinks.classList.contains('show')) {
          navbarLinks.style.display = 'block'; // Set display to block if navbarLinks is visible
      } else {
          navbarLinks.style.display = 'none'; // Reset display to its default value if navbarLinks is hidden
      }
  });

      fetch('/dashboard')
            .then(response => response.text())
            .then(navbarHtml => {
                // Insert the navbar HTML into the desired location in the document
                document.getElementById('navbar-container').innerHTML = navbarHtml ;
                document.getElementById("signOutBtn").addEventListener("click", function() {
                // Show the popup
                document.getElementById("popupContainer").style.display = "flex";
              });

              // Add event listener to the "Yes" button
              document.getElementById("yesBtn").addEventListener("click", function() {
                // Redirect to sign-out route
                window.location.href = "/signout";
              });

              // Add event listener to the "No" button
              document.getElementById("noBtn").addEventListener("click", function() {
                // Hide the popup
                document.getElementById("popupContainer").style.display = "none";
              });
            })
            .catch(error => console.error('Error:', error));
