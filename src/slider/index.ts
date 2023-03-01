import { getRandomNumberByRange, removeClass, createElement, getRandomImg, createCanvas, draw, createImg, addClass } from "@/utils/index"
import { log } from "console";
import {sliderOption} from "./type"
export class Captcha {
    // 构造器
    private el: HTMLElement;
    private success: (number:number) => {};
    private fail: () => {};
    block: any;
    img: any;
    sliderMask: any;
    sliderContainer: any;
    trail: any[] | undefined;
    refreshIcon: any;
    private option:sliderOption
   
    constructor(option:sliderOption,el: HTMLElement, success: () => {}, fail: () => {},private blockCtx: any, private slider: HTMLElement, private canvasCtx: any,  private y: number, private x: number, private ll: number, private r: number, private w: number = 310, private h: number = 155, private l: number,private msgDiv:HTMLElement) {
        this.option=option
        this.el =option.el;
        this.success =option.success;
        this.fail =option.fail;
        this.w = option.w?option.w:w; //canvas宽度
        this.h = option.h?option.h:h; //canvas高度
        this.l =option.l? option.l:42;//滑块边长
        this.r = option.r?option.r: 10;//滑块半径 
        this.ll = this.l + this.r * 2; //滑块的实际边长
        this.x = x;
        this.y = y;
       
    }

    // 初始化
    init() {
        this.initDOM();
        this.initImg();
        this.draw();
        this.bindEvents();
    }

    // 初始化DOM
    initDOM() {
        const canvas = createCanvas(this.w, this.h),
            block = canvas.cloneNode(true) as HTMLCanvasElement,
            captcha=createElement<HTMLElement>('div'),
            sliderContainer = createElement<HTMLDivElement>('div'),
            sliderMask = createElement<HTMLDivElement>('div'),
            slider = createElement<HTMLDivElement>('div'),
            refreshIcon = createElement<HTMLDivElement>('div'),
            sliderIcon = createElement<HTMLSpanElement>('span'),
            msgDiv=createElement<HTMLElement>('div'),
            text = createElement<HTMLSpanElement>('span');
            msgDiv.setAttribute('id','msg');
            captcha.setAttribute('id',"captcha");
            msgDiv.style.width=this.w+'px';
            msgDiv.style.height=this.h+'px';
        block.className = 'block';
        sliderContainer.style.width=this.w+'px';
        sliderContainer.className = 'slider-container';
        sliderMask.className = 'slider-mask';
        slider.className = 'slider';
        refreshIcon.className = 'refresh-icon';
        sliderIcon.className = 'slider-icon';
        text.className = 'slider-text';
        text.innerHTML = '向右滑动滑块填充拼图';
        const el = this.el;
        captcha.appendChild(canvas);
        captcha.appendChild(refreshIcon);
        captcha.appendChild(block);
        slider.appendChild(sliderIcon);
        sliderMask.appendChild(slider);
        sliderContainer.appendChild(sliderMask);
        sliderContainer.appendChild(text);
        captcha.appendChild(sliderContainer);
        captcha.insertAdjacentElement("beforeend",msgDiv)
        el.appendChild(captcha);
      
      
        Object.assign(this, {
            canvas,
            block,
            sliderContainer,
            refreshIcon,
            slider,
            sliderMask,
            sliderIcon,
            text,
            msgDiv,
            canvasCtx: canvas.getContext('2d'),
            blockCtx: block.getContext('2d')
        });
    }

    // 初始化图像
    initImg() {
        const img = createImg(() => {
            this.canvasCtx.drawImage(img, 0, 0, this.w, this.h);
            this.blockCtx.drawImage(img, 0, 0, this.w, this.h);
            const y = this.y - this.r * 2 + 2;
            const imageData = this.blockCtx.getImageData(this.x, y, this.ll, this.ll);
            this.block.width = this.ll;
            this.blockCtx.putImageData(imageData, 0, y);
        });
        this.img = img;
    }

    // 绘画
    draw() {
        this.x = getRandomNumberByRange(this.ll + 10, this.w - (this.ll + 10));
        this.y = getRandomNumberByRange(10 + this.r * 2, this.h - (this.ll + 10));
        draw(this.canvasCtx, 'fill', this.x, this.y, this.l, this.r);
        draw(this.blockCtx, 'clip', this.x, this.y, this.l, this.r);
        this.msgDiv.innerHTML=''
       
    }

    // 清除
    clean() {
        this.canvasCtx.clearRect(0, 0, this.w, this.h);
        this.blockCtx.clearRect(0, 0, this.w, this.h);
        this.block.width = this.w;
    }

    // 绑定事件
    bindEvents() {
        this.el.onselectstart = () => false;
        this.refreshIcon.onclick = () => {
            this.reset();
        }

        let originX: number, originY: number, trail: any[] | undefined = [], isMouseDown = false;
        this.slider.addEventListener('mousedown', function (e) {
            originX = e.x;
            originY = e.y;
            isMouseDown = true;
        })
        document.addEventListener('mousemove', (e) => {
            if (!isMouseDown) {
                return false;
            }
            const moveX = e.x - originX;
            const moveY = e.y - originY;
            if (moveX < 0 || moveX + 38 >= this.w) {
                return false;
            }
            this.slider.style.left = moveX + 'px';
            var blockLeft = (this.w - 40 - 20) / (this.w - 40) * moveX;
            this.block.style.left = blockLeft + 'px';

            addClass(this.sliderContainer, 'slider-container-active');
            this.sliderMask.style.width = moveX + 'px';
            //   trail.push(moveY);
        })
        document.addEventListener('mouseup',async (e) => {
            if (!isMouseDown) {
                return false;
            }
            isMouseDown = false;
            if (e.x == originX) {
                return false;
            }
            removeClass(this.sliderContainer, 'slider-container-active');
            this.trail = trail;
          
           if(this.option.customVerification){
            this.msgDiv.innerHTML='加载中...!'
            addClass(this.msgDiv,'active')
            let res= await this.option.customVerification();
            if(res>=5){
               
                addClass(this.sliderContainer, 'slider-container-success');
                this.success && this.success(parseInt(this.block.style.left));
            }else{
                addClass(this.sliderContainer, 'slider-container-fail');
                this.msgDiv.innerHTML='验证失败!'
                addClass(this.msgDiv,'active')
                this.fail && this.fail();
                setTimeout(() => {
                    this.reset();
                }, 1000);
            }
          
            return
           }

            const spliced = this.verify();
            if (spliced) {
                addClass(this.sliderContainer, 'slider-container-success');
                this.success && this.success(parseInt(this.block.style.left));
            } else {
                addClass(this.sliderContainer, 'slider-container-fail');
                this.msgDiv.innerHTML='验证失败!'
                addClass(this.msgDiv,'active')
                this.fail && this.fail();
                setTimeout(() => {
                    this.reset();
                }, 1000);
            }
        })

        //移动端
        this.slider.addEventListener('touchstart', function (e) {
            originX = e.touches[0].pageX;
            originY = e.touches[0].pageY;
            isMouseDown = true;
        })
        document.addEventListener('touchmove', (e) => {
            if (!isMouseDown) {
                return false;
            }
            const moveX = e.touches[0].pageX - originX;
            const moveY = e.touches[0].pageY - originY;
            if (moveX < 0 || moveX + 38 >= this.w) {
                return false;
            }
            this.slider.style.left = moveX + 'px';
            var blockLeft = (this.w - 40 - 20) / (this.w - 40) * moveX;
            this.block.style.left = blockLeft + 'px';

            addClass(this.sliderContainer, 'slider-container-active');
            this.sliderMask.style.width = moveX + 'px';
            //   trail.push(moveY);
        })
        document.addEventListener('touchend', async(e) => {
            console.log('touchend',e);
            
            if (!isMouseDown) {
                return false;
            }
            isMouseDown = false;
            if (e.changedTouches[0].pageX == originX) {
                return false;
            }
            removeClass(this.sliderContainer, 'slider-container-active');
            if(this.option.customVerification){
                this.msgDiv.innerHTML='加载中...!'
                addClass(this.msgDiv,'active')
                let res= await this.option.customVerification();
                if(res>=5){
                    
                    addClass(this.sliderContainer, 'slider-container-success');
                    this.success && this.success(parseInt(this.block.style.left));
                }else{
                    addClass(this.sliderContainer, 'slider-container-fail');
                    this.msgDiv.innerHTML='验证失败!'
                    addClass(this.msgDiv,'active')
                    this.fail && this.fail();
                    setTimeout(() => {
                        this.reset();
                    }, 1000);
                }
              
                return
               }
            this.trail = trail;
            const spliced = this.verify();
            if (spliced) {
                addClass(this.sliderContainer, 'slider-container-success');
                this.success && this.success(parseInt(this.block.style.left));
            } else {
                addClass(this.sliderContainer, 'slider-container-fail');
                this.msgDiv.innerHTML='验证失败!'
                addClass(this.msgDiv,'active')
                this.fail && this.fail();
                setTimeout(() => {
                    this.reset();
                }, 1000);
            }
        })
    }

    // 重置
    async reset() {
        this.msgDiv.innerHTML='加载中...!'
        this.sliderContainer.className = 'slider-container';
        this.slider.style.left = '0';
        this.block.style.left = 0;
        this.sliderMask.style.width = 0;
        this.msgDiv.className=''
        this.clean();
    //    let res= await getRandomImg();
    //    console.log('res',res);
       
        this.img.src = getRandomImg();
        this.msgDiv.innerHTML=''
        this.draw();
    }
    // 验证
    verify() {
        const left = parseInt(this.block.style.left);
        return Math.abs(left - this.x) < 10; //10表示容错率，值越小，需要拼得越精确
    }
}

