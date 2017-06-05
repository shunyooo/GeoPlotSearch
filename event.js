"use strict";
const MY_API_KEY = "***************";
const WET_API_KEY = "***************";
const INST_API_KEY = "***************";
let markers = [];
let windows = [];

function initialize() {
    
    // 中心の位置座標を指定する
    let latlng = new google.maps.LatLng(39.3011093,139.1369091);
    let myOptions = {
        zoom: 5,        // ズーム値
        center: latlng, // 中心座標 [latlng]
        mapTypeControlOptions: { mapTypeIds: ['noText', google.maps.MapTypeId.ROADMAP] }
        ,disableDefaultUI: true
      };
    // [canvas]に、[mapOptions]の内容の、地図のインスタンス([map])を作成する
    let map = new google.maps.Map(document.getElementById('map_canvas'), myOptions);
        
    //スタイル付き地図
    let lopanType = new google.maps.StyledMapType([
    {
        //適用対象
        featureType: 'all',
        //適用対象中、対象要素
        elementType: 'labels',
        //適用スタイル
        stylers: [{ visibility: 'off' }]
    },{
        "featureType": "landscape",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 65
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 51
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 30
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 40
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": -25
            },
            {
                "saturation": -100
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#ffff00"
            },
            {
                "lightness": -25
            },
            {
                "saturation": -97
            }
        ]
    }
], { name: 'BRACK' });
    
    //マップセット
    map.mapTypes.set('noText', lopanType);
    map.setMapTypeId('noText');
    
    
    // Markerの初期設定
    var markerOpts = {
        position: new google.maps.LatLng(39.1, 138.1),
        map: map,
        title: "marker test",
        draggable:true,
        animation: google.maps.Animation.DROP,
        icon: {
          url: 'images/spot2.png',
          size: new google.maps.Size(50, 70),
          origin: new google.maps.Point(0, 0),
          //anchor: new google.maps.Point(16, 16),
          scaledSize: new google.maps.Size(50, 70)
        }
    };
    // 直前で作成したMarkerOptionsを利用してMarkerを作成(テスト)
    //var marker = new google.maps.Marker(markerOpts);
    
    //吹き出し(テスト)
    //var myInfoWindow = new google.maps.InfoWindow({
    // 吹き出しに出す文
    //content: "marker"
    //});
    
    // 吹き出しを開く(テスト)
    //google.maps.event.addListenerOnce(marker, "click", function(event) {
    //  myInfoWindow.open(map, marker);
    //});
    
    // 吹き出しが閉じられたら、マーカークリックで再び開くようにしておく(テスト)
    /*google.maps.event.addListener(myInfoWindow, "closeclick", function() {
    google.maps.event.addListenerOnce(marker, "click", function(event) {
      myInfoWindow.open(map, marker);
    });
    });
    
    markers.push(marker);*/
    
    
    //mapをクリックしたら
    google.maps.event.addListener( map , 'click' , function(event) {
        //document.getElementById("show_lat").innerHTML = event.latLng.lat();
        //document.getElementById("show_lng").innerHTML = event.latLng.lng();
        let lat = event.latLng.lat();
        let lon = event.latLng.lng();
        let geo_res,weather_res,wiki_res;
        
        //marker移動
        //marker.setPosition(event.latLng);
        //marker.setAnimation(google.maps.Animation.DROP);
        
        //marker作成
        let mk = new google.maps.Marker(markerOpts);
        mk.setPosition(event.latLng);
        
        //逆ジオコード
        let tg_geo;//位置の文字列
        let re_geo_url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+String(lat)+","+String(lon)+"&key="+MY_API_KEY+"&result_type=political|locality";
        
        //起点。APIにより逆ジオコーディングを行い、検索などのAPIリクエストも行う
        $.ajax({
            url: re_geo_url,
            type: "GET",
            dataType: "json",
            success: function(res) {
                geo_res = res;
                //逆ジオコード。tg_geoに住所文字列を格納。
                for(let i = 0 ; i < res["results"].length; i++){
                    if(res["results"][i]["types"].indexOf("political") >= 0
                      &&res["results"][i]["types"].indexOf("locality") >= 0
                      ){
                        //document.getElementById("show_str").innerHTML = res["results"][i]["formatted_address"];
                        tg_geo = res["results"][i]["formatted_address"];
                        break;
                    }
                }
            }   
        }).done(function(){//天気予報API  
            let weather_url = "http://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&APPID="+WET_API_KEY+"&units=metric";
            console.log(weather_url);
            $.ajax({
                url: weather_url,
                type: "GET",
                dataType: "jsonp",
                success: function(res) {
                    weather_res = res;
                    //document.getElementById("show_weath").innerHTML = res["list"][0]["weather"][0]["description"];
                    console.log("http://openweathermap.org/img/w/"+res["list"][0]["weather"][0]["icon"]+".png");
                    //document.getElementById("show_img").src = "http://openweathermap.org/img/w/"+res["list"][0]["weather"][0]["icon"]+".png";
                }  
            }).done(function(){//WIKI API
            let wiki_url = "https://ja.wikipedia.org/w/api.php?format=json&action=query&list=search&srsearch="+encodeURIComponent(tg_geo);

            $.ajax({
            url: wiki_url,
            type: "GET",
            dataType: "jsonp",
            success: function(res) {
                wiki_res = res;
                console.log(wiki_url);
                console.log(res["query"]["search"]);
                /*
                document.getElementById("show_wiki").innerHTML = null;
                for(let i=0;i < res["query"]["search"].length;i++){
                    document.getElementById("show_wiki").innerHTML += res["query"]["search"][i]["title"]+"<br>";
                }*/
          }  
        }).done(function(){//API取得後の処理
                
                
        //吹き出し
        let myInfoWindow = new google.maps.InfoWindow({
        // 吹き出しに出す文
        content:get_window_html(geo_res,weather_res,wiki_res),
        maxWidth: 350
        });
        
        for(let i = 0;i<windows.length;i++){
                windows[i].close();
                console.log(windows[i]+"closed");
        }
        windows.push(myInfoWindow);
        
        google.maps.event.addListenerOnce(mk, "click", function(event) {
                for(let i = 0;i<windows.length;i++){
                    windows[i].close();
                    console.log(windows[i]+"close");
                }
              myInfoWindow.open(map, mk);
        });
        

        // 吹き出しが閉じられたら、マーカークリックで再び開くようにしておく
        google.maps.event.addListener(myInfoWindow, "closeclick", function() {
            google.maps.event.addListenerOnce(mk, "click", function(event) {
                for(let i = 0;i<windows.length;i++){
                    windows[i].close();
                    console.log(windows[i]+"close");
                }
              myInfoWindow.open(map, mk);
            });
        });
            
        /*
         * The google.maps.event.addListener() event waits for
         * the creation of the infowindow HTML structure 'domready'
         * and before the opening of the infowindow defined styles
         * are applied.
         */
        google.maps.event.addListener(myInfoWindow, 'domready', function() {

           // Reference to the DIV which receives the contents of the infowindow using jQuery
           var iwOuter = $('.gm-style-iw');

           /* The DIV we want to change is above the .gm-style-iw DIV.
            * So, we use jQuery and create a iwBackground variable,
            * and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
            */
           var iwBackground = iwOuter.prev();

           // Remove the background shadow DIV
           iwBackground.children(':nth-child(2)').css({'display' : 'none'});

           // Remove the white background DIV
           iwBackground.children(':nth-child(4)').css({'display' : 'none'});
            
           // Moves the infowindow 115px to the right.
            iwOuter.parent().parent().css({left: '40px'});
            
            // Moves the shadow of the arrow 76px to the left margin 
            iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 150px !important;'});

            // Moves the arrow 76px to the left margin 
            iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 150px !important;'});
            
            // Changes the desired color for the tail outline.
            // The outline of the tail is composed of two descendants of div which contains the tail.
            // The .find('div').children() method refers to all the div which are direct descendants of the previous div. 
            iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(230, 79, 87, 0.6) 0px 1px 6px', 'z-index' : '1'});
            
            // Taking advantage of the already established reference to
            // div .gm-style-iw with iwOuter variable.
            // You must set a new variable iwCloseBtn.
            // Using the .next() method of JQuery you reference the following div to .gm-style-iw.
            // Is this div that groups the close button elements.
            var iwCloseBtn = iwOuter.next();

            // Apply the desired effect to the close button
            iwCloseBtn.css({
              opacity: '1', // by default the close button has an opacity of 0.7
              right: '38px', top: '3px', // button repositioning
              border: '7px solid #DC373F', // increasing button border and new color
              'border-radius': '13px', // circular effect
              'box-shadow': '0 0 5px #BF2C34' // 3D effect to highlight the button
              });

            // The API automatically applies 0.7 opacity to the button after the mouseout event.
            // This function reverses this event to the desired value.
            iwCloseBtn.mouseout(function(){
              $(this).css({opacity: '1'});
            });
        });
            myInfoWindow.open(map, mk);
           
    })
            })
        });
        



    //要素作成
    //let el = genBox(document.getElementById('map_canvas'),"1px","1px");
    //console.log("elements"+el.innerHTML);
        
        
        markers.push(mk);
    });
    
                                  
}

//情報window用のhtmlを生成する関数。
function get_window_html(geo_res,weather_res,wiki_res){
    let id;
    let infoWindow = document.createElement('div');
    infoWindow.style.width = "350px";
    infoWindow.style.height = "250px";    
    infoWindow.style.background = "#fff";//"#3C61AD";
    
    
    //title要素
    let title = document.createElement('div');
    title.className = "iw-title";
    infoWindow.appendChild(title); 
    for(let i = 0 ; i < geo_res["results"].length; i++){
    if(geo_res["results"][i]["types"].indexOf("political") >= 0
      &&geo_res["results"][i]["types"].indexOf("locality") >= 0
      ){
        title.innerHTML = geo_res["results"][i]["formatted_address"];
        break;
    }
    }
    
    let body = document.createElement('div');
    body.className = "scrollBody";

    //base要素
    let base = document.createElement('div')
    base.appendChild(infoWindow);
    infoWindow.appendChild(body);
    
    //fade要素
    let fade = document.createElement('div');
    fade.className = "iw-bottom-gradient";
    base.appendChild(fade); 
    
        
    //お天気要素(スライド式)
    let weather = document.createElement('div');
    weather.className = "wrapper";
    body.appendChild(weather);
    let slideshow = document.createElement('div');
    slideshow.className = "slideshow";
    let slideContents = document.createElement('div');
    slideContents.className = "slideContents";
    slideshow.appendChild(slideContents); 
    
    for(let i = 1; i <= 5; i++){
        let input = document.createElement('input');
        input.name = "slideshow";
        input.className = "switch"+i;
        input.type = "radio";
        if(i==0){input.checked = true;}
        weather.appendChild(input);
        
        let section = document.createElement('section');
        section.className = "slide"+i;
        slideContents.appendChild(section);
        
        let contents = document.createElement('div');
        contents.className = "contents";
        section.appendChild(contents);
        let h1 = document.createElement('h1');
        let p = document.createElement('p');
        h1.innerHTML = weather_res["list"][i-1]["dt_txt"];
        p.innerHTML =  weather_res["list"][i-1]["weather"][0]["description"];
        
        contents.appendChild(h1);
        contents.appendChild(p);

        let img = document.createElement('img');
        img.src = "http://openweathermap.org/img/w/"+weather_res["list"][i-1]["weather"][0]["icon"]+".png";
        section.appendChild(img);
}
    weather.appendChild(slideshow);
    

    //区切り線
    let line = document.createElement('hr');
    line.width = "80%";
    body.appendChild(line);

    //wiki要素
    let wiki = document.createElement('div');
    wiki.className = "menu";
    body.appendChild(wiki);

    for(let i=0;i < wiki_res["query"]["search"].length;i++){
        let id = random_hash();
            
        /*let label = document.createElement('label');
        label.for = "Panel_"+id;
        label.innerHTML =  wiki_res["query"]["search"][i]["title"];
        wiki.appendChild(label);
        
        console.log(wiki.innerHTML);

        let input = document.createElement('input');
        input.type = "checkbox";
        input.id = "Panel_"+id;
        input.className = "on-off";
        wiki.appendChild(input);
        
        let ul = document.createElement('ul');
        let li = document.createElement('li');
        li.innerHTML = wiki_res["query"]["search"][i]["snippet"];
        wiki.appendChild(ul);
        ul.appendChild(li);*/
        
        wiki.innerHTML += "<label for='Panel_"+id+"'>"
        +wiki_res["query"]["search"][i]["title"]
        +"</label>"
        +"<input type='checkbox' id='Panel_"+id+"' class='on-off' />"
        +"<ul>"
        +"<li>"
        +wiki_res["query"]["search"][i]["snippet"]
        +"</li>"
        +"</ul>";
    }

    
    console.log(base.innerHTML);
    
    //document.getElementById("show_window").innerHTML = base.innerHTML;
    
    return base.innerHTML;
    
    /*return '<div id="infosindow">'+ //インフォウィンドウのサイズを指定
	'<b>大國魂神社</b><br>'+
	'<img src="http://waox.main.jp/maps/photo/ookuni.jpg" width="240" height="180" border="0" />'+
	'</div>'*/
}








//ボックスを実際に生成する関数。
//要素生成、親子設定、スタイルの指定を行う。
function genBox(base,left,top){
    let id;
    let target = document.createElement('div');
    let target_parent = document.createElement('div');
    target.id = random_hash();

    let style = target.style;
    style.position = "absolute";
    style.width = "10%";
    style.height = "10%";    
    style.background = "#fc9";
    style.left = left;
    style.top = top;
    style.borderColor = "#000";
    style.border = "1px solid";
    style.boxSizing = "border-box";

    //target.style.display="block";
    base.appendChild(target_parent);
    target_parent.appendChild(target);
    
    return target_parent;
}

//乱数生成関数。idに用いる。
function random_hash(){
    // 生成する文字列の長さ
    var l = 15;
    // 生成する文字列に含める文字セット
    var c = "abcdefghijklmnopqrstuvwxyz0123456789";
    var cl = c.length;
    var r = "";
    for(var i=0; i<l; i++){
        r += c[Math.floor(Math.random()*cl)];
    } 
    return r;
}

  
//Ajax用(url,func)
function ajax(url,func){
        console.log("読み込み実行->"+url);
        function ajaxGetPromise(url) {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open("GET",url);
                xhr.onreadystatechange = function (){
                    if(xhr.readyState === 4){//非同期通信の完了
                        if((200 <= xhr.status && xhr.status < 300)){//成功
                            resolve(xhr.responseText);
                        }else{//失敗
                            reject("リクエスト失敗"+String(xhr.status));
                        }
                    }
                };
                xhr.send(null);
            });
        }
        let rt;
        const p = ajaxGetPromise(url);
        p.then(//成功
        (result)=>{
            console.log(result);
            func(JSON.parse(result));
        }
        ).catch(//失敗
        (result)=>{
            console.log(result);
        });
}

window.onload = initialize();




