const { Merger } = require( '../dist/index.cjs' );

const merger = new Merger();

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

const source = {
  user: {
    name: 'Max Mustermann',
    age: 31,
    address: {
      city: 'Berlin',
      zip: '10115'
    }
  },
  tags: [ 'lead', 'customer' ]
};

merger.merge( obj, source );
console.log( obj );

const source2 = {
  city: 'Hamburg',
  zip: '20095'
};

merger.mergeAt( obj, 'user.address', source2 );
console.log( obj );
