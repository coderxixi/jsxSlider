# jsxslider

 原生javascript 实现的滑块拼图

 ## 使用

 ```js
 npm i jsxslider

 import captcha from "jsxslider"
 
  new captcha({
    el:'元素',
    success:'成功的回调函数',
    fail:'失败都回调函数',
     //自定义校验
    customVerification:()=>{
        return new Promise((resolve,reject)=>{
             setTimeout(()=>{
             resolve(Math.random()*10)
             },2000)
             
        })
      }
  })

 ```