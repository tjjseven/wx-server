/**
 * 以下这段代码是用于根据移动端设备的屏幕分辨率计算出合适的根元素的大小
 * 当设备宽度为375(iPhone6)时，根元素font-size=16px; 依次增大；
 * 限制当为设备宽度大于768(iPad)之后，font-size不再继续增大
 * scale 为meta viewport中的缩放大小
 */
// (function (doc, win) {
//     var docEl = win.document.documentElement;
//     var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
//     /**
//      * ================================================
//      *   设置根元素font-size
//      * 当设备宽度为375(iPhone6)时，根元素font-size=16px;
//      × ================================================
//      */
//     var refreshRem = function () {
//         var clientWidth = win.innerWidth
//             || doc.documentElement.clientWidth
//             || doc.body.clientWidth;
//
//         console.log(clientWidth)
//         if (!clientWidth) return;
//         var fz;
//         var width = clientWidth;
//         fz = 16 * width / 375;
//         docEl.style.fontSize = fz + 'px';
//     };
//
//     if (!doc.addEventListener) return;
//     win.addEventListener(resizeEvt, refreshRem, false);
//     doc.addEventListener('DOMContentLoaded', refreshRem, false);
//     refreshRem();
//
// })(document, window);

//designWidth:设计稿的实际宽度值，需要根据实际设置
//maxWidth:制作稿的最大宽度值，需要根据实际设置
//这段js的最后面有两个参数记得要设置，一个为设计稿实际宽度，一个为制作稿最大宽度，例如设计稿为750，最大宽度为750，则为(750,750)
// ;(function(designWidth, maxWidth) {
//     var doc = document,
//         win = window,
//         docEl = doc.documentElement,
//         remStyle = document.createElement("style"),
//         tid;
//
//     function refreshRem() {
//         var width = docEl.getBoundingClientRect().width;
//         maxWidth = maxWidth || 540;
//         width>maxWidth && (width=maxWidth);
//         var rem = width * 100 / designWidth;
//         remStyle.innerHTML = 'html{font-size:' + rem + 'px;}';
//     }
//
//     if (docEl.firstElementChild) {
//         docEl.firstElementChild.appendChild(remStyle);
//     } else {
//         var wrap = doc.createElement("div");
//         wrap.appendChild(remStyle);
//         doc.write(wrap.innerHTML);
//         wrap = null;
//     }
//     //要等 wiewport 设置好后才能执行 refreshRem，不然 refreshRem 会执行2次；
//     refreshRem();
//
//     win.addEventListener("resize", function() {
//         clearTimeout(tid); //防止执行两次
//         tid = setTimeout(refreshRem, 300);
//     }, false);
//
//     win.addEventListener("pageshow", function(e) {
//         if (e.persisted) { // 浏览器后退的时候重新计算
//             clearTimeout(tid);
//             tid = setTimeout(refreshRem, 300);
//         }
//     }, false);
//
//     if (doc.readyState === "complete") {
//         doc.body.style.fontSize = "16px";
//     } else {
//         doc.addEventListener("DOMContentLoaded", function(e) {
//             doc.body.style.fontSize = "16px";
//         }, false);
//     }
// })(750, 750);


(function(doc,win){
    var docEl =doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function(){
            var clientWidth = docEl.clientWidth>750 ? 750 : docEl.clientWidth;
            if (!clientWidth) {return};
            docEl.style.fontSize = 100 * (clientWidth/750) + 'px';
        };
    recalc();
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document,window)

// (function flexible (window, document) {
//     var docEl = document.documentElement
//     var dpr = window.devicePixelRatio || 1
//
//     // adjust body font size
//     function setBodyFontSize () {
//         if (document.body) {
//             document.body.style.fontSize = (12 * dpr) + 'px'
//         }
//         else {
//             document.addEventListener('DOMContentLoaded', setBodyFontSize)
//         }
//     }
//     setBodyFontSize();
//
//     // set 1rem = viewWidth / 10
//     function setRemUnit () {
//         var rem = docEl.clientWidth / 10
//         docEl.style.fontSize = rem + 'px'
//     }
//
//     setRemUnit()
//
//     // reset rem unit on page resize
//     window.addEventListener('resize', setRemUnit)
//     window.addEventListener('pageshow', function (e) {
//         if (e.persisted) {
//             setRemUnit()
//         }
//     })
//
//     // detect 0.5px supports
//     if (dpr >= 2) {
//         var fakeBody = document.createElement('body')
//         var testElement = document.createElement('div')
//         testElement.style.border = '.5px solid transparent'
//         fakeBody.appendChild(testElement)
//         docEl.appendChild(fakeBody)
//         if (testElement.offsetHeight === 1) {
//             docEl.classList.add('hairlines')
//         }
//         docEl.removeChild(fakeBody)
//     }
// }(window, document))

// weui.alert('alert');

var btnSubmit = document.querySelector('.sub_form')
if(btnSubmit){
    btnSubmit.onclick = function () {
        weui.dialog({
            title: '已点亮祝福',
            content: '<div class="dialog_contemt"><p class="pop_school">我是清华大学校友</p><p class="pop_addr">我在湖北</p><p>祝福母校：<span>越来越好</span></p>' +
            '<div class="img_div"><img src="./img/123.png" alt=""></div></div>',
            className: 'pop_div',
            buttons: [{
                label: '返回首页',
                type: 'default',
                onClick: function () {
                    // alert('取消')
                }
            }, {
                label: '保存图片分享',
                type: 'primary',
                onClick: function () {
                    // alert('确定')
                    /* 保存HTML为图片 */
                    document.querySelector('.weui-dialog__ft').style.display = 'none'
                    // html2canvas(document.querySelector(".weui-dialog")).then(function(canvas){
                    //     // var imgUri = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); // 获取生成的图片的url
                    //     // window.location.href= imgUri;
                    //     // console.log(imgUri)
                    //     var img = new Image(), dataUrl = canvas.toDataURL("image/png");
                    //     img.src = dataUrl;
                    //     // img.onload = function () {
                    //     //     dataUrl = canvas.toDataURL("image/png")
                    //     //s }
                    //     document.body.appendChild(img)
                    //
                    // });

                    convert2canvas()
                    function convert2canvas() {

                        var cntElem = document.querySelector(".weui-dialog__bd");

                        var shareContent = cntElem;//需要截图的包裹的（原生的）DOM 对象
                        var width = shareContent.offsetWidth; //获取dom 宽度
                        var height = shareContent.offsetHeight; //获取dom 高度
                        var canvas = document.createElement("canvas"); //创建一个canvas节点
                        var scale = 2; //定义任意放大倍数 支持小数
                        canvas.width = width * scale; //定义canvas 宽度 * 缩放
                        canvas.height = height * scale; //定义canvas高度 *缩放
                        var content = canvas.getContext("2d")
                        content.scale(scale,scale); //获取context,设置scale
                        var rect = shareContent.getBoundingClientRect();//获取元素相对于视察的偏移量
                        content.translate(-rect.left,-rect.top);//设置context位置，值为相对于视窗的偏移量负值，让图片复位
                        var opts = {
                            dpi: window.devicePixelRatio*2,
                            scale: scale, // 添加的scale 参数
                            canvas: canvas, //自定义 canvas
                            // logging: true, //日志开关，便于查看html2canvas的内部执行流程
                            width: width, //dom 原始宽度
                            height: height,
                            useCORS: true // 【重要】开启跨域配置
                        };

                        html2canvas(shareContent, opts).then(function (canvas) {

                            var context = canvas.getContext('2d');
                            // 【重要】关闭抗锯齿
                            context.mozImageSmoothingEnabled = false;
                            context.webkitImageSmoothingEnabled = false;
                            context.msImageSmoothingEnabled = false;
                            context.imageSmoothingEnabled = false;

                            // 【重要】默认转化的格式为png,也可设置为其他格式
                            // var img = Canvas2Image.convertToJPEG(canvas, canvas.width, canvas.height);

                            var img = new Image(), dataUrl = canvas.toDataURL("image/png");
                            img.src = dataUrl;
                            img.width = window.innerWidth;
                            img.height = window.innerHeight;
                            document.querySelector('.form').style.display = 'none'
                            document.querySelector('.sub_form').style.display = 'none'
                            document.querySelector('.shareInfo').style.display = 'block'
                            document.body.appendChild(img);


                            // console.log(document.querySelector('img'))


                        });
                    }



                }
            }]
        });
    }

}


// // 主动关闭
// var $dialog = weui.dialog({});
// $dialog.hide(function(){
//     console.log('`dialog` has been hidden');
// });