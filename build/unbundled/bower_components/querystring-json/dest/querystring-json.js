!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.QSJS=e()}}(function(){return function e(t,r,n){function a(i,s){if(!r[i]){if(!t[i]){var u="function"==typeof require&&require;if(!s&&u)return u(i,!0);if(o)return o(i,!0);var f=new Error("Cannot find module '"+i+"'");throw f.code="MODULE_NOT_FOUND",f}var c=r[i]={exports:{}};t[i][0].call(c.exports,function(e){var r=t[i][1][e];return a(r?r:e)},c,c.exports,e,t,r,n)}return r[i].exports}for(var o="function"==typeof require&&require,i=0;i<n.length;i++)a(n[i]);return a}({1:[function(e,t,r){function n(e){return i.test(e)}function a(e){var t=e.match(i);if(!t)throw"Couldn't parse ISO 8601 date string '"+e+"'";var r;for(r=1;r<11;r++)s.test(t[r])&&(t[r]=parseInt(t[r],10)),u.test(t[r])&&(t[r]=parseFloat(t[r]));var n=[1,2,3,5,6,7,10,11];for(r in n)n.hasOwnProperty(r)&&(t[n[r]]||(t[n[r]]=0));var a,o="Z"===t[8]||"-"===t[9]||"+"===t[9];if(a=o?new Date(Date.UTC(t[1],t[2]-1,t[3],t[5],t[6],t[7])):new Date(t[1],t[2]-1,t[3],t[5],t[6],t[7]),o&&t[10]){var f=60*t[10]*60*1e3;t[11]&&(f+=60*t[11]*1e3),"-"===t[9]&&(f*=-1),a=new Date(a.getTime()-f)}return a}function o(e){return e.toISOString()}var i=/(\d{4})-(\d{2})-(\d{2})(?:(T)(\d{2}):(\d{2}):(\d{2}(?:\.\d{1,3})?))?(?:(Z)|(?:([+-])(\d{2}):(\d{2})))?/i,s=/^\d+$/i,u=/^\d+(?:\.\d+)$/i;t.exports={testStr:n,testObject:function(e){return e instanceof Date},parse:a,format:o}},{}],2:[function(e,t,r){t.exports.extend=function(e){var t=[].slice.call(arguments,1);return t.forEach(function(t){for(var r in t)e[r]=t[r]}),e},t.exports.startsWith=function(e){return this.slice(0,e.length)===e},t.exports.isArray=function(e){return"[object Array]"===Object.prototype.toString.call(e)}},{}],3:[function(e,t,r){function n(e){function t(e){return o.test(e)}function r(t){var r=o.exec(t);if(!r)throw"Input string has wrong format.";var n=parseInt(r[1],10),a=null!=r[2],i=0;if(e.useInputTimeZone&&a){var u=Number.parseInt(r[3]),f=Number.parseInt(r[4]);if(Number.isNaN(u)||Number.isNaN(f))throw"Wrong timezone format";i=60*(60*u+f)*1e3,i*="-"==r[2]?-1:1}else i=60*e.defaultInputTimeZoneOffset*1e3;return e.shiftToLocalTimeZone&&(i+=s),new Date(n-i)}function n(e,t){var r="";if(t){var n=e.getTimezoneOffset(),a=n<0;n=a?-n:n;var o=(n/60).toFixed(0),i=(n%60).toFixed(0);o.length<2&&(o="0"+o),i.length<2&&(i="0"+i),r=(a?"-":"+")+o+i}return"/Date("+e.getTime().toString()+r+")/"}var s=60*(new Date).getTimezoneOffset()*1e3,e=a.extend({},i,e);return{testStr:t,testObject:function(e){return e instanceof Date},parse:r,format:n,options:e}}var a=e("./_utils.js"),o=/\/Date\((\d+)(?:([-+])(\d{2})(\d{2}))?\)\//i,i={useInputTimeZone:!1,defaultInputTimeZoneOffset:0,shiftToLocalTimeZone:!1};t.exports=n,t.exports.defaultOptions=i},{"./_utils.js":2}],4:[function(e,t,r){function n(e,t){var r=[].slice.call(arguments),a=!1;"boolean"==typeof r[0]&&(a=r.shift());for(var o=r[0],i=r.slice(1),s=i.length,u=0;u<s;u++){var f=i[u];for(var c in f){var p=f[c];if(a&&p&&"object"==typeof p){var l=Array.isArray(p)?[]:{};o[c]=n(!0,l,p)}else o[c]=p}}return o}t.exports=n},{}],5:[function(e,t,r){function n(e,t,r){if(!e)throw"target is null";for(var n=e,o=0;o<t.length;o++){var i=t[o],s=Number.isInteger(i),u=Number.isInteger(t[o+1]),f=n[i];if(s&&!a.isArray(n))throw"wrong path to array";if(!s&&a.isArray(n))throw"wrong path to object";if(f&&u&&!a.isArray(f))throw"wrong path to array";if(f&&!u&&a.isArray(f))throw"wrong path to object";f||(f=u?[]:{}),o==t.length-1&&(f=r),n[i]=f,n=f}}var a=e("./_utils.js");t.exports=n},{"./_utils.js":8}],6:[function(e,t,r){function n(e){var t=typeof e;return"function"==t?t:t="object"==t?i.isArray(e)?"array":"object":"simple"}function a(e,t,r){switch(e.type){case"object":var o=t(e,!0);if(!o)for(var s in e.value)if(e.value.hasOwnProperty(s)){if(r.ignorePrivate&&i.startsWith.call(s,r.privatePreffix))continue;var u=e.value[s],f={id:s,value:u,parent:e,type:n(u)};a(f,t,r)}t(e,!1);break;case"array":var o=t(e,!0);if(!o)for(var c=0;c<e.value.length;c++){var u=e.value[c],f={id:c,value:u,parent:e,type:n(u)};a(f,t,r)}t(e,!1);break;case"simple":t(e,!0),t(e,!1);break;case"function":break;default:throw"unknown node type: "+e.type}}function o(e,t,r){r=r||{ignorePrivate:!0,privatePreffix:"_"};var o={type:n(e),id:null,value:e};if("object"==o.type||"array"==o.type)return a(o,t,r)}var i=e("./_utils.js");t.exports=o},{"./_utils.js":8}],7:[function(e,t,r){function n(e,t){var t=t||/[\[\]\.\(\)]/g;return e.split(t).filter(function(e){return e.length>0}).map(function(e){var t=parseInt(e);return Number.isNaN(t)?e:t})}function a(e,t,r){var t=t||"&",r=r||"=",n=e.split(t).filter(function(e){return e.length>0}).map(function(e){return e.split(r)});return n}e("./_utils.js");t.exports.splitPath=n,t.exports.splitQuery=a},{"./_utils.js":8}],8:[function(e,t,r){t.exports.startsWith=function(e){return this.slice(0,e.length)===e},t.exports.isArray=function(e){return"[object Array]"===Object.prototype.toString.call(e)}},{}],9:[function(e,t,r){function n(e){function t(t,r){var n=o.splitQuery(t,e.queryDelimiterChar,e.setValueChar);0==n.length&&(r={});for(var a=0;a<n.length;a++){var s=n[a],u=o.splitPath(s[0]),f=s[1];if(e.lowercaseNames)for(var c=0;c<u.length;c++)u[c]=Number.isInteger(u[c])?u[c]:u[c].toLowerCase();r||(r=Number.isInteger(u[0])?[]:{}),f=f.replace("+","%20"),f=decodeURIComponent(f);for(var p=0;p<e.parsers.length;p++){var l=e.parsers[p];if(l.accept(f)){f=l.parse(f);break}}i(r,u,f)}return r}function r(t){var r=[];return a(t,function(t,n){if(n){var a=!1,o=t.value;if(a="simple"==t.type,!a)for(var i=0;i<e.formatters.length;i++){var s=e.formatters[i];if(s.accept(o)){o=s.format(o),a=!0;break}}if(a){o=encodeURIComponent(o),o=o.replace(/%20/g,"+");for(var u=[],f=t;null!=f&&null!=f;)u.push(f),f=f.parent;for(var c="",p=u.length-1;p>=0;p--){var t=u[p];if(t.parent){var l=t.parent;switch(l.type){case"array":c+=e.arrayOpenChar+t.id+e.arrayCloseChar;break;case"object":c+=c.length>0?e.propAccessChar:"",c+=t.id;break;default:throw"Unexpected node type: "+l.type}}}e.lowercaseNames&&(c=c.toLowerCase()),r.push(c+e.setValueChar+o)}}}),r}function n(t){var n=r(t);return n.join(e.queryDelimiterChar)}var e=f(!0,{},c,e||{});return e.useDotNetDateFormat&&(e.formatters[0]={accept:s.testObject,format:s.format}),{decode:t,encode:n}}var a=(e("./_utils.js"),e("./_iterateObject.js")),o=e("./_parser.js"),i=e("./_apply.js"),s=e("json-dotnet-date")(),u=e("iso8601-date"),f=e("just-extend"),c={arrayOpenChar:"(",arrayCloseChar:")",propAccessChar:".",setValueChar:"=",queryDelimiterChar:"&",useDotNetDateFormat:!1,lowercaseNames:!1,formatters:[{accept:u.testObject,format:u.format}],parsers:[{accept:function(e){var t=/^\d+$/i,r=/^\d+(?:\.\d+)$/i;return t.test(e)||r.test(e)},parse:function(e){var t=/^\d+$/i,r=/^\d+(?:\.\d+)$/i;if(r.exec(e))return parseFloat(e);if(t.exec(e))return parseInt(e);throw"Unexpected value: "+e}},{accept:u.testStr,parse:u.parse},{accept:s.testStr,parse:s.parse}]};n.defaultOptions=c,t.exports=n},{"./_apply.js":5,"./_iterateObject.js":6,"./_parser.js":7,"./_utils.js":8,"iso8601-date":1,"json-dotnet-date":3,"just-extend":4}]},{},[9])(9)});