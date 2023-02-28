  /** @type {HTMLCanvasElement} */

import { resolve } from "path";

 
 // 获取指定区间内的随机数
 export function getRandomNumberByRange(start:number,end:number){
  return Math.round(Math.random()*(end-start)+start);
}


 // 创建元素
 export function createElement<T>(tagName:string){
  return document.createElement(tagName) as T
}

 // 创建画布

 export function createCanvas(width:number,height:number){
  let canvas=createElement<HTMLCanvasElement>('canvas');
  canvas.width=width;
  canvas.height=height;
  return canvas;
}

  // 获取随机图片
  export function getRandomImg(){
    // return new Promise((resolve,rejects))
    // 这个网站可以生成随机图片
    return 'https://picsum.photos/300/150/?image='+getRandomNumberByRange(0,100);
}

// 创建图片
export function createImg(onload:()=>void){
    const img=createElement<HTMLImageElement>('img');
    img.crossOrigin='Anonymous';
    img.onload=onload;
    img.onerror=()=>{
        img.src=getRandomImg();
    }
    img.src=getRandomImg();
    return img;
}

// 添加样式
export function addClass(tag:HTMLElement,className:string){
    tag.classList.add(className);
}
// 移除样式
export function removeClass(tag:HTMLElement,className:string){
    tag.classList.remove(className);
}

// 绘制
export function draw(ctx:any,operation:string,x:number,y:number,l:number,r:number){
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x+l/2,y);
    ctx.arc(x+l/2,y-r+2,r,0,2*Math.PI);
    ctx.lineTo(x+l/2,y);
    ctx.lineTo(x+l,y);
    ctx.lineTo(x+l,y+l/2);
    ctx.arc(x+l+r-2,y+l/2,r,0,2*Math.PI);
    ctx.lineTo(x+l,y+l/2);
    ctx.lineTo(x+l,y+l);
    ctx.lineTo(x,y+l);
    ctx.lineTo(x,y);
    ctx.fillStyle='#fff';
    ctx[operation]();
    ctx.beginPath();
    ctx.arc(x,y+l/2,r,1.5*Math.PI,0.5*Math.PI);
    ctx.globalCompositeOperation='xor';
    ctx.fill();
}

// 求和
export function sum(x:number,y:number){
    return x+y;
}
// 求平方
export function square(x:number){
    return x*x;
}