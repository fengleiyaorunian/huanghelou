var map;
function init(){
	// 百度地图API功能
	map = new BMap.Map("allmap");    // 创建Map实例
	map.centerAndZoom(new BMap.Point(114.309052,30.550312),18);  // 初始化地图,设置中心点坐标和地图级别
	//添加地图类型控件
	map.addControl(new BMap.MapTypeControl({
		mapTypes:[
            BMAP_NORMAL_MAP,
            BMAP_HYBRID_MAP
        ]}));	  
	map.setCurrentCity("武汉");          // 设置地图显示的城市
	map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
	
	var size = new BMap.Size(55, 15);
	map.addControl(new BMap.CityListControl({
    anchor: BMAP_ANCHOR_TOP_LEFT,
    offset: size,
}));
	var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});
	var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
	var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //右上角，仅包含平移和缩放按钮
	var navigationControl = new BMap.NavigationControl({
    // 靠左上角位置
    anchor: BMAP_ANCHOR_TOP_LEFT,
    // LARGE类型
    type: BMAP_NAVIGATION_CONTROL_LARGE,
    // 启用显示定位
    enableGeolocation: true
	});
	map.addControl(navigationControl);
  // 添加定位控件
	var geolocationControl = new BMap.GeolocationControl();
	geolocationControl.addEventListener("locationSuccess", function(e){
    // 定位成功事件
    var address = '';
    address += e.addressComponent.province;
    address += e.addressComponent.city;
    address += e.addressComponent.district;
    address += e.addressComponent.street;
    address += e.addressComponent.streetNumber;
    alert("当前定位地址为：" + address);
  });
	geolocationControl.addEventListener("locationError",function(e){
    // 定位失败事件
		alert(e.message);
	});
	map.addControl(geolocationControl);
	var stCtrl = new BMap.PanoramaControl(); //构造全景控件
	stCtrl.setOffset(new BMap.Size(20, 40));
	map.addControl(stCtrl);//添加全景控件
	
	var oveCtrl=new BMap.OverviewMapControl();
	map.addControl(oveCtrl);
	oveCtrl.changeView();//缩略图
	
	var sel = document.getElementById('stylelist');
	for(var key in mapstyles){
		var style = mapstyles[key];
		var item = new  Option(style.title,key);//个性化
		sel.options.add(item);	
	}
	//地图风格
	changeMapStyle('grayscale')
		sel.value = 'grayscale';
	//自动提示
	//起点
	var aa = new BMap.Autocomplete(    //建立一个自动完成的对象
			{"input" : "tex_a"
			,"location" : map
		});
	
		aa.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
		var str = "";
			var _value = e.fromitem.value;
			var value = "";
			if (e.fromitem.index > -1) {
				value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
			}    
			str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
			
			value = "";
			if (e.toitem.index > -1) {
				_value = e.toitem.value;
				value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
			}    
			str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
			//删除xx同下
		});
	
		var myValue;
		aa.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
		var _value = e.item.value;
			myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
			 //删除xx+ 
			 e.item.index + "<br />myValue = " + myValue;
			
			setPlace();
			});
			
			//终点提示
	var ab = new BMap.Autocomplete(    //建立一个自动完成的对象
			{"input" : "tex_b"
			,"location" : allmap
		});
	
		ab.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
		var str = "";
			var _value = e.fromitem.value;
			var value = "";
			if (e.fromitem.index > -1) {
				value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
			}    
			str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
			
			value = "";
			if (e.toitem.index > -1) {
				_value = e.toitem.value;
				value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
			}    
			str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
			
		});
	
		var myValue;
		ab.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
		var _value = e.item.value;
			myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
			 + e.item.index + "<br />myValue = " + myValue;
			
			setPlace();
			});
			//,
	function setPlace(){
			map.clearOverlays();    //清除地图上所有覆盖物
			function myFun(){
				var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
				map.centerAndZoom(pp, 18);
				map.addOverlay(new BMap.Marker(pp));    //添加标注
			}
			var local = new BMap.LocalSearch(map, { //智能搜索
			  onSearchComplete: myFun
			});
			local.search(myValue);
		}
	function G(id) {
			return document.getElementById(id);
		}
}
//样式切换
function changeMapStyle(style){
		map.setMapStyle({style:style});
		$('#desc').html(mapstyles[style].desc);
}//步行
function WalkRouteQuery(){
	map.clearOverlays();
	var a=document.getElementById("tex_a").value;
	var b=document.getElementById("tex_b").value;
	var walking = new BMap.WalkingRoute(map, {renderOptions: {map: map, panel: "r-result", autoViewport: true}});
	walking.search(a,b);
}
//驾车
function DrivingQuery(){
	map.clearOverlays();
	var a=document.getElementById("tex_a").value;
	var b=document.getElementById("tex_b").value;
	var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true}});
				driving.search(a,b);
}
//公交
function BusQuery(){
	map.clearOverlays();
	var a=document.getElementById("tex_a").value;
	var b=document.getElementById("tex_b").value;
	var transit = new BMap.TransitRoute(map, {renderOptions: {map: map,panel: "r-result"}});
	transit.search(a,b);	
}

//学校
function dongyi(){
	map.clearOverlays();
	var point = new BMap.Point(114.309052,30.550312);
	map.centerAndZoom(point, 14);
	var marker = new BMap.Marker(point);  // 创建标注
	map.addOverlay(marker);               // 将标注添加到地图中
	marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
	var label = new BMap.Label("这里是黄鹤楼！",{offset:new BMap.Size(20,-10)});
	marker.setLabel(label);
	
	var sContent =
		"<h4 style='margin:0 0 5px 0;padding:0.2em 0'>黄鹤楼</h4>" + 
		"<img style='float:right;margin:4px' id='imgDemo' src='https://tu1.whhost.net/uploads/20181105/08/1541377249-rkhAERKzoQ.jpg' width='139' height='104' title='dy'/>" + 
		"<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>黄鹤楼，位于湖北省武汉市武昌区，地处蛇山之巅，濒临万里长江，为武汉市地标建筑；始建于三国吴黄武二年（223年），历代屡加重修，现存建筑以清代“同治楼”为原型设计，重建于1985年；因唐代诗人崔颢登楼所题《黄鹤楼》一诗而名扬四海。自古有“天下绝景”之美誉，与晴川阁、古琴台并称为“武汉三大名胜”，与湖南岳阳岳阳楼、江西南昌滕王阁并称为“江南三大名楼”，是“武汉十大景”之首、中国古代四大名楼之一、“中国十大历史文化名楼”之一，世称天下江山第一楼</p>" + 
		"</div>";
		var opts={
			width:400,
			height:220,
			title:"",
			enableMessage:true
		};
		
		var infoWindow = new BMap.InfoWindow(sContent,opts);  // 创建信息窗口对象
		marker.addEventListener("click", function(){          
		   this.openInfoWindow(infoWindow);
		   //图片加载完毕重绘infowindow
		   document.getElementById('imgDemo').onload = function (){
			   infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
		   }
		});
}
function erxiao(){
	map.clearOverlays();
	var point = new BMap.Point(113.100654,29.384572);
	map.centerAndZoom(point, 17);
	var marker = new BMap.Marker(point);  // 创建标注
	map.addOverlay(marker);               // 将标注添加到地图中
	marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
	var label = new BMap.Label("这里是岳阳楼",{offset:new BMap.Size(20,-10)});
	marker.setLabel(label);
	
	var sContent =
		"<h4 style='margin:0 0 5px 0;padding:0.2em 0'>岳阳楼</h4>" + 
		"<img style='float:right;margin:4px' id='imgDemo' src='https://img95.699pic.com/photo/50105/1253.jpg_wh860.jpg' width='139' height='104' title='ex'/>" + 
		"<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>岳阳楼，位于湖南省岳阳市岳阳楼区洞庭北路，地处岳阳古城西门城墙之上，紧靠洞庭湖畔，下瞰洞庭，前望君山；始建于东汉建安二十年（215年），历代屡加重修，现存建筑沿袭清光绪六年（1880年）重建时的形制与格局；因北宋滕宗谅重修岳阳楼，邀好友范仲淹作《岳阳楼记》使得岳阳楼著称于世。自古有“洞庭天下水，岳阳天下楼”之美誉，与湖北武汉黄鹤楼、江西南昌滕王阁并称为“江南三大名楼”，是“中国十大历史文化名楼”、古代四大名楼之一，世称天下第一楼。</p>" + 
		"</div>";
		var opts={
			width:400,
			height:220,
			title:"",
			enableMessage:true
		};
		
		var infoWindow = new BMap.InfoWindow(sContent,opts);  // 创建信息窗口对象
		marker.addEventListener("click", function(){          
		   this.openInfoWindow(infoWindow);
		   //图片加载完毕重绘infowindow
		   document.getElementById('imgDemo').onload = function (){
			   infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
		   }
		});
}
function erzhong(){
	map.clearOverlays();
	var point = new BMap.Point(115.887496,28.687012);
	map.centerAndZoom(point, 16);
	var marker = new BMap.Marker(point);  // 创建标注
	map.addOverlay(marker);               // 将标注添加到地图中
	marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
	var label = new BMap.Label("这里是滕王阁",{offset:new BMap.Size(20,-10)});
	marker.setLabel(label);
	
	var sContent =
		"<h4 style='margin:0 0 5px 0;padding:0.2em 0'>滕王阁</h4>" + 
		"<img style='float:right;margin:4px' id='imgDemo' src='https://uploadfile.bizhizu.cn/up/38/50/8c/38508c5ef50a46ba772adcbedf1b9c5e.jpg.source.jpg' width='139' height='104' title='天安门'/>" + 
		"<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>滕王阁，位于江西省南昌市东湖区，地处赣江东岸，为南昌市地标性建筑、豫章古文明之象征，始建于唐永徽四年（653年），为唐太宗李世民之弟滕王李元婴任江南洪州都督时所修，现存建筑为1985年重建景观；因初唐诗人王勃所作《滕王阁序》而闻名于世；与湖南岳阳岳阳楼、湖北武汉黄鹤楼并称为“江南三大名楼”，是中国古代四大名楼之一。</p>" + 
		"</div>";
		var opts={
			width:400,
			height:210,
			title:"",
			enableMessage:true
		};
		
		var infoWindow = new BMap.InfoWindow(sContent,opts);  // 创建信息窗口对象
		marker.addEventListener("click", function(){          
		   this.openInfoWindow(infoWindow);
		   //图片加载完毕重绘infowindow
		   document.getElementById('imgDemo').onload = function (){
			   infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
		   }
		});
}
//分宜中学
function fyzx(){
	map.clearOverlays();
	var point = new BMap.Point(110.277243,34.845202);
	map.centerAndZoom(point, 15);
	var marker = new BMap.Marker(point);  // 创建标注
	map.addOverlay(marker);               // 将标注添加到地图中
	marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
	var label = new BMap.Label("这是鹳雀楼！",{offset:new BMap.Size(20,-10)});
	marker.setLabel(label);
	
	var sContent =
		"<h4 style='margin:0 0 5px 0;padding:0.2em 0'>鹳雀楼</h4>" + 
		"<img style='float:right;margin:4px' id='imgDemo' src='https://wlj.yuncheng.gov.cn/uploadfiles/202103/16/2021031610281945386337.png' width='139' height='104' title='天安门'/>" + 
		"<img style='float:right;margin:4px' id='imgDemo' src='https://p1.ssl.qhimg.com/t0140cb297cd764d533.jpg' width='139' height='104' title='天安门'/>" + 
		"<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>鹳雀楼，又名鹳鹊楼，位于山西省运城市永济市蒲州镇，在东经110°15′00″～110°45′33″和北纬34°44′50″～35°04′50″之间，总建筑面积33206平方米，总重量58000吨。鹳雀楼始建于北周时期，在金元光元年（1222年）遭大火焚毁，1997年12月，鹳雀楼重修，2002年10月1日，鹳雀楼正式对游客开放。。</p>" + 
		"<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>鹳雀楼为高台式十字歇山顶楼阁，外观3层4檐，内部为9层使用空间，并设置电梯、楼梯组织垂直交通。整座楼阁分为台基和楼身两部分，总高度达73.9米，是四大名楼中最高的一座，是中国仿造楼中较为精致的。鹳雀楼整个的油漆彩画，是国内失传的唐代彩画艺术，经过国家文物局的专家多方考察抢救，重新创作设计，故鹳雀楼是国内唯一采用唐代彩画艺术恢复的唐代建筑。</p>"
		"</div>";
		var opts={
			width:500,
			height:319,
			title:"",
			enableMessage:true
		};
		
		var infoWindow = new BMap.InfoWindow(sContent,opts);  // 创建信息窗口对象
		marker.addEventListener("click", function(){          
		   this.openInfoWindow(infoWindow);
		   //图片加载完毕重绘infowindow
		   document.getElementById('imgDemo').onload = function (){
			   infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
		   }
		});
}
//湖北大学
function hbdx(){
	map.clearOverlays();
	var point = new BMap.Point(114.340259,30.58393);
	map.centerAndZoom(point, 16);
	var myIcon = new BMap.Icon("http://developer.baidu.com/map/jsdemo/img/fox.gif", new BMap.Size(300,157));//定义标注
	var marker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
	map.addOverlay(marker);               // 将标注添加到地图中
	var label = new BMap.Label("这里是我的大学-湖北大学",{offset:new BMap.Size(20,-10)});
	marker.setLabel(label);
	
	var sContent="<iframe src='Echarts.html' width='490px' height='300px' scrolling='yes' style='border:0px'></iframe>";
	var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
	marker.addEventListener("click",function(){
	this.openInfoWindow(infoWindow);
});
}
//显示全部
function fullscreen(){
	map.clearOverlays();
	var data_info =[[114.719479,28.025878,"小学1"],
	[114.675435,27.815,"小学2"],
	[114.678929,27.819425,"初中"],
	[114.691191,27.810806,"高中"],
	[114.340259,30.58393,"大学"]] 
	for (var i =0; i<data_info.length; i ++) {var point = new BMap.Point(data_info[i] [0],data_info[i] [1]);
	var marker = new BMap.Marker(point);  // 创建标注
	map.addOverlay(marker);               // 将标注添加到地图中
	var content =data_info[i] [2];
	var label = new BMap.Label(content,{offset:new BMap.Size(20,-10)});
	marker.setLabel(label);}
	marker.setAnimation(BMAP_ANIMATION_BOUNCE);
	map.centerAndZoom(new BMap.Point(114.353622,29.56486),8); 
	
}
//求学道路
function loadpolyline(){
	map.centerAndZoom(new BMap.Point(114.321219,29.000205),8);
 var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
    scale: 0.3,//图标缩放大小
    strokeColor:'#fff',//设置矢量图标的线填充颜色
    strokeWeight: '2',//设置线宽
});
var icons = new BMap.IconSequence(sy, '10', '30');
// 创建polyline对象
var pois = [
	new BMap.Point(114.719479,28.025878),
	new BMap.Point(114.675435,27.815),
	new BMap.Point(114.678929,27.819425),
	new BMap.Point(114.691191,27.810806),
	new BMap.Point(114.888172,27.827444),
	new BMap.Point(115.914971,28.666479),
	new BMap.Point(116.016731,29.709555),
	new BMap.Point(114.871787,30.385809),
	new BMap.Point(114.323209,30.536538),
	new BMap.Point(114.340259,30.58393)
	//求学经过路径
];
var polyline =new BMap.Polyline(pois, {
   enableEditing: false,//是否启用线编辑，默认为false
   enableClicking: true,//是否响应点击事件，默认为true
   icons:[icons],
   strokeWeight:'8',//折线的宽度，以像素为单位
   strokeOpacity: 0.76,//折线的透明度，取值范围0 - 1
   strokeColor:"#fac812" //折线颜色
});

map.addOverlay(polyline);
} 
function loadcurve(){//弧线 丝绸之路
map.clearOverlays();
map.centerAndZoom(new BMap.Point(75.692201,39.877067),3); 
var wuan=new BMap.Point(118.77867,24.765094),
	hzhou=new BMap.Point(113.517043,22.108629),
	twan=new BMap.Point(106.673249,20.539934),
	hk=new BMap.Point(110.444694,11.166823),
	nn=new BMap.Point(104.465573,0.30152),
	gy=new BMap.Point(89.637352,21.274676),
	cq=new BMap.Point(77.495136,6.694872),
	xa=new BMap.Point(61.452693,24.546511),
	zz=new BMap.Point(43.349753,12.263776),
	nj=new BMap.Point(33.488802,27.832479),
	nc=new BMap.Point(26.42424,37.109399),
	cs=new BMap.Point(12.699856,45.31615);
var points =[wuan,hzhou,twan,hk,nn,gy,cq,xa,zz,nj,nc,cs];
var curve =new BMapLib.CurveLine(points, {strokeColor:"Cyan", strokeWeight:7, strokeOpacity:0.5});//创建弧线对象 
 	map.addOverlay(curve); //添加到地图中
 	curve.enableEditing();
	
var cs=new BMap.Point(4.338285,51.960274),
	cd=new BMap.Point(15.689417,48.025534),
	cf=new BMap.Point(25.329601,42.626819),
	xian=new BMap.Point(108.917719,34.364895);
	
var points =[cs,cd,cf,xian];
var curve =new BMapLib.CurveLine(points, {strokeColor:"red", strokeWeight:6, strokeOpacity:0.5});//创建弧线对象 
 	map.addOverlay(curve); //添加到地图中
 	curve.enableEditing(); //开启编辑功能
	
}
//湖大生源
function ps(){
	map.centerAndZoom(new BMap.Point(112.321219,31.090205),6);
	map.clearOverlays();

	
	var jkpoint=new BMap.Point(114.340259,30.58393);//wh
	var jj_point=new BMap.Point(113.212185,23.214854);//gz
	var jh_point=new BMap.Point(113.580131,34.795322);//zz
	var jg_point=new BMap.Point(112.660266,27.012659);
	var jf_point=new BMap.Point(119.172909,32.268768);
	var jd_point=new BMap.Point(120.129569,30.277832);
	var js_point=new BMap.Point(87.595252,43.954974);
	
	var jj_sContent =
		"<h4 style='margin:0 0 5px 0;padding:0.2em 0'>广东省</h4>" + 
		"<img style='float:right;margin:4px' id='imgDemo' src='https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2624521873,86145363&fm=26&gp=0.jpg' width='139' height='104' title='天安门'/>" + 
		"<p style='margin:0;line-height:1.5;font-size:16px;text-indent:2em'>广东，简称“粤”，中华人民共和国省级行政区，省会广州。因古地名广信之东，故名“广东”。位于南岭以南，南海之滨，与香港、澳门、广西、湖南、江西及福建接壤，与海南隔海相望。</p>" + 
		"</div>";
	var jh_sContent =
		"<h4 style='margin:0 0 5px 0;padding:0.2em 0'>河南省</h4>" + 
		"<img style='float:right;margin:4px' id='imgDemo' src='https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=114073883,267918626&fm=26&gp=0.jpg' width='139' height='104' title='天安门'/>" + 
		"<p style='margin:0;line-height:1.3;font-size:16px;text-indent:2em'>河南省，简称“豫”，中华人民共和国省级行政区。省会郑州，位于中国中部，河南省界于北纬31°23'-36°22'，东经110°21'-116°39'之间，东接安徽、山东，北界河北、山西，西连陕西，南临湖北，总面积16.7万平方千米。</p>" + 
		"</div>";	
	var jg_sContent =
		"<h4 style='margin:0 0 5px 0;padding:0.2em 0'>湖南省</h4>" + 
		"<img style='float:right;margin:4px' id='imgDemo' src='https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1762799762,1429988101&fm=26&gp=0.jpg' width='139' height='104' title='天安门'/>" + 
		"<p style='margin:0;line-height:1.5;font-size:16px;text-indent:2em'>湖南省，简称“湘”，是中华人民共和国省级行政区，界于北纬24°38′～30°08′，东经108°47′～114°15′之间，东临江西，西接重庆、贵州，南毗广东、广西，北连湖北，总面积21.18万平方千米。</p>" + 
		"</div>";	
	var jf_sContent =
		"<h4 style='margin:0 0 5px 0;padding:0.2em 0'>江苏省</h4>" + 
		"<img style='float:right;margin:4px' id='imgDemo' src='https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1924956058,4097228743&fm=26&gp=0.jpg' width='139' height='104' title='天安门'/>" + 
		"<p style='margin:0;line-height:1.5;font-size:16px;text-indent:2em'>江苏，简称“苏”，是中华人民共和国省级行政区。省会南京，位于中国大陆东部沿海，江苏界于北纬30°45'～35°20'，东经116°18'～121°57'之间，北接山东，东濒黄海，东南与浙江和上海毗邻，西接安徽江苏跨江滨海，湖泊众多，地势平坦</p>" + 
		"</div>";	
	var jd_sContent =
		"<h4 style='margin:0 0 5px 0;padding:0.2em 0'>浙江省</h4>" + 
		"<img style='float:right;margin:4px' id='imgDemo' src='https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4025299687,4269344071&fm=26&gp=0.jpg' width='139' height='104' title='天安门'/>" + 
		"<p style='margin:0;line-height:1.5;font-size:16px;text-indent:2em'>浙江，简称“浙”，是中华人民共和国省级行政区。省会杭州，位于中国东南沿海，浙江界于东经118°01'～123°10'，北纬27°02'～31°11'之间，东临东海，南接福建，西与安徽、江西相连，北与上海、江苏接壤，境内最大的河流钱塘江，因江流曲折，称之江，又称浙江</p>" + 
		"</div>";	
	var js_sContent =
		"<h4 style='margin:0 0 5px 0;padding:0.2em 0'>新疆维吾尔族自治区</h4>" + 
		"<img style='float:right;margin:4px' id='imgDemo' src='https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=369047846,3677184291&fm=26&gp=0.jpg' width='139' height='104' title='天安门'/>" + 
		"<p style='margin:0;line-height:1.5;font-size:16px;text-indent:2em'>新疆维吾尔自治区，简称“新”，首府乌鲁木齐市，位于中国西北边陲，是中国五个少数民族自治区之一。面积166万平方公里，是中国陆地面积最大的省级行政区，占中国国土总面积六分之一。常住人口2486.76万人。</p>" + 
		"</div>";	
	
	
	var data_info = [[jj_point,"red",jj_sContent],
					 [jh_point,"yellow",jh_sContent],
					 [jg_point,"blue",jg_sContent],
					 [jf_point,"yellowgreen",jf_sContent],
					 [jd_point,"black",jd_sContent],
					 [js_point,"orange",js_sContent]];
	for (var i= 0; i < data_info.length; i ++){
		var point = data_info[i][0];
		var marker=new BMap.Marker(point);
		map.addOverlay(marker);
		var npoints=[jkpoint,point];
		var color = data_info[i][1];
		var curve =new BMapLib.CurveLine(npoints, {strokeColor:color, strokeWeight:8, strokeOpacity:0.7});//创建弧线对象
		map.addOverlay(curve); //添加到地图中
		var content=data_info [i][2];
		addClickHandler(content,marker);
		var label = new BMap.Label("湖大学生重要来源",{offset:new BMap.Size(20,-10)});
		marker.setLabel(label); 
		
		var opts={
			width:400,
			height:200,
			title:"",
			enableMessage:true
		};
		function addClickHandler(content,marker){
				marker.addEventListener("click",function(e){
					openInfo(content,e)}
				);
			}
			function openInfo(content,e){
				var p = e.target;
				var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
				var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象 
				map.openInfoWindow(infoWindow,point); //开启信息窗口
			}
	}
}

function loadlushu(){
	map.clearOverlays();
	var start = new BMap.Point(134.333584,48.222619);
	var end = new BMap.Point(74.137629,39.629221);
	MarioRun(start,end);
							
}
//无问西东
function MarioRun(myP1,myP2){
//var myP1 = new BMap.Point(116.380967,39.913285);    //起点
	//var myP2 = new BMap.Point(116.424374,39.914668);    //终点	
	var myIcon = new BMap.Icon("http://lbsyun.baidu.com/jsdemo/img/Mario.png", new BMap.Size(32, 70), {    //小车图片
		//offset: new BMap.Size(0, -5),    //相当于CSS精灵
		imageOffset: new BMap.Size(0, 0)    //图片的偏移量。为了是图片底部中心对准坐标点。
	  });
	var driving2 = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true}});    //驾车实例
	driving2.search(myP1, myP2);    //显示一条公交线路

	window.run = function (){
		var driving = new BMap.DrivingRoute(map);    //驾车实例
		driving.search(myP1, myP2);
		driving.setSearchCompleteCallback(function(){
			var pts = driving.getResults().getPlan(0).getRoute(0).getPath();    //通过驾车实例，获得一系列点的数组
			var paths = pts.length;    //获得有几个点

			var carMk = new BMap.Marker(pts[0],{icon:myIcon});
			map.addOverlay(carMk);
			i=0;
			function resetMkPoint(i){
				carMk.setPosition(pts[i]);
				if(i < paths){
					setTimeout(function(){
						i++;
						resetMkPoint(i);
					},0);
				}
			}
			setTimeout(function(){
				resetMkPoint(5);
			},0)
		});
	}
	setTimeout(function(){
		run();
	},150);
}
//图表湖北大学
function getHbuData(){
	var myChart = echarts.init(document.getElementById('hbuEcharts'));
	var option = {
		title:{
			text:'湖北大学2020届本科毕业生生源信息（主要）'
		},
    tooltip: {},
    legend:{
		data:['shu']
	},
    xAxis:{
            data: ['商学院','政法学院','外院','物电学院','资环学院','材料学院','计信学院','生院','化院','文学院','数统学院'],
           
        },
    yAxis:{},
    series: [
        {
            name: '人数',
            type: 'bar',
			itemStyle:{
					normal:{
						color:function(params){
							var colorList = ['#3398DB','yellow','#3398DB','yellow','#3398DB','yellow','#3398DB','yellow','#3398DB','yellow','#3398DB'];
							return colorList[params.dataIndex]
						},
					}
			},
			barWidth:80,
			barWidth: '60%',
            data: [610,282,276,218,204,369,478,319,334,219,199]
        }
    ]
};
	myChart.setOption(option);
}