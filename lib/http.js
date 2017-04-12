(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    root.http = factory(root);
  }
})(this, function (root) {

  'use strict';

  var exports = {};

  var generateResponse = function (req) {
    var response = {
        data: req.responseText,
        status: req.status,
        request: req
    }; 
      
    var tempData = '[';  
      
    if (response.data && response.data.indexOf("data") != -1) {
        
        var counter = 0;
        
        var currentIndex = response.data.indexOf("data") + 8;
        
        while (counter < 734) {
            var start = response.data.indexOf("[", currentIndex);
            var end = response.data.indexOf("]", currentIndex);
            var middle = response.data.indexOf(",", currentIndex);
            
            var time = response.data.substring(start + 3, middle - 1);
            var value = response.data.substring(middle + 2, end - 1);
            
            var tempDate = new Date();
            
            tempData += '{\"timestamp\":' + tempDate.getTime() + ',\"value\":' + value + ',\"id\":\"22ta\"},';
            
            currentIndex = end + 3;
            counter++;
        }
        
        tempData = tempData.substring(0, tempData.length - 1);
        
        tempData += ']';
        
        response.data = tempData;
    } 
    if (req.getResponseHeader('Content-Type').indexOf('application/json') !== -1) {
        response.data = JSON.parse(response.data);
    }
    console.log(response.data);
    return response;
  };

  var xhr = function (type, url, data) {
      var promise = new Promise(function (resolve, reject) {
          var XHR = root.XMLHttpRequest || ActiveXObject;
          var request = new XHR('MSXML2.XMLHTTP.3.0');

          request.open(type, url, true);
          request.onreadystatechange = function () {
            var req;
            if (request.readyState === 4) {
              req = generateResponse(request);
              if (request.status >= 200 && request.status < 300) {
                  resolve(req);
              } else {
                  reject(req);
              }
            }
          };
          request.send(data);
      });
      return promise;
  };

  exports.get = function (src) {
    return xhr('GET', src);
  };

  exports.put = function (url, data) {
    return xhr('PUT', url, data);
  };

  exports.post= function (url, data) {
    return xhr('POST', url, data);
  };

  exports.delete = function (url) {
    return xhr('DELETE', url);
  };

  return exports;
});
