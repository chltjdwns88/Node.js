// Create Read Update Delete

var arr = ['A', 1 , true, false];
console.log(arr);

for(var i = 0; i < arr.length; i++){
  if(i === 3){
    arr[i] = true;
  }
  console.log(arr[i]);
}
arr.push('today');
console.log(arr);
