

console.log("Test");
//From drag.html
'use strict';

window.onload = function() {
  const STANDARD_CLICK = 0;

  let drag_target_ = null;
  let drag_delta_ = {'x': 0, 'y': 0};
  var list = null;
  var prevDrag = 0;
  var direction = null;

  init();

  function init (item){
    list = document.getElementById('bookmark-bar');
    list.items = document.getElementsByTagName('li');

    //Get the list items, give them startPos and endPos.
    for (var i = 0, len = list.items.length; i<len; i++ ) {

      var item = list.items[i];

      if (i == 0) {
        item.prev = null;
        item.startPos = 0;

        item.endPos = item.clientWidth;
        item.next = list.items[i+1];

      } else if( i == list.items.length){
        item.next = null;
        item.prev = list.items[i-1];

        item.startPos = item.prev.endPos;
        item.endPos = item.startPos + item.clientWidth;
      }
      else {         
        item.prev = list.items[i-1];
        item.next = list.items[i+1];

        item.startPos = item.prev.endPos;
        item.endPos = item.startPos + item.clientWidth;
      }

      item.old_startPos = item.startPos;
      item.old_endPos = item.endPos;
      console.log("init",item.old_startPos );

      item.style.left = item.startPos + "px";

      item.addEventListener('mousedown', mousedown_);
    }

  }

  var mousedown_ = function(event) {
    if (event.button == STANDARD_CLICK) {

     // console.log(event.target.parentNode);
      drag_target_ = event.target.parentNode;
      let style = drag_target_.style;

      drag_target_.id = "active";
      prevDrag = event.clientX;
      drag_delta_.x = event.clientX - parseInt(style.left);
      drag_delta_.y = event.clientY - parseInt(style.top);

      document.addEventListener('mousemove', mousemove_);
      document.addEventListener('mouseup', mouseup_);

      event.preventDefault();
    }
  };

  var mousemove_ = function(event) {
    
    const alpha = 0.3;
   //console.log("target",drag_target_.next);

    let dragX = event.clientX - drag_delta_.x;
    let dragY = event.clientY - drag_delta_.y;

   

    drag_target_.style.left = `${dragX}px`;
    drag_target_.style.top = `${dragY}px`;

    drag_target_.style.zIndex = 1000;


    if((prevDrag - event.clientX) > 0 && drag_target_.prev){
      direction = "left";

     var center = ((1-alpha)*drag_target_.prev.endPos + (alpha)*drag_target_.prev.startPos);

      if(center > dragX ){
        
        moveRight();
        
      }

    } else if(drag_target_.next){

      var center = (alpha*drag_target_.next.endPos + (1-alpha)*drag_target_.next.startPos);

      if(center < dragX + drag_target_.clientWidth){         
        moveLeft();            
      }
      
      
      //Going left
      
      

    }

    prevDrag = event.clientX;



  };

  var moveRight = function(){
    //Only do this once.   
    //The previous items startpos needs to move foreward by "clientWidthPX"
    drag_target_.startPos = drag_target_.prev.startPos;
    drag_target_.prev.startPos += drag_target_.clientWidth;
    animate(drag_target_.prev);
    drag_target_.prev.style.left = drag_target_.prev.startPos + "px";
    

    //Now relocate prev and next items.     
    if(drag_target_.prev.prev){
      drag_target_.prev.prev.next = drag_target_;
    }
   drag_target_.next.prev = drag_target_.prev;
    drag_target_.prev = drag_target_.prev.prev;
    //data_target.prev.prev.next = drag_target_;
       
  
  }
  var moveLeft = function(){
    //The next items startpos needs to move backwards by "clientWidthPX"

    if(drag_target_.next == null){
      console.log("end of the line");
    } else {

      drag_target_.next.startPos -= drag_target_.clientWidth;
      drag_target_.next.endPos = drag_target_.next.startPos + drag_target_.next.clientWidth;
      animate(drag_target_.next);
      drag_target_.next.style.left = drag_target_.next.startPos + "px";

      //The new startPos for drag_target is the oldPos of the item we just moved. 
      drag_target_.startPos = drag_target_.next.endPos;
      //Set the dragged target as prev to nexts next.  
      if(drag_target_.next.next){
        console.log("not nulL",drag_target_.next.next.prev)
        drag_target_.next.next.prev = drag_target_;
      }
      
      drag_target_.next = drag_target_.next.next;       
    }
  
  }

  var mouseup_ = function(event) {
    document.removeEventListener('mousemove', mousemove_);
    document.removeEventListener('mouseup', mouseup_);

    drag_target_.style.left = `${drag_target_.startPos}px`;
    animate(drag_target_);
    drag_target_.style.zIndex = 1;
    drag_target_ = null;

  };

  document.addEventListener('mousedown', mousedown_);
};

let animate = function(element){
    element.classList.add("move");
     element.addEventListener("transitionend", function(event) {
      event.target.classList.remove("move");
    }, false);
}

//From animate.html
let set_new_randow_position = function() {
  let ele = document.querySelector('#target');
  let style = ele.style;
  style.left =
      `${Math.trunc(Math.random() * (window.innerWidth - ele.clientWidth))}px`;
  style.top =
      `${Math.trunc(Math.random() * (window.innerHeight - ele.clientHeight))}px`;
};

