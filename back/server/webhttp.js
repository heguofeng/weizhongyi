var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var now = new Date();
var year = now.getFullYear();
var month = now.getMonth() + 1;
var day = now.getDate();
var hours = now.getHours();
var minutes = now.getMinutes();
var seconds = now.getSeconds();
var time = "" + year + "." + Timer(month) + "." + Timer(day) + " " + Timer(hours) + ":" + Timer(minutes) + ":" + Timer(seconds) + " ";
//时间格式
function Timer(time) {
    if (parseInt(time) < 10) {
        return time = '0' + time;
    } else {
        return time;
    }
}

var httpGet = (url)  => {
    var promise = new Promise((resolve, reject) => {
        var xmlhttp = new XMLHttpRequest();

        function handler() {
            if (this.readyState !== 4) {
                return;
            }
            if (this.status === 200) {
                console.log(time + " GET " + url + " >>>success<<<");
                resolve(this.responseText);
            } else {
                reject(new Error(this.statusText));
            }
        }
        xmlhttp.open ("get", url, true); // 异步请求  
        xmlhttp.onreadystatechange = handler;
        xmlhttp.responseType = "json";
        xmlhttp.setRequestHeader ("Content-Type",  "application/x-www-form-urlencoded; charset=UTF-8");     
        xmlhttp.send (null);  
    });
    return promise;
};

var httpPost = (url,  data)  => { 
    var promise = new Promise((resolve, reject) => {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState == 4) {
                if ((xmlhttp.status >= 200 && xmlhttp.status < 300) || xmlhttp.status == 304) {
                    console.log(time + " POST " + url + " >>>success<<<");
                    resolve(xmlhttp.responseText);
                } else {
                    reject(new Error(xmlhttp.statusText))
                }
            }
        };      
        xmlhttp.open ("post",  url, true);     
        xmlhttp.setRequestHeader ("Content-Type",  "application/x-www-form-urlencoded; charset=UTF-8");     
        xmlhttp.send (data);
    });
    return promise;
};

var httpPut = (url, data) =>  { 
    var promise = new Promise((resolve, reject) => {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = handler;       
        xmlhttp.open ("put",  url, true);     
        xmlhttp.setRequestHeader ("Content-Type",  "application/x-www-form-urlencoded; charset=UTF-8");     
        xmlhttp.send (data); 
        function handler() {
            if (this.readyState !== 4) {
                return;
            }
            if (this.status === 200) {
                console.log(time + " PUT " + url + " >>>success<<<");
                resolve(this.responseText);
            } else {
                reject(new Error(this.statusText));
            }
        }
    });
    return promise;
};

var httpDelete = (url) =>  {
    var promise = new Promise((resolve, reject) => {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState == 4) {
                if ((xmlhttp.status >= 200 && xmlhttp.status < 300) || xmlhttp.status == 304) {
                    console.log(time + " DELETE " + url + " >>>success<<<");
                    resolve(this.responseText);
                } else {
                    // console.log("请求失败" + xmlhttp.status + "状态吗" + xmlhttp.readyState);
                    reject(new Error(this.statusText));
                }
            }
        }; 
        xmlhttp.open ("delete",  url, true); 
        xmlhttp.setRequestHeader ("Content-Type",  "application/x-www-form-urlencoded; charset=UTF-8");     
        xmlhttp.send (null); 
    });
    return promise;
} 

module.exports = {
    httpGet: httpGet,
    httpPost: httpPost,
    httpPut: httpPut,
    httpDelete: httpDelete
};