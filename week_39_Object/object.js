//배열
var members = ['sungjune', 'kyungmin', 'wow'];
console.log(members[1]);
var i = 0;
while(i < members.length){
  console.log('array loop', members[i]);
  i++;
}


//객체
var roles = { //key : value
  'programmer' : 'sungjune',
  'manager' : 'kyungmin',
  'hohoho' : 'wow'
}
console.log(roles.programmer);
console.log(roles['programmer']);
for(var num in roles){
  console.log('object = > ', num, 'value => ', roles[num]);
}
