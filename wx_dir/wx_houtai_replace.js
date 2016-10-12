// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://zb.weixin.qq.com/nearby/html/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.info("启动了");
    
    var sName = window.location.href;
    
    try{
        if(sName.indexOf("manage.html") > 0){
            if(sName.indexOf("?tab=") < 0){
                return false;
            }
            var tiger_data = JSON.parse(window.sessionStorage.getItem("tiger_data"));
            if(tiger_data){
                fnD(tiger_data);
            }else{
                fnA();
            }

        }
        if(sName.indexOf("/edit.html?deviceId")>0){
            fnE();
        }
        if(sName.indexOf("edit.html?pageId")>0){
            fnB();
        }
        if(sName.indexOf("success.html")>0){
            fnC();
        }
        
    }catch(exception){
        window.sessionStorage.removeItem("tiger_data");
        alert("发生了错误,请检查");
        console.error(exception);
    }
    
    // 跳转
    function fnE(){
        setTimeout(function(){
            var timer = setInterval(function(){
                if(document.querySelector("a[href*='/nearby/html/page/edit.html']")){
                    clearInterval(timer);
                    var sUrl = document.querySelector("a[href*='/nearby/html/page/edit.html']").href;
                    window.location.href = sUrl;
                }
            }, 1000);
        }, 1000);
    }
    
    // 成功 回去初始页
    function fnC(){
        setTimeout(function(){
            window.location.href = "https://zb.weixin.qq.com/nearby/html/device/manage.html?tab=unbind";
        }, 1000);
    }
    
    
    // 执行编辑
    function fnB(){
        setTimeout(function(){
        
            var tiger_data = JSON.parse(window.sessionStorage.getItem("tiger_data"));

            var timer = setInterval(function(){
                if($("#desc_edit").length > 0){
                    clearInterval(timer);
                    /*
                    if(tiger_data.bool == "1"){
                          $("#desc_edit").val(tiger_data.sTitle);
                    }
                    if(tiger_data.bool == "2"){
                          $("#desc_edit").val(tiger_data.value);
                    }
                    if(tiger_data.bool == '3'){
                          $("#page_url").val(tiger_data.value);
                    }
                    */
                    
                    // 6786867
                    
                    var fn = fnSwitchInvoking(tiger_data.bool);
                    fn();
                    
                    //fireKeyEvent(document.getElementById("desc_edit"), "keyup", 13);
                    $("#save_button").click();
                    
                    setTimeout(function(){
                        window.location.href = "https://zb.weixin.qq.com/nearby/html/device/manage.html?tab=unbind";
                    }, 3000);
                }
            }, 1000);

            
            function fnSwitchInvoking(s){
                var fn = null;
                switch(s){
                    case '1': fn = fnB_1;
                        break;
                    case '2': fn = fnB_2;
                        break;
                    case '3': fn = fnB_3;
                        break;
                    default:
                        alert('发生了不可预知的错误，联系测试人员');
                        break;
                }
                return fn;
            }
            
            function fnB_1(){
                  $("#desc_edit").val(tiger_data.sTitle);
                  fireKeyEvent(document.getElementById("desc_edit"), "keyup", 13);
            }
            function fnB_2(){
                  $("#desc_edit").val(tiger_data.value);
                  fireKeyEvent(document.getElementById("desc_edit"), "keyup", 13);
            }
            function fnB_3(){
                  $("#page_url").val(tiger_data.sTitle);
                  fireKeyEvent(document.getElementById("page_url"), "keyup", 13);
            }
            
        }, 1000);
        
    }
    
    
    function fireKeyEvent(el, evtType, keyCode){
        var evtObj;

        evtObj = document.createEvent('UIEvents');
        evtObj.initUIEvent( evtType, true, true, window, 1 );
                
        Object.defineProperty(evtObj,"keyCode",{value:keyCode});
  
        el.dispatchEvent(evtObj);
    }
    
    // 开始 循环跑 
    function fnD(data){

        if(data.device_list.length === 0){
            window.sessionStorage.removeItem("tiger_data");
            alert("Running End!");
            window.location.reload();
            return false;
        }
        
        var iNum = data.device_list.shift();
        if(!iNum){
            return false;
        }
        
        $("#fuzzy_search").val(iNum);
        $("#search_icon").click();
        
        setTimeout(function(){
               var timer = setInterval(function(){
                   if($("#device_list > tr > td:nth-child(5) > a")){
                       clearInterval(timer);
                       // 判定 是 统一值 还是 device_id
                       var sValue = null;
                       if(data.bool == "2"){
                           sValue = iNum;
                       }
                       // 重新 记录数组
                       var obj = {
                           "device_list": data.device_list,
                           "sTitle": data.sTitle,
                           "bool": data.bool,
                           "value": sValue,
                       };
                       window.sessionStorage.setItem("tiger_data", JSON.stringify(obj));
                       var sUrl = document.querySelector("a[href*='/nearby/html/device/edit.html']").href;
                       window.location.href = sUrl;
                   }
               }, 1000);
        }, 1000);
        
        
    }
    
    // 初始化框子
    function fnA(){
    
        var oTextarea = $("<textarea id='tiger_js_textarea' placeholder='请输入搜索信息,按逗号或空格分割' style='width: 100%;height:100px;margin: 5px;'></textarea>");
        var oSelect = $("<select id='tiger_js_select'>"+"<option value='1' selected>统一标题</option>"+"<option value='2'>设备号</option>"+"<option value='3'>修改url</option>"+"</select>");
        var oInt = $("<input id='tiger_js_input' style='display: block;width: 200px;margin: 5px;height:40px;line-height: 40px;' value='' placeholder='请输入统一内容' />");
        var obtn = $("<button id='tiger_js_button' style='height:30px;width:120px;margin: 5px;display: block;'>确认开始执行</button>");
        $(".mod-weixin-area__body_padding").before(oTextarea);
        $(".mod-weixin-area__body_padding").before(oSelect);
        $(".mod-weixin-area__body_padding").before(oInt);
        $(".mod-weixin-area__body_padding").before(obtn);

        // 下拉框
        $("#tiger_js_select").on("change", function(){
            if(oSelect.val() == 1 || oSelect.val() == 3){
                $('#tiger_js_input').css("display", 'block');
            }else{
                $('#tiger_js_input').css("display", 'none');
            }
        });

        // 按钮
        $('#tiger_js_button').on("click", function(){
            console.log("执行");
            var sTextarea = $("#tiger_js_textarea").val(),
                nBool = $("#tiger_js_select").val(),
                sInt = null,
                iValue = null;
            
            var aDevice = sTextarea.split(/ |,/);
            var iNum = aDevice.shift();
            // 下拉 统一输入
            if(nBool == 1 || nBool == 3){
                sInt = $("#tiger_js_input").val();
                if(!sInt){
                      alert("nmzz, 请输入统一内容");
                      return false;
                }
            }else{
                iValue = iNum;
            }

            // 1002023319,1002023298,1002024616,1002024192,1002023613,1002022883,1002024509
            // 6786867,6786866,6786865,6786864,6786863,6786858
            // 6786861,6786867,6786866,6786823,6786822
            // 6786866,6786861,6786828,6786823,6786822,6786817

            $("#fuzzy_search").val(iNum);
            $("#search_icon").click();
            
            var timer = setInterval(function(){
                
                if($("#device_list > tr > td:nth-child(5) > a")){
                    clearInterval(timer);
                    
                    if(!iNum){
                        alert("nmzz, 请输入搜索信息,按逗号或空格分割");
                        return false;
                    }
                    
                    var obj = {
                         "device_list": aDevice,
                         "sTitle": sInt,
                         "bool": nBool,
                         "value": iValue,
                    };
                    window.sessionStorage.setItem("tiger_data", JSON.stringify(obj));
                    var sUrl = document.querySelector("a[href*='/nearby/html/device/edit.html']").href;
                    window.location.href = sUrl;
                }
            }, 1000);
            
        });
    }
    
    
})();