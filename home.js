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
// document.querySelector('#animate1').style.opacity = '0';
// document.querySelector('#animate2').style.opacity = '1';
// document.querySelector('#animate3').style.opacity = '0';
// document.querySelector('#animate4').style.opacity = '1';
// document.querySelector('#animate5').style.opacity = '0';
// document.querySelector('#animate6').style.opacity = '1';
// window.onscroll = function (e) {
// 	if (window.scrollY >= 871) {
// 		// Begin animation
// 		if (!animationOneIntervalId) {
// 			animationOneIntervalId = setInterval(()=>{
// 				let secOneSlideOneOpacity = document.querySelector('#animate1').style.opacity;
// 				let secOneSlideTwoOpacity = document.querySelector('#animate2').style.opacity;
// 				document.querySelector('#animate1').style.opacity = String(Number(!Boolean(Number(secOneSlideOneOpacity))));
// 				document.querySelector('#animate2').style.opacity = String(Number(!Boolean(Number(secOneSlideTwoOpacity))));
// 			}, 2500);
// 		}
// 	}
// 	if (window.scrollY >= 871) {
// 		// Begin animation
// 		if (!animationTwoIntervalId) {
// 			animationTwoIntervalId = setInterval(()=>{
// 				let secTwoSlideOneOpacity = document.querySelector('#animate3').style.opacity;
// 				let secTwoSlideTwoOpacity = document.querySelector('#animate4').style.opacity;
// 				document.querySelector('#animate3').style.opacity = String(Number(!Boolean(Number(secTwoSlideOneOpacity))));
// 				document.querySelector('#animate4').style.opacity = String(Number(!Boolean(Number(secTwoSlideTwoOpacity))));
// 			}, 2500);
// 		}
// 	}
// 	if (window.scrollY >= 871) {
// 		// Begin animation
// 		if (!animationThreeIntervalId) {
// 			animationThreeIntervalId = setInterval(()=>{
// 				let secThreeSlideOneOpacity = document.querySelector('#animate5').style.opacity;
// 				let secThreeSlideTwoOpacity = document.querySelector('#animate6').style.opacity;
// 				document.querySelector('#animate5').style.opacity = String(Number(!Boolean(Number(secThreeSlideOneOpacity))));
// 				document.querySelector('#animate6').style.opacity = String(Number(!Boolean(Number(secThreeSlideTwoOpacity))));
// 			}, 2500);
// 		}
// 	}
// };