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
document.querySelector('#animate1').style.transition = "opacity 1000ms ease";
document.querySelector('#animate2').style.opacity = '0';
document.querySelector('#animate2').style.transition = "opacity 1000ms ease";
document.querySelector('#animate3').style.opacity = '1';
document.querySelector('#animate3').style.transition = "opacity 1000ms ease";
document.querySelector('#animate4').style.opacity = '0';
document.querySelector('#animate4').style.transition = "opacity 1000ms ease";
document.querySelector('#animate5').style.opacity = '1';
document.querySelector('#animate5').style.transition = "opacity 1000ms ease";
document.querySelector('#animate6').style.opacity = '0';
document.querySelector('#animate6').style.transition = "opacity 1000ms ease";
window.onscroll = function (e) {
	if (window.scrollY >= 871) {
		// Begin animation
		if (!animationOneIntervalId) {
			let currentScreen = 0;
			animationOneIntervalId = setInterval(()=>{
				let secOneSlideOne = document.querySelector('#animate1');
				let secOneSlideTwo = document.querySelector('#animate2');
				if (currentScreen === 0) {
					secOneSlideOne.style.height = 'auto';
					secOneSlideOne.style.opacity = '1';
					secOneSlideTwo.style.height = '0';
					secOneSlideTwo.style.opacity = '0'
					currentScreen += 1;
				} else if(currentScreen === 1) {
					secOneSlideOne.style.height = '0';
					secOneSlideOne.style.opacity = '0';
					secOneSlideTwo.style.height = 'auto';
					secOneSlideTwo.style.opacity = '1'
					currentScreen += 1;
				} else if(currentScreen === 2) {
					secOneSlideOne.style.height = 'auto';
					secOneSlideOne.style.opacity = '1';
					secOneSlideTwo.style.height = '0';
					secOneSlideTwo.style.opacity = '0'
					clearInterval(animationOneIntervalId);
				}
			}, 5000);
		}
	}
	if (window.scrollY >= 871) {
		// Begin animation
		if (!animationTwoIntervalId) {
			animationTwoIntervalId = setInterval(()=>{
				let secTwoSlideOne = document.querySelector('#animate3');
				let secTwoSlideTwo = document.querySelector('#animate4');
				if (secTwoSlideOne.style.opacity == '0') {
					secTwoSlideOne.style.height = 'auto';
					secTwoSlideOne.style.opacity = '1';
					secTwoSlideTwo.style.height = '0';
					secTwoSlideTwo.style.opacity = '0'
				} else {
					secTwoSlideOne.style.height = '0';
					secTwoSlideOne.style.opacity = '0';
					secTwoSlideTwo.style.height = 'auto';
					secTwoSlideTwo.style.opacity = '1'
				}
			}, 2500);
		}
	}
	if (window.scrollY >= 871) {
		// Begin animation
		if (!animationThreeIntervalId) {
			animationThreeIntervalId = setInterval(()=>{
				let secThreeSlideOne = document.querySelector('#animate5');
				let secThreeSlideTwo = document.querySelector('#animate6');
				if (secThreeSlideOne.style.opacity == '0') {
					secThreeSlideOne.style.height = 'auto';
					secThreeSlideOne.style.opacity = '1';
					secThreeSlideTwo.style.height = '0';
					secThreeSlideTwo.style.opacity = '0'
				} else {
					secThreeSlideOne.style.height = '0';
					secThreeSlideOne.style.opacity = '0';
					secThreeSlideTwo.style.height = 'auto';
					secThreeSlideTwo.style.opacity = '1'
				}
			}, 2500);
		}
	}
};