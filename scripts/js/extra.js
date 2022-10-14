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