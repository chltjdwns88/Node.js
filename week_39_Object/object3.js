var v1 = 'v1';
var v2 = 'v2';


var o = {
  v1:'v1',
  v2:'v2',
}

console.log(o.v1);
console.log(o[v1]);

function f1(){
  console.log(o.v1);
}
function f2(){
  console.log(o.v2);
}

f1();
f2();


//해결법

var wow = {
  v1:'v1',
  v2:'v2',
  f1:function(){
    console.log('wow-f1()');
    console.log(this.v1);
  },
  f2:function(){
    console.log('wow-f2()');
    console.log(this.v2);
  }
}

wow.f1();
wow.f2();
