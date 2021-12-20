var fs = require('fs');


console.log('A');
var result = fs.readFileSync('../week_28_sync&aSync/sample.txt', 'utf8');
console.log(result);
console.log('C');


//   readFileSync 는 return 값 있지만
//   readFile 은 return 값 없음


console.log('A');
fs.readFile('../week_28_sync&aSync/sample.txt', 'utf8', function(err, data){
    console.log(data);
});
console.log('C');
