// const cheetahify = require('./native-binding.node');

// function makeFaster() {
//   // `cheetahify()` *synchronously* calls speedy.
//   cheetahify(function speedy() {
//     throw new Error('oh no!');
//   });
// }


// while(true)makeFaster();

setTimeout(function() {
  throw new Error('User generated fault.');
}, 200);
setTimeout(function() {
    throw new Error('User generated fault.');
  }, 200);
