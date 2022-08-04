// Randomly choose Hero Image
const femaleHeroURL = "url(https://uploads-ssl.webflow.com/6087423fbc61c1bded1c5d8e/629f0d417a006e4f8105c6ca_hero-female.png)";
const maleHeroURL = "url(https://uploads-ssl.webflow.com/6087423fbc61c1bded1c5d8e/629f0d419b77d83f3605c351_hero-male.png)"
let heroImageBlock = document.querySelector('.div-block-264');
heroImageBlock.style.backgroundRepeat = 'no-repeat';
heroImageBlock.style.backgroundSize = 'cover';
if (Math.random() <= 0.50) {
	heroImageBlock.style.backgroundImage = maleHeroURL;
  // document.querySelector('.male-hero-block').style.display = 'none';
} else {
	heroImageBlock.style.backgroundImage = femaleHeroURL;
}

// let animationOneIntervalId;
// let animationTwoIntervalId;
// let animationThreeIntervalId;
// document.querySelector('#animate1').style.opacity = '1';
// document.querySelector('#animate1').style.transition = "opacity 1000ms ease";
// document.querySelector('#animate2').style.opacity = '0';
// document.querySelector('#animate2').style.transition = "opacity 1000ms ease";
// document.querySelector('#animate3').style.opacity = '1';
// document.querySelector('#animate3').style.transition = "opacity 1000ms ease";
// document.querySelector('#animate4').style.opacity = '0';
// document.querySelector('#animate4').style.transition = "opacity 1000ms ease";
// document.querySelector('#animate5').style.opacity = '1';
// document.querySelector('#animate5').style.transition = "opacity 1000ms ease";
// document.querySelector('#animate6').style.opacity = '0';
// document.querySelector('#animate6').style.transition = "opacity 1000ms ease";

// var observerOne = new IntersectionObserver(function(entries) {
// 	if (entries[0].isIntersecting === true) {
// 		startAnimationOne();
// 	}
// }, { threshold: [0] });

// var observerTwo = new IntersectionObserver(function(entries) {
// 	if (entries[0].isIntersecting === true) {
// 		startAnimationTwo();
// 	}
// }, { threshold: [0] });

// var observerThree = new IntersectionObserver(function(entries) {
// 	if (entries[0].isIntersecting === true) {
// 		startAnimationThree();
// 	}
// }, { threshold: [0] });

// observerOne.observe(document.getElementById('animate1'));
// observerTwo.observe(document.getElementById('animate3'));
// observerThree.observe(document.getElementById('animate5'));

// function slideChange(activeImageId, inactiveImageId) {
// 	let activeImage = document.querySelector(`#${activeImageId}`);
// 	let inactiveImage = document.querySelector(`#${inactiveImageId}`);
// 	activeImage.style.height = 'auto';
// 	activeImage.style.opacity = '1';
// 	inactiveImage.style.height = '0';
// 	inactiveImage.style.opacity = '0'
// }

// function startAnimationOne() {
// 	// Begin animation
// 	if (!animationOneIntervalId) {
// 		let currentSlide = 0;
// 		animationOneIntervalId = setInterval(()=>{
// 			if(currentSlide === 0) {
// 				slideChange('animate2', 'animate1');
// 				currentSlide += 1;
// 			} else if(currentSlide === 1) {
// 				slideChange('animate1', 'animate2');
// 				clearInterval(animationOneIntervalId);
// 			}
// 		}, 5000);
// 	}
// };

// function startAnimationTwo() {
// 	// Begin animation
// 	if (!animationTwoIntervalId) {
// 		let currentSlide = 0;
// 		animationTwoIntervalId = setInterval(()=>{
// 			if(currentSlide === 0) {
// 				slideChange('animate4', 'animate3');
// 				currentSlide += 1;
// 			} else if(currentSlide === 1) {
// 				slideChange('animate3', 'animate4');
// 				clearInterval(animationTwoIntervalId);
// 			}
// 		}, 5000);
// 	}
// };

// function startAnimationThree() {
// 	// Begin animation
// 	if (!animationThreeIntervalId) {
// 		let currentSlide = 0;
// 		animationThreeIntervalId = setInterval(()=>{
// 			if (currentSlide === 0) {
// 				slideChange('animate6', 'animate5');
// 				currentSlide += 1;
// 			} else if(currentSlide === 1) {
// 				slideChange('animate5', 'animate6');
// 				clearInterval(animationThreeIntervalId);
// 			}
// 		}, 5000);
// 	}
// };

// Original Homepage Animations
var visibleSecondsDelay = 7;  
function makeImageDynamic(defaultImageId, alternateImageSrcs) {
  var firstImageEl = document.getElementById(defaultImageId);
  firstImageEl.style.opacity = '1';
  var allImageElements = [firstImageEl];
  // create a new image element for each additional image and append it as a sibling
  // copy the original image class to get absolute positioning styles from it
  // set opacity to 0
  alternateImageSrcs.forEach(function (src) {
    var newImg = document.createElement('img');
    newImg.src = src;
    newImg.className = firstImageEl.className;
    newImg.style.opacity = '0';
    firstImageEl.parentNode.appendChild(newImg);
    allImageElements.push(newImg);
  });
  
  // every second check to see if the image is actually visible on the screen
  // meaning that the tab is active and the image is in a scoll position thats
  // visible. swap out the images every N *visible* seconds.
  var elapsedVisibleSecondsSinceLastSwap = 0;
  window.setInterval(function () {
    var currentImageIndex = allImageElements.findIndex(function (el) {
      return el.style.opacity === '1';
    });

	if (!isImageInVisibleScrollPosition(allImageElements[currentImageIndex])) {
      return;
    }
    
    elapsedVisibleSecondsSinceLastSwap = elapsedVisibleSecondsSinceLastSwap + 1;
    if (elapsedVisibleSecondsSinceLastSwap !== visibleSecondsDelay) {
      return;
    }
    elapsedVisibleSecondsSinceLastSwap = 0;

    var nextImageIndex = currentImageIndex + 1;
    if (nextImageIndex === allImageElements.length) {
      nextImageIndex = 0;
    }
    allImageElements[currentImageIndex].style.opacity = '0';
    allImageElements[nextImageIndex].style.opacity = '1';
  }, 1000);
}

function isImageInVisibleScrollPosition(el) {
  var rect = el.getBoundingClientRect();
  var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  // make sure at least the top of the image is in the viewport
  // we pad with 50 because the images have some transparent space above the actual
  // visible phone mocks
  var top = rect.top + 50;
  return (
    top >= 0 &&
    top <= viewportHeight
  );
}

function getWebflowImgSrc(tail) {
  return 'https://global-uploads.webflow.com/' + tail;
}

makeImageDynamic(
	'animate1', 
	[
	  getWebflowImgSrc('6087423fbc61c1bded1c5d8e/62ebd0b21a9e2b2961b721d6_Screen.svg')
	  // add more images here if necessary
	]
);

makeImageDynamic(
	'animate3', 
	[
	  getWebflowImgSrc('6087423fbc61c1bded1c5d8e/62eaa1727af19a9f76cd5f62_Device-OpenEnd.svg')
	  // add more images here if necessary
	]
);

makeImageDynamic(
	'animate5', 
	[
	  getWebflowImgSrc('6087423fbc61c1bded1c5d8e/62eaa172df96d8b7acc9677b_Device-Messages.svg')
	  // add more images here if necessary
	]
);