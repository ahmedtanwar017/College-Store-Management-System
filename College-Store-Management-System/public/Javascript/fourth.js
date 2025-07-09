const hamburger = document.querySelector(".hamburger");
const navCross = document.querySelector(".cross1")
const navMenu = document.querySelector(".left")


hamburger.addEventListener( "click", () => {
    navMenu.style.left = 0;
})

navCross.addEventListener( 'click', ()=>{
    navMenu.style.left = "-100%"
})