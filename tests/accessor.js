const { Accessor } = require( '../dist/index.cjs' );

const accessor = new Accessor();

const obj = {
  user: {
    name: 'Max',
    age: 30,
    address: {
      city: 'Berlin',
      zip: '10115'
    }
  },
  tags: [ 'lead', 'customer' ]
};

console.log( accessor.get( obj, 'user.name' ) );
console.log( accessor.get( obj, 'user.age' ) );
console.log( accessor.get( obj, 'user.address.city' ) );
console.log( accessor.get( obj, 'user.address.zip' ) );
console.log( accessor.get( obj, 'tags[0]' ) );
console.log( accessor.get( obj, 'tags[1]' ) );

accessor.set( obj, 'user.name', 'Max Mustermann' );
accessor.set( obj, 'user.age', 31 );
accessor.set( obj, 'user.address.city', 'Berlin' );
accessor.set( obj, 'user.address.zip', '10115' );
accessor.set( obj, 'tags[0]', 'lead' );
accessor.set( obj, 'tags[1]', 'customer' );

console.log( accessor.get( obj, 'user.name' ) );
console.log( accessor.get( obj, 'user.age' ) );
console.log( accessor.get( obj, 'user.address.city' ) );
console.log( accessor.get( obj, 'user.address.zip' ) );
console.log( accessor.get( obj, 'tags[0]' ) );
console.log( accessor.get( obj, 'tags[1]' ) );

accessor.update( obj, 'user.name', v => v.toUpperCase() );
accessor.update( obj, 'user.age', v => v + 1 );
accessor.update( obj, 'user.address.city', v => v.toUpperCase() );
accessor.update( obj, 'user.address.zip', v => v.toUpperCase() );
accessor.update( obj, 'tags[0]', v => v.toUpperCase() );
accessor.update( obj, 'tags[1]', v => v.toUpperCase() );

console.log( accessor.get( obj, 'user.name' ) );
console.log( accessor.get( obj, 'user.age' ) );
console.log( accessor.get( obj, 'user.address.city' ) );
console.log( accessor.get( obj, 'user.address.zip' ) );
console.log( accessor.get( obj, 'tags[0]' ) );
console.log( accessor.get( obj, 'tags[1]' ) );

accessor.delete( obj, 'user.name' );
accessor.delete( obj, 'user.age' );
accessor.delete( obj, 'user.address.city' );
accessor.delete( obj, 'user.address.zip' );
accessor.delete( obj, 'tags[0]' );
accessor.delete( obj, 'tags[1]' );

console.log( accessor.get( obj, 'user.name' ) );
console.log( accessor.get( obj, 'user.age' ) );
console.log( accessor.get( obj, 'user.address.city' ) );
console.log( accessor.get( obj, 'user.address.zip' ) );
console.log( accessor.get( obj, 'tags[0]' ) );
console.log( accessor.get( obj, 'tags[1]' ) );
