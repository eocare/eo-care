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

let animationOneIntervalId;
let animationTwoIntervalId;
let animationThreeIntervalId;
document.querySelector('#animate1').style.opacity = '1';
document.querySelector('#animate1').style.transition = "opacity 1500ms ease";
document.querySelector('#animate2').style.opacity = '0';
document.querySelector('#animate2').style.transition = "opacity 1500ms ease";
document.querySelector('#animate3').style.opacity = '1';
document.querySelector('#animate3').style.transition = "opacity 1500ms ease";
document.querySelector('#animate4').style.opacity = '0';
document.querySelector('#animate4').style.transition = "opacity 1500ms ease";
document.querySelector('#animate5').style.opacity = '1';
document.querySelector('#animate5').style.transition = "opacity 1500ms ease";
document.querySelector('#animate6').style.opacity = '0';
document.querySelector('#animate6').style.transition = "opacity 1500ms ease";

function slideChange(activeImageId, inactiveImageId) {
	let activeImage = document.querySelector(`#${activeImageId}`);
	let inactiveImage = document.querySelector(`#${inactiveImageId}`);
	activeImage.style.height = 'auto';
	activeImage.style.opacity = '1';
	inactiveImage.style.height = '0';
	inactiveImage.style.opacity = '0'
}
window.onscroll = function (e) {
	if (window.scrollY >= 871) {
		// Begin animation
		if (!animationOneIntervalId) {
			let currentSlide = 0;
			animationOneIntervalId = setInterval(()=>{
				if (currentSlide === 0) {
					slideChange('animate1', 'animate2');
					currentSlide += 1;
				} else if(currentSlide === 1) {
					slideChange('animate2', 'animate1');
					currentSlide += 1;
				} else if(currentSlide === 2) {
					slideChange('animate1', 'animate2');
					clearInterval(animationOneIntervalId);
				}
			}, 5000);
		}
	}
	if (window.scrollY >= 871) {
		// Begin animation
		if (!animationTwoIntervalId) {
			animationTwoIntervalId = setInterval(()=>{
				if (currentSlide === 0) {
					slideChange('animate3', 'animate4');
					currentSlide += 1;
				} else if(currentSlide === 1) {
					slideChange('animate4', 'animate3');
					currentSlide += 1;
				} else if(currentSlide === 2) {
					slideChange('animate3', 'animate4');
					clearInterval(animationTwoIntervalId);
				}
			}, 5000);
		}
	}
	if (window.scrollY >= 871) {
		// Begin animation
		if (!animationThreeIntervalId) {
			animationThreeIntervalId = setInterval(()=>{
				if (currentSlide === 0) {
					slideChange('animate5', 'animate6');
					currentSlide += 1;
				} else if(currentSlide === 1) {
					slideChange('animate6', 'animate5');
					currentSlide += 1;
				} else if(currentSlide === 2) {
					slideChange('animate5', 'animate6');
					clearInterval(animationThreeIntervalId);
				}
			}, 5000);
		}
	}
};