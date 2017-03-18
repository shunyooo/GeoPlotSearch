# GeoPlotSearch
GoogleMapにプロット、位置情報を取得するWebページ

## 動作確認
Google Chromeが推奨されます。
[こちらから](http://syunyooo.webcrow.jp/GeoPlotSearch/)

## 実装概要
APIをGoogleMap,Wikipedia,Openweathermapの3つ使用しています。  
### GoogleMapAPI
GoogleMapのAPIです。デザインなどをカスタマイズできます。  
プロットした座標の緯度経度を取得できます。  
![googlemap](https://cloud.githubusercontent.com/assets/17490886/24073327/4f23f9a6-0c39-11e7-88df-cd94a396d5f3.gif)
### 天気API
取得した座標から、OpenweathermapにAPIを投げています。  
![Weather](https://cloud.githubusercontent.com/assets/17490886/24073279/7872e44e-0c38-11e7-9f81-172351f02d27.gif)

### WikiAPI
取得した座標から、GoogleAPIより逆ジオコーディングを行い、位置クエリを取得しています。  
位置クエリをそのままWikiに投げて検索しています。主にその地名の出身者や建築物、包含している地名などが出てきます。  
![wiki](https://cloud.githubusercontent.com/assets/17490886/24073326/4c3cc448-0c39-11e7-9b3f-26480dcca12d.gif)
