
$(".shareBtn").mousemove(function() {
    $(".share-bg").css("display","block");
});

$(".share-bg").mousemove(function(){
    $(".share-bg").css("display","none");
});



$(".bm-btn").click(function(){
    $(".bm-mask").css("display","none");
});


//slide2字体滚动
var box = document.getElementById('box');
var scroll_text1 = document.getElementById('scroll_text1');

var index=0;
var css={left:'100%'}

$("#scroll_text1").animate(css,30000,rowBack)

function rowBack(){
    if(css.left==='100%'){
        css.left='-170%';
        $("#scroll_text1").animate(css,1,rowBack);

    }else if(css.left==='-170%'){
        css.left='90%';
        $("#scroll_text1").animate(css,30000,rowBack);
    }
}

$("#box").on("click",function(){
    index++;
    if(index%2==0){
        $("#scroll_text1").animate(css,15000,rowBack);
    }else {
        $("#scroll_text1").stop();
    }
});

// 表单验证
$(function () {
var parmas={};
var list={};
var activity=[];



$(".bschool").click(function () {
    // $.each($('input:checkbox:checked'),function(){
    //     activity.push($(this).val())
    // });
    // var isChecked1 = $('.activity1').prop('checked');
    var isChecked2 = $('.activity2').prop('checked');
    var isChecked3 = $('.activity3').prop('checked');
    $(".select").css("display","none"); 
    var txt="";
    // if(isChecked1===true){
    //     activity.push('校企合作返校工作会谈')
    // }
    if(isChecked2===true){
        activity.push('建校65周年庆祝大会')
    }
    if(isChecked3===true){
        activity.push('交响音乐史诗-创造太阳')
    }
    Array.prototype.toString = function () { 
        return this.join(',');
    };
    var activitys=activity.toString();
    parmas.name=$("#name").val();
    parmas.college=$("#College").val();
    parmas.major=$("#major").val();
    parmas.phone=$("#telephone").val();
    parmas.togetherNum=$("#peopleNum").val();
    // parmas.hotel=$("#hotel").val();
    parmas.enrollmentYear=$("#time").val();

    parmas.remark=$("#message").val();
    parmas.activityName=activitys;
    parmas.workUnit=$("#workUnit").val();
    console.log(parmas);
    if(parmas.name==""){
        $.alert("姓名不能为空");
        return false;
    }
    if(parmas.phone==""){
        $.alert("手机号不能为空");
        return false;
    }
    
    // list.phone=$("#telephone").txet();
    

    $.ajax({
        type : "POST",
        contentType: "application/json;charset=UTF-8",
        url : "http://v31.cycloud.net/invitation/api/invitation/save",
        data : JSON.stringify(parmas),
        success : function(result) {
            if(result.success===true){
                $(".bm-mask").css("display","block");
                $("input").val("");
                $("#message").val("");
                $('.activityName').prop('checked',false);
                activity=[];
            }else{
                $.alert("手机号已存在，请勿重复提交");
                $("input").val("");
                $("#message").val("");
                $('.activityName').prop('checked',false);
                activity=[];
            }
        }
    });

})

$("#telephone").blur(function(){
    list.phone=$(this).val();
    $.ajax({
        type : "POST",
        contentType: "application/json;charset=UTF-8",
        url : "http://v31.cycloud.net/invitation/api/invitation/findPhone",
        data : JSON.stringify(list),
        success : function(result) {
            if(result.success===true){
                $.alert("手机号已存在");
            }
        }
    });
});

$("#aBox").click(function(){
    $(".select").css("display","block");
});

    

var activityList=[];
$(".select_btn").click(function(){
    // var isChecked1 = $('.activity1').prop('checked');
    var isChecked2 = $('.activity2').prop('checked');
    var isChecked3 = $('.activity3').prop('checked');
    $(".select").css("display","none"); 
    var txt="";
    // if(isChecked1===true){
    //     txt1="<1>"
    // }else{
    //     txt1=""
    // }
    if(isChecked2===true){
        txt2="<1>"
    }else{
        txt2=""
    }
    if(isChecked3===true){
        txt3="<2>"
    }else{
        txt3=""
    }
    var txt=txt2+txt3;
    
    $("#activityName").val(txt);
    
});


})

//背景音乐   

var audio = document.getElementById("music");
music_state = 1;
// audio.play();

document.addEventListener('DOMContentLoaded', function () {
    function audioAutoPlay() {
        audio.play();
        document.addEventListener("WeixinJSBridgeReady", function () {
            audio.play();
        }, false);
    }
    audioAutoPlay();
});
// 音乐按钮
$("#btn-music").click(function(){
if(music_state){
    audio.pause();
    music_state = 0;
    $("#btn-music-off").removeClass("hide");
    $("#btn-music-on").addClass("hide");
}else{
    audio.play();
    music_state = 1;
    $("#btn-music-on").removeClass("hide");
    $("#btn-music-off").addClass("hide");
}
});

//判断是否在微信中打开
    
// function is_weixn(){
//     var ua = navigator.userAgent.toLowerCase();
//     if(ua.match(/MicroMessenger/i)=="micromessenger") {
//         return true;
//     } else {
//         return false;
//     }
// }


//安卓手机弹出键盘时遮挡输入框
//telephone  time  activityName  workUnit  peopleNum  message swiper-slide5  name  College  major


var ele=document.getElementById("formBox");
var currentHeight=document.body.clientHeight;
console.log(currentHeight);


window.addEventListener('resize',function(){
    var eleHeight=document.documentElement.clientHeight||document.body.clientHeight;
        if(currentHeight>eleHeight){
            $("input").blur(function(){
                // $(".swiper-slide5").css("margin-top","0px");
                ele.style.top=0+"px";
            })
            $("#name").focus(function(){
                ele.style.top=0+"px";
            });
            $("#College").focus(function(){
                ele.style.top=0+"px";
                
            });
            
            $("#major").focus(function(){
                ele.style.top=0+"px";
                
            });
            
            $("#telephone").focus(function(){
                ele.style.top=-30+"px";
            });
            
            $("#time").focus(function(){
                ele.style.top=-60+"px";
            });
            
            $("#activityName").focus(function(){
                ele.style.top=-90+"px";
            });
            
            $("#workUnit").focus(function(){
                ele.style.top=-110+"px";
            });
            
            $("#peopleNum").focus(function(){
                ele.style.top=-150+"px";
            });
            
            $("#message").focus(function(){
                ele.style.top=-180+"px";
            });
            
        }else{
            ele.style.top=0+"px";
        }
    })

