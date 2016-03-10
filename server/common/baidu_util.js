/**
 * Created by ma on 2016/3/9.
 */
//百度地图
var request = require('superagent');
var path = "http://api.map.baidu.com/geoconv/v1/?output=json";
var ak = "201bccec2ea05baf5cf275aca9901cc0";
function WeiXinToBaiDu(lat, lot, callback) {
    if (lat == 0 && lot == 0) {
        var resultInfo = {
            lat : 0,
            lot : 0
        }
        return callback(null, resultInfo);
    }
    var position = "&coords=" + lat + "," + lot;
    var url = path + position + "&from=3&to=5&ak=" + ak;
    //console.log("url = " + url);
    request.get(url).end(function (err, res) {
        if (err) {
            return callback("经纬度转换失败： " + err);
        }
        //console.log(res);
        var resmsg = JSON.parse(res.text);
        //console.log("status =" + resmsg.status);
        if (resmsg.status == 0) {
            console.log("result = " +resmsg.result[0]);
            var lat = resmsg.result[0].x;
            var lot = resmsg.result[0].y;
            //console.log("lat = " + lat +",lot = " + lot);
            var resultInfo = {
                lat : lat,
                lot : lot
            }
            return callback(null, resultInfo);
        } else {
            return callback("获取坐标转换失败： " + res.status);
        }
    })
}
exports.weixintobaidu = WeiXinToBaiDu;
