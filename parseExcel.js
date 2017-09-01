var xlsx = require('node-xlsx');
var fs = require('fs');
// Or var xlsx = require('node-xlsx').default;

// Parse a file
const data = xlsx.parse(`${__dirname}/eeee.xlsx`);

var sheet = data[0];

var allwords = sheet.data;

var longCount = 0,splitCount = 0;
var longSplitCount = 0;
var nosearchCount = 0;
var spilitNosearchCount = 0;
allwords.forEach(arr => {
  var match = 0;
  var match2 = 0;
  var v = arr[0];
  if(v.length > 8){
    longCount++;
    match++;
  }
  if(v.indexOf('-') != -1){
    splitCount++;
    match++;
    match2++;
  }

  if(arr[3] == 0){
    nosearchCount++;
    match++;
    match2++;
  }

if(match === 3){
  longSplitCount++;
}

if(match2===2){
spilitNosearchCount++
}

})

console.log(allwords.length,longCount,splitCount,nosearchCount,longSplitCount,spilitNosearchCount);