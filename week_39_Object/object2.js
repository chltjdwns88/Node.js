var f = function(){
  console.log(1);
  console.log(2);
}

var a = [f];
a[0]();

var o = {
  func:f   // 객체에 key와 value값으로 함수를 담는 방법
}
o.func();
