var name = 'sungjune';
// var letter = 'Draeoakwoda' + name + ' wow !' + 'awojdpaowkd
// awko;da
// awpdok';
//error 발생!!

var letter = 'daokwpda' + name + 'aowdkpo\
awasdasdas\
d\n\
hihihihi\
';
console.log(letter);


// 템플릿 리터럴 사용

var letter = `Dear ${name}

hi i'm sungjune ${1+100}

real ${name}`;

console.log(letter);
