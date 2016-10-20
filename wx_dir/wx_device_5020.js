// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://yaoqianhu.xianlaohu.com/tiger/admin/*
// @grant        none
// ==/UserScript==

// 修改设备列表 50/20

(function() {
    'use strict';

    
    var _$ = jQuery;
    
    _$(".breadcrumbs").after(_$("<button type='button' class='hz_tiger_btn'>开始</button>"));
    _$(".breadcrumbs").after(_$("<input type='text' style='width: 400px;' placeholder='删除请填入1,否则别写' class='hz_tiger_input' />"));
    _$(".breadcrumbs").after(_$("<textarea class='hz_tiger_text' style='height: 100px;width:100%;' placeholder='请输入设备id'></textarea>"));
    _$(".breadcrumbs").after(_$("<textarea class='hz_tiger_text_sn' style='height: 100px;width:100%;' placeholder='请输入设备sn'></textarea>"));
    
    
    var aJq = [];
    _$(".hz_tiger_btn").on("click", function(){
     
            var sText = _$('.hz_tiger_text').val().trim();
            var sSn = _$(".hz_tiger_text_sn").val().trim();
            if(!sText && !sSn){
                alert("请在输入框输入内容");
                return '';
            }
           
            var aText = null;
            if(sText){
                aText = sText.split(/ |,/);
            }else{
                aText = sSn.split(/ |,/);
            }
            
        
           var url = '/tiger/admin/doChangeDeviceRabate/';
           var s = '';
           if(_$(".hz_tiger_input").val()){
               s = 1;
           }
        
           for(var i in aText){
               var new_url = (url + aText[i]);
               if(s){
                   new_url += "/1";
               }
               fnA(new_url);
           }
           
           _$.when(aJq).always(function(){
               console.log("完成");
           }).done(function(res){
               aJq = [];
               console.log(res);
               alert("成功,详情:请打开控制台查看");
               for(var i in res){
                   res[i].done(function(f){
                      var a = JSON.parse(f);
                       if(a.code !== 0){
                            console.log(a.msg, res[i]);
                           alert("第"+(i+1)+"个,返回"+a.msg);
                       }
                   });
               }
           }).fail(function(xhr, errorText, errorStatus){
               aJq = [];
               alert("有失败项,请打开控制台查看");
               console.log(xhr);
           });
        
    });
    
    function fnA(url){
         var promise = jQxhr(url);
         aJq.push(promise);
    }
    
    function jQxhr(url){
         return _$.ajax({
              "url": url,
              "data": {},
              "type": "GET",
         });
    }
    
    
    

})();