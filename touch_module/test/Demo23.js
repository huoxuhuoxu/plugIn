// 触摸库测试

import TOUCH from '../hz_touch.js';
import tools, { loggerAjaxJsonp } from '../hz_mytools.js';

// 单点无跟随测试
const TestSingleTouch = () => {
	try{
		TOUCH.singleTouch('body', {
			touchmove: (d, end) => {
				alert(d);
				end();
			}
		});
	}catch(err){
		loggerAjaxJsonp(err);
	}
	
}

// 单点跟随测试
const TestSingleTouchFollow = () => {
	TOUCH.singleFollowTouch("body", {
		touchmove: ({x, y}, e) => {
			loggerAjaxJsonp({x, y});
			e.preventDefault();
		},
		touchstart: (e) => {
			e.preventDefault();
		},
		touchend: (e) => {
			e.preventDefault();
		}
	});
}

// 多点手势跟随
const TestMultipleTouchFollow = () => {
	let oImage = document.getElementsByClassName('image_test')[0],
		iScale = 1,
		iNewScale = null;
	TOUCH.multipleFollowTouch('body', {
		touchstart: (e) => {
			e.preventDefault();
		},
		touchmove: ({diff}, e) => {
			let iDiff = (diff / 100);
			iNewScale = iScale+iDiff;
			iNewScale = iNewScale>=0.5 ? iNewScale : 0.5; 
			oImage.style.transform = "scale("+(iNewScale)+")";
			e.preventDefault();
		},
		touchend: (e) => {
			iScale = iNewScale;
			e.preventDefault();
		}
	});
}


window.onload = function(){

	TestMultipleTouchFollow();

}






