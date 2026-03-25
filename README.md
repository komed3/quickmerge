# QuickMerge

A fast and efficient object merging and manipulation library for Node.js and the browser, optimized for performance and flexibility.

`quickmerge` provides a high-performance `Merger` with a non-recursive stack-based implementation and a versatile `Accessor` for safe, deep object manipulation using dot and bracket notation. It includes a built-in path compiler with caching to ensure maximum efficiency during repeated operations.

## Installation

Install via npm:

```bash
npm install quickmerge
```

## Import Methods

`quickmerge` supports multiple module formats for seamless integration across different environments.

### ESM (ECMAScript Modules)
For modern projects using `import`:

```ts
import { factory, Merger, Accessor } from 'quickmerge';
```

### CommonJS
For Node.js projects using `require`:

```js
const { factory, Merger, Accessor } = require( 'quickmerge' );
```

### UMD (Browser)
Include the script in your HTML:

```html
<script src="node_modules/quickmerge/dist/index.umd.min.js"></script>
<script>
    const { factory } = quickmerge;
</script>
```

## Quick Usage

The easiest way to get started is using the `factory()` function to create a new instance with a shared configuration.

```ts
import { factory } from 'quickmerge';

// initialize with default options
const qm = factory();

const target = { user: { name: 'Max' } };
const source = { user: { role: 'admin' }, tags: [ 'lead' ] };

// deep merge objects
qm.merger.merge( target, source );
console.log( target ); // { user: { name: 'Max', role: 'admin' }, tags: [ 'lead' ] }

// safe property access using dot/bracket notation
const name = qm.accessor.get( target, 'user.name' ); // 'Max'
qm.accessor.set( target, 'user.id', 123 );
qm.accessor.update( target, 'tags[0]', v => v.toUpperCase() );

console.log( target.user.id ); // 123
console.log( target.tags ); // [ 'LEAD' ]
```

Instead of using the factory function, you can also create instances of `Merger`, `Accessor`, and `Path` directly:

```ts
import { Merger, Accessor, Path } from 'quickmerge';

const merger = new Merger( { ... } );
const accessor = new Accessor( { ... } );
const path = new Path( { ... } );
```

## API Reference

### factory( options? )
Creates an object containing pre-configured instances of `Merger`, `Accessor`, and `Path`.

```ts
const { merger, accessor, path } = factory( { deep: true, protect: false } );
```

### Merger

- `merge< T >( target: T, ...sources: any[] ) : T`  
  Performs a deep merge of all source objects into the target.
- `mergeAt< T >( target: T, path: PathLike, ...sources: any[] ) : T`  
  Merges sources into the target at a specific nested path.

### Accessor

- `get< O, V >( obj: O, path: PathLike ) : V | undefined`  
  Retrieves a value at the given path.
- `set< O, V >( obj: O, path: PathLike, value: V ) : void`  
  Sets a value at the path, creating missing structures if needed.
- `has< O >( obj: O, path: PathLike ) : boolean`  
  Checks if a nested property exists.
- `delete< O >( obj: O, path: PathLike ) : void`  
  Removes a property or array index at the path.
- `update< O >( obj: O, path: PathLike, fn: ( v: any ) => any ) : void`  
  Transforms a value at the path using a function.

### Path

- `compile( path: string ) : CompiledPath`  
  Parses a path string into tokens and caches the result.
- `normalize( path: PathLike ) : CompiledPath`  
  Ensures a path is in its compiled format.

## Options

### MergeOptions
- `deep` (boolean, default: `true`)  
  Whether to perform deep merging of nested objects.
- `protect` (boolean, default: `false`)  
  If true, existing properties in the target are not overwritten.
- `mergeUndefined` (boolean, default: `false`)  
  Whether to allow `undefined` values from sources to overwrite target values.
- `strict` (boolean, default: `false`)  
  If true, new objects/arrays will not be created when paths are missing.
- `createObject` (function, default: `() => Object.create( null )`)  
  A factory function for creating new objects when missing structures are encountered during a deep merge.
- `arrayMode` (`'replace' | 'keep' | 'concat' | 'unique'` | function, default: `'replace'`)  
  Strategy for merging arrays or a custom merge function `( target: any[], source: any[] ) => any[]`.
- `valueFn` (function)  
  A custom function to handle specific value merging logic: `( key, targetVal, sourceVal ) => any`.
- `pathOptions` (`PathOptions`)  
  Configuration for the internal path compiler.

### PathOptions
- `cache` (boolean, default: `true`)  
  Enable or disable caching of compiled path strings.
- `maxCacheSize` (number, default: `1000`)  
  The maximum number of paths to keep in the cache.

## Customization

### Custom Object Creation
Use `createObject` to control how new objects are instantiated, for example to use plain objects instead of null-prototype objects:

```ts
const qm = factory( {
  createObject: () => ( {} )
} );
```

### Custom Array Merging
Pass a function to `arrayMode` to implement your own logic, such as merging by a specific property:

```ts
const qm = factory( {
  arrayMode: ( target, source ) => {
    // custom merge logic
    return [ ...target, ...source ].filter( v => v.active );
  }
} );
```

### Custom Value Merging
Use `valueFn` to define custom logic for merging individual values:

```ts
const qm = factory( {
  valueFn: ( key, targetVal, sourceVal ) => {
    if ( key === 'count' ) {
      return targetVal + sourceVal;
    }
    return sourceVal;
  }
} );
```

## Array Modes

Control how arrays are handled during a merge using the built-in `ArrayMode` enums:

- `Replace`: Overwrites the target array with the source array (default).
- `Keep`: Retains the target array and ignores the source.
- `Concat`: Appends source elements to the target array.
- `Unique`: Combines both arrays and removes duplicates.

```ts
import { factory, ArrayMode } from 'quickmerge';

const qm = factory( { arrayMode: ArrayMode.Unique } );
const target = { ids: [ 1, 2 ] };
qm.merger.merge( target, { ids: [ 2, 3 ] } );

console.log( target.ids ); // [ 1, 2, 3 ]
```

----

Copyright (c) 2026 Paul Köhler (komed3). All rights reserved.  
Released under the MIT license. See LICENSE file in the project root for details.
