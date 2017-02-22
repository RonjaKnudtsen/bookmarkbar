console.log("Executing: Future Group application test");
//From drag.html
'use strict';

window.onload = function() {
  const STANDARD_CLICK = 0;
  let drag_target_ = null;
  let drag_delta_ = {'x': 0, 'y': 0};

  let directionLeft = false;
  let isRemoving = false; //To prevent looping.   
  let dragX = null;
  let dragY = null;
  var prevClientX = 0;

  let bookmarkBar = document.getElementById('bookmark-bar');
  let bookmarks = bookmarkBar.getElementsByTagName('li');

  //Start by running rePosition so we can give the bookmarks correct startposition. 
  rePosition();

  function rePosition(doAnimation){
    for (var i = 0, len = bookmarks.length; i<len; i++ ) {
  		if( i != 0){
  			//Get previous elments startpos and clientWidth, use this to reposition "this". 
  			bookmarks[i].style.left =  parseInt(bookmarks[i].previousElementSibling.style.left) + bookmarks[i].previousElementSibling.clientWidth + "px";
  		} else {
  			bookmarks[i].style.left = 0 + "px";			
  		}
  		bookmarks[i].style.top = 0 + "px";  
    }
  }

  let animateMove = function (element){
  	element.classList.add("move");
  	 element.addEventListener("transitionend", function(event) {
  	  event.target.classList.remove("move");
  	}, false);
  }

  let animateFade = function (element){
  	element.classList.add("fade");
  }

  let mousedown_ = function(event) {  	
  	//When clicking the boxes we are clicking on h2 (since h2 is the only object without position relative), so we need to get its parentNodes' parentNode. 
    if (event.target.parentNode.parentNode.id == 'bookmark-bar' && event.button == STANDARD_CLICK) {
      drag_target_ = event.target.parentNode;

      let style = drag_target_.style;
      drag_delta_.x = event.clientX - parseInt(style.left);
      drag_delta_.y = event.clientY - parseInt(style.top);
      document.addEventListener('mousemove', mousemove_);
      document.addEventListener('mouseup', mouseup_);
      event.preventDefault();
    }
  };

  let mousemove_ = function(event) {
  	//This is used to compare pos.
  	dragX = event.clientX - drag_delta_.x;
    dragY = event.clientY - drag_delta_.y;

    drag_target_.style.left = `${dragX}px`;
    drag_target_.style.top = `${dragY}px`;

    if(dragY > 50 || dragY < -50 && !isRemoving){
      isRemoving = true;

      animateFade(drag_target_);
      removeDrag_targetBookmark();

    } else if((prevClientX - event.clientX) > 0 && drag_target_.previousElementSibling){
    	directionLeft = true;
    	checkSwap(drag_target_.previousElementSibling);
    	
    } else if((prevClientX - event.clientX) < 0  && drag_target_.nextElementSibling){
    	directionLeft = false;
    	checkSwap(drag_target_.nextElementSibling);    	
    }

    prevClientX = event.clientX;
  };

  let removeDrag_targetBookmark = function(){

    //Wait for fade to complete.
    drag_target_.addEventListener("transitionend", function(event) {

        //Check if exists, to prevent uncaught reference error. 
        if(drag_target_){

          //Add animation to all elements that will collapse (everyone to the right). 
          let temp = drag_target_.nextElementSibling;
          while(temp){
            animateMove(temp);
            temp = temp.nextElementSibling;
          }

          bookmarkBar.removeChild(drag_target_);
          rePosition(true);
          drag_target_ = null;
          event.target.classList.remove("fade");
          isRemoving = false;
        }
      }, false);
  }

  //Check if we need to swap. 
  function checkSwap(drop_target_){

	 let startPos = parseInt(drop_target_.style.left);
   let endPos = drop_target_.clientWidth + startPos;
   let center = (startPos + endPos )/ 2;

   //different behavior based on direction. 

    if (dragX < center && directionLeft ) {
    	animateMove(drop_target_);
    	//new pos = drop_target.pos + width of dragged item. 
    	drop_target_.style.left = parseInt(drop_target_.style.left) + drag_target_.clientWidth + "px";
    	bookmarkBar.insertBefore(drag_target_, drop_target_);
    } 
    else if (dragX > center && directionLeft == false) {
    	animateMove(drop_target_);
    	//new pos = drop_target.pos - width of dragged item. 
    	drop_target_.style.left = parseInt(drop_target_.style.left) - drag_target_.clientWidth + "px";
    	//Insert before next (in order to insert after). 
    	bookmarkBar.insertBefore(drag_target_, drop_target_.nextElementSibling);
    }

  }

  let mouseup_ = function(event) {
    document.removeEventListener('mousemove', mousemove_);
    document.removeEventListener('mouseup', mouseup_);

    //if we are removing an object we should wait for fade. 
    if(!isRemoving){      
      animateMove(drag_target_);
      rePosition(true);
      drag_target_ = null;
    }
  	

  };

  document.addEventListener('mousedown', mousedown_);

}