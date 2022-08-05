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
	  getWebflowImgSrc('6087423fbc61c1bded1c5d8e/62ecffb608977770b9414d6a_Screen1.svg')
	  // add more images here if necessary
	]
);

makeImageDynamic(
	'animate3', 
	[
	  getWebflowImgSrc('6087423fbc61c1bded1c5d8e/62ed16580a7ec370d6dbb9cc_Screen.svg')
	  // add more images here if necessary
	]
);

makeImageDynamic(
	'animate5', 
	[
	  getWebflowImgSrc('6087423fbc61c1bded1c5d8e/62ecffb605f0c83917aedee1_Screen2.svg')
	  // add more images here if necessary
	]
);