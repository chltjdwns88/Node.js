// 자바스크립트에서는 함수가 값이다!! 즉

// function a(){
//   console.log('A');
// }

var a = function(){
  console.log('A');
}

function slowfunc(callback){
  callback();
}

slowfunc(a);
