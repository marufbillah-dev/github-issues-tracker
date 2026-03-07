# Questions and Answers

## 1. What is the difference between var, let, and const?
### answer: we can declare variable in javasript in three way, using var, let and const.

```var``` is the old way to declare variable. it have function scope, it hoisting and sometimes make problem because it can be redeclare again.

```let``` is newer and introduced in ES6. it have block scope. we can change the value later but cannot declare same variable again in same scope.

```const``` is also block scope like let but the value cannot be changed after we assign it. that's why we use this most because it more safe.

## 2. What is the spread operator (...)?
### answer: spread operator (...) is used to spread or expand elements from array or object.

example with an array:
```
const numbers = [1, 2, 3];
const newNumbers = [...numbers, 4, 5];
```
now ```newNumbers``` will be ```[1,2,3,4,5]```.

we also use this to copy or combine arrays.

## 3. What is the difference between map(), filter(), and forEach()?
### answer: these are methods but they work little bit different.

```map()```: loop through array and return a new array after modifying each item.

```filter()```: return new array but only with the items that match the condition.

```forEach()```: just loop through array but it doesnt return new array.

example:
```
const numbers = [1,2,3,4];

numbers.map(n => n * 2); 
// [2,4,6,8]

numbers.filter(n => n > 2);
// [3,4]

numbers.forEach(n => console.log(n));
// just console values
```

## 4. What is an arrow function?
### answer: arrow function is a shorter way to write function in javascript it introduced in ES6 and make code more clean. we use this arrow fuction most of time.

example:

normal function:
```
function add(a, b) {
  return a + b;
}
```
arrow function:
```
const add = (a, b) => {
  return a + b;
};
```
also we can execute single line operation like this:
```
const add = (a, b) => a + b;
```

## 5. What are template literals?
### answer: template literals is used to write string in easier way and we can put variable inside string.

we use double backtick ```(` `)``` instead of double quotes.

example:
```
const firstName = "Maruf";
const lastName = "Billah"
const msg = `Hello my name is ${firstName} ${lastName}`;
```
output:
```
Hello my name is Maruf Billah
```
its helpful when we need dynamic text inside string so we can create dynamic template.

















