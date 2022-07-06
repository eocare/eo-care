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

let animationIntervalId;
document.querySelector('.animate-1').style.opacity = '0';
document.querySelector('.animate-2').style.opacity = '1';
window.onscroll = function (e) {
	if (window.scrollY >= 871) {
		// Begin animation
		if (!animationIntervalId) {
			animationIntervalId = setInterval(()=>{
				let slideOneOpacity = document.querySelector('.animate-1').style.opacity;
				let slideTwoOpacity = document.querySelector('.animate-2').style.opacity;
				document.querySelector('.animate-1').style.opacity = String(Number(!Boolean(Number(slideOneOpacity))));
				document.querySelector('.animate-2').style.opacity = String(Number(!Boolean(Number(slideTwoOpacity))));
			}, 2500);
		}
	}
};