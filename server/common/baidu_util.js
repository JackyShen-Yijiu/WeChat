/**
 * Created by ma on 2016/3/9.
 */
//百度地图
var path = "http://api.map.baidu.com/geoconv/v1/?output=json";
var ak = "&201bccec2ea05baf5cf275aca9901cc0";
function WeiXinToBaiDu(lat, lot) {
    var position = "&coords=" + lat + "," + lot;
    var url = path + position + "&from=3&to=5" + ak;
    //$.get("url", function(result) {
    //
    //})
}
