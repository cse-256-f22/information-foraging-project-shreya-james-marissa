function toggleButton(clicked_id){
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i <= coll.length; i++) {

        coll[clicked_id].classList.toggle("active");
        var content = coll[clicked_id].nextElementSibling;
        if (content.style.maxHeight){
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + "px";
        } 
    }
}


window.onload = function () {

  // When the user scrolls the page, execute myFunction
  window.onscroll = function() {doSticky()};

  // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
  function doSticky() {

      // Get the header
      header = document.getElementById("main-menu-container");

      // Get the offset position of the navbar
      var sticky = header.offsetTop;

      if (window.pageYOffset > sticky && showing == false) {
          header.classList.add("sticky");
          header.classList.remove("showing");
      } else if (window.pageYOffset > sticky-334 && showing == true) {
          header.classList.add("showing");
      } else if (window.pageYOffset < sticky && showing == false){
          header.classList.remove("showing");
          header.classList.remove("sticky");
      } else if (window.pageYOffset < sticky-334 && showing == true){
          header.classList.remove("showing");
          header.classList.remove("sticky");
      }
  }


};