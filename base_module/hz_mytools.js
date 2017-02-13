

import $ from 'jquery';

// 检测访问来源,pc || wep
const DETECTMOD = () => {
    let n = window.navigator.userAgent;
    if( n.match(/Android/i)  
        || n.match(/webOS/i)  
        || n.match(/iPhone/i)  
        || n.match(/iPad/i)  
        || n.match(/iPod/i)  
        || n.match(/BlackBerry/i)  
        || n.match(/Windows Phone/i)  
    ){  
        return true;  
    }else {  
        return false;  
    }  
}

const TOOLS = {
	detechmod: DETECTMOD,
}


// 手机端调试方式,转发信息
const LOGGER_AJAX = (infos) => {
    let obj = {
        url: "/logger/infos",
        data: infos,
        type: "GET",
    }
    $.ajax(obj);
}


exports.loggerAjax = LOGGER_AJAX;

export default TOOLS;
