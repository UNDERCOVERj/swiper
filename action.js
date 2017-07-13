/*
* @Author: junjie.le
* @Date:   2017-07-12 18:03:10
* @Last Modified by:   junjie.le
* @Last Modified time: 2017-07-13 12:31:07
*/

'use strict';
function Carousel(count) {
    this.count = count;
    this.curPage = 1;
    this.carouselFlag = true;
    this.timer = null;
    this.bodyWidth = this.computeBodyWidth();
    this.open = document.querySelector('.open');
    this.nav = document.querySelector('.right-nav');
    this.img = document.querySelectorAll('.carousel-img')[1];
    this.imgs = document.querySelectorAll('.carousel-img');
    this.wrapper = document.querySelector('.carousel');
    this.wrapperContent = document.querySelector('.carousel-content-wrapper')
    this.openFlag = false;
    this.ready();
}
Carousel.prototype = {
    ready() {
        this.init();
        this.timer = setInterval(this.nextAction.bind(this), 2000);
        this.initEvents();
    },
    computeBodyWidth() {//计算窗口宽度
        if(document.body) {
            return document.body.clientWidth
        }else {

            return document.documentElement.clientWidth;
        }
    },
    computeImgHeight() {//计算图片高度
        return this.img.offsetHeight;
    },
    init() {
        var imgWidth = this.img.offsetWidth,
            imgHeight = this.img.offsetHeight;
        this.wrapper.style.height = this.bodyWidth*imgHeight/imgWidth + 'px';
        this.imgs.forEach((img) => {
            img.style.width = this.bodyWidth + 'px'//初始化图片大小
        });
        //this.wrapper.style.height = this.computeImgHeight() + 'px';//设置包裹层高度
        this.wrapperContent.style.width = this.bodyWidth*(this.count + 2) + 'px';//设置wrapperContent的宽度
        this.wrapperContent.classList.remove('carousel-content-wrapper-transition');//imp
        this.wrapperContent.style.left = -this.curPage*this.bodyWidth +'px';
    },
    animate(index) {
        var distance = index - this.curPage,
            num = this.count + 2,
            dots = document.querySelectorAll('.carousel-dot-li')
        this.carouselFlag = false;//防止再点击
        this.curPage = index;
        this.wrapperContent.classList.add('carousel-content-wrapper-transition');
        this.wrapperContent.style.left = this.wrapperContent.offsetLeft - distance*this.bodyWidth + 'px'
        if(distance > 0 && this.curPage === 4) {
            setTimeout(() => {
                this.wrapperContent.classList.remove('carousel-content-wrapper-transition');
                this.curPage = 1;
                this.wrapperContent.style.left = -this.curPage*this.bodyWidth + 'px';
                this.carouselFlag = true; 
            }, 600)
        }
        if(distance < 0 && this.curPage === 0) {
            setTimeout(() => {
                this.wrapperContent.classList.remove('carousel-content-wrapper-transition');
                this.curPage = 3;
                this.wrapperContent.style.left = -this.curPage*this.bodyWidth + 'px';
                this.carouselFlag = true; 
            }, 600)
        }
        dots.forEach((e, ind) => {
            if(distance > 0) {
                var flag = this.curPage === 4 ? 1 :this.curPage;
            }else {
                var flag = this.curPage === 0 ? 3 :this.curPage;
            }
            
            if( ind+1 !== flag ) {
                e.classList.remove('carousel-dot-bg')
            }else {
                e.classList.add('carousel-dot-bg')
            }
        })
    },
    nextAction() {
        var num = this.count + 2,
            index = this.curPage < num - 1 ? this.curPage + 1 : 0;
        if(!this.carouselFlag) {
            return 
        }
        this.animate(index);
        clearInterval(this.timer);
        this.timer = setInterval(this.nextAction.bind(this), 2000);
    },
    prevAction() {
        var num = this.count + 2,
            index = this.curPage > 0 ? this.curPage - 1 : num - 1;
        if(!this.carouselFlag) {
            return 
        }
        this.animate(index);
        clearInterval(this.timer);
        this.timer = setInterval(this.nextAction.bind(this), 2000);
    },
    setOpenBtn() {
        if(this.bodyWidth < 890) {
            this.nav.style.display = 'none';
            this.open.innerHTML = '+';
            this.open.style.display = 'block';
        }else {
            this.open.style.display = 'none';
            this.nav.style.display = 'block';
        }
    },
    initEvents() {//事件绑定
        let prevBtn = document.querySelector('.left-btn'),
            nextBtn = document.querySelector('.right-btn'),
            dots = document.querySelectorAll('.carousel-dot-li'),
            resizeTimer = null,
            self =this,
            transitions = {
                'transition':'transitionend',
                'OTransition':'oTransitionEnd',
                'MozTransition':'transitionend',
                'WebkitTransition':'webkitTransitionEnd'
            };
        this.wrapper.onmouseover = () => {//清除动画
            clearInterval(this.timer);
            this.timer = null;
        }
        this.wrapper.onmouseout = () => {
        	if(this.timer) {
    			clearInterval(this.timer);
    			this.timer = null;
    		}
            this.timer = setInterval(this.nextAction.bind(this), 2000);
        }
        this.open.onclick = () => {
            this.openFlag = !this.openFlag;
            if(this.openFlag) {
                this.nav.style.display = 'block';
                this.open.innerHTML = 'x';
            }else {
                this.nav.style.display = 'none';
                this.open.innerHTML = '+'
            }
        }
        this.setOpenBtn();
        prevBtn.onclick = this.prevAction.bind(this);
        nextBtn.onclick = this.nextAction.bind(this);
        for(var t in transitions){
           if( this.wrapperContent.style[t] !== undefined ){
               var transitionEvent=transitions[t];
           }
        }
        transitionEvent && this.wrapperContent.addEventListener(transitionEvent, () => {
            this.carouselFlag = true;            
        });
        for(var i = 0, len = dots.length; i < len; i++) (function(i){//给每个dot添加事件
            dots[i].onclick = () => {
                if(!self.carouselFlag) {
                    return 
                }
                self.animate(i+1);
            }
        })(i)
        this.setOpenBtn();
        window.onresize = () => {
    		this.bodyWidth = this.computeBodyWidth();//重置
            this.setOpenBtn();
    		this.init();
    		this.carouselFlag  =true;
    		if(this.timer) {
    			clearInterval(this.timer);
    			this.timer = null;
    		}
            this.timer = setInterval(this.nextAction.bind(this), 2000);    
        }
    }
}
/*var srcArr = [
    "./img/chuzuchenew1.jpg",
    "./img/shunfengche2.jpg",
    "./img/zhuanchenew3.jpg"
],pArr = [];
srcArr.forEach((e, index) => {
    pArr[index] = new Promise((resolve, reject) => {
        var img = new Image();
        img.src = e;
        img.onload = resolve;
    })
})
Promise.all(pArr).then(() => {
    document.querySelector('.carousel-show').style.display = 'none';
    document.querySelector('.carousel').style.display = 'block';
    var carousel = new Carousel(3);
})*/
//document.querySelector('.carousel-show').style.display = 'none';
    //document.querySelector('.carousel').style.display = 'block';
new Promise((resolve, reject) => {
    var img = new Image();
    img.src = "./img/chuzuchenew1.jpg";
    img.onload = resolve;
}).then(() => {
    document.querySelector('.carousel-show').style.display = 'none';
    document.querySelector('.carousel').style.display = 'block';
    var carousel = new Carousel(3);
})