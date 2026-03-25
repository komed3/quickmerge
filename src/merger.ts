/**
 * Merger provides powerful and flexible object merging capabilities.
 * 
 * It supports deep merging, multiple array merge modes, custom value handlers,
 * and path-based merging. The implementation is optimized for performance
 * using a non-recursive stack-based approach.
 * 
 * @author Paul Köhler
 * @license MIT
 */

import { Path, PathLike, PathOptions } from './path';


/**
 * Defines how arrays should be merged when they exist in both target and source.
 */
export const enum ArrayMode {
    /** Replace the target array with the source array (default). */
    Replace = 'replace',
    /** Keep the target array and ignore the source array. */
    Keep = 'keep',
    /** Concatenate the source array to the target array. */
    Concat = 'concat',
    /** Merge unique elements from both arrays. */
    Unique = 'unique'
}

/** Function signature for custom array merging logic. */
export type ArrayFn = ( target: any[], source: any[] ) => any[];

/** Function signature for custom value merging logic. */
export type ValueFn = ( key: PropertyKey, targetVal: any, sourceVal: any ) => any;

/** Configuration options for the Merger. */
export interface MergeOptions {
    /** If true, existing properties in the target are not overwritten. */
    protect?: boolean;
    /** Whether to perform a deep merge (defaults to true). */
    deep?: boolean;
    /** If true, undefined values in the source will overwrite target values (defaults to false). */
    mergeUndefined?: boolean;
    /** If true, only existing objects in the target will be merged into. */
    strict?: boolean;
    /** Factory function for creating new objects during deep merge (defaults to Object.create( null )). */
    createObject?: () => any;
    /** The mode for merging arrays or a custom merge function. */
    arrayMode?: ArrayMode | ArrayFn;
    /** A custom function to handle specific value merging. */
    valueFn?: ValueFn;
    /** Options for the internal Path handler used in mergeAt. */
    pathOptions?: PathOptions;
}


/**
 * The Merger class implements the core logic for deep-merging objects.
 * It is designed to be highly configurable and efficient.
 */
export class Merger {

    /** Whether to protect existing properties in the target. */
    private readonly protect: boolean;

    /** Whether to perform deep merging. */
    private readonly deep: boolean;

    /** Whether to allow merging of undefined values. */
    private readonly mergeUndefined: boolean;

    /** Whether to operate in strict mode (no creation of missing structures). */
    private readonly strict: boolean;

    /** Function to create new objects when needed. */
    private readonly createObject: () => any;

    /** Custom value merging function. */
    private readonly valueFn?: ValueFn;

    /** Internal function used for array merging. */
    private readonly arrayFn: ArrayFn;

    /** Internal Path instance for path-based operations. */
    private readonly path: Path;

    /**
     * Creates a new Merger instance with the specified options.
     * 
     * @param {MergeOptions} options - Configuration options for the Merger.
     */
    constructor ( options: MergeOptions = {} ) {
        this.protect = !! options.protect;
        this.deep = options.deep !== false;
        this.mergeUndefined = !! options.mergeUndefined;

        this.strict = !! options.strict;
        this.createObject = options.createObject ?? ( () => Object.create( null ) );

        this.valueFn = options.valueFn;
        this.arrayFn = this.compileArrayFn( options.arrayMode );

        this.path = new Path ( options.pathOptions );
    }

    /**
     * Compiles an array merge mode or function into an ArrayFn.
     * 
     * @param {ArrayMode | ArrayFn} [mode] - The mode or function to compile.
     * @returns {ArrayFn} The compiled array merge function.
     * @throws {Error} If an invalid mode is provided.
     */
    private compileArrayFn ( mode?: ArrayMode | ArrayFn ) : ArrayFn {
        switch ( mode ?? ArrayMode.Replace ) {
            case ArrayMode.Replace: return ( _, s ) => s;
            case ArrayMode.Keep: return ( t, _ ) => t;
            case ArrayMode.Concat: return ( t, s ) => t.concat( s );
            case ArrayMode.Unique: return ( t, s ) => {
                const set = new Set( t );
                for ( let i = 0; i < s.length; i++ ) set.add( s[ i ] );
                return Array.from( set );
            };
        }

        if ( typeof mode === 'function' ) return mode;
        else throw new Error ( `Invalid array merge mode: ${ mode }` );
    }

    /**
     * Checks if a key is considered "unsafe" for object manipulation.
     * 
     * @param {any} key - The key to check.
     * @returns {boolean} True if the key is unsafe, otherwise false.
     */
    private isUnsafeKey ( key: any ) : boolean {
        return key === '__proto__' || key === 'constructor' || key === 'prototype';
    }

    /**
     * Performs the actual merging of a source object into a target object.
     * This method uses a stack-based approach to avoid recursion for better performance.
     * 
     * @param {any} target - The destination object.
     * @param {any} source - The source object to merge from.
     */
    private mergeInto ( target: any, source: any ) : void {
        if ( source == null ) return;
        const stack: [ any, any ][] = [ [ target, source ] ];

        while ( stack.length ) {
            const [ t, s ] = stack.pop()!;

            for ( const key in s ) {
                if ( this.isUnsafeKey( key ) ) continue;
                const sv = s[ key ], tv = t[ key ];

                // Handle undefined values
                if ( sv === undefined && ! this.mergeUndefined ) continue;
                // Protect existing properties
                if ( this.protect && key in t ) continue;

                // Handle custom value function
                if ( this.valueFn ) {
                    const res = this.valueFn( key, tv, sv );
                    if ( res !== undefined ) { t[ key ] = res; continue; }
                }

                // Handle arrays
                if ( Array.isArray( sv ) ) {
                    if ( Array.isArray( tv ) ) t[ key ] = this.arrayFn( tv, sv );
                    else t[ key ] = this.arrayFn( [], sv );
                    continue;
                }

                // Handle objects (deep merge)
                if ( this.deep && sv && typeof sv === 'object' ) {
                    if ( tv && typeof tv === 'object' ) stack.push( [ tv, sv ] );
                    else {
                        if ( this.strict ) continue;

                        const next = this.createObject();
                        t[ key ] = next;
                        stack.push( [ next, sv ] );
                    }

                    continue;
                }

                // Handle primitives
                t[ key ] = sv;
            }
        }
    }

    /**
     * Merges one or more source objects into the specified target object.
     * 
     * @template T
     * @param {T} target - The target object to merge into.
     * @param {...any[]} sources - One or more source objects.
     * @returns {T} The updated target object.
     */
    public merge < T > ( target: T, ...sources: any[] ) : T {
        for ( let i = 0; i < sources.length; i++ ) this.mergeInto( target, sources[ i ] );
        return target;
    }

    /**
     * Merges source objects into the target object at a specific path.
     * 
     * @template T
     * @param {T} target - The target object.
     * @param {PathLike} path - The path inside the target where sources should be merged.
     * @param {...any[]} sources - One or more source objects to merge.
     * @returns {T} The updated target object.
     */
    public mergeAt < T > ( target: T, path: PathLike, ...sources: any[] ) : T {
        const tokens = this.path.normalize( path ).tokens;
        let cur: any = target;

        for ( let i = 0; i < tokens.length; i++ ) {
            const key = tokens[ i ];
            if ( this.isUnsafeKey( key ) ) return target;
            let next = cur[ key ];

            if ( next == null ) {
                if ( this.strict ) return target;

                next = typeof tokens[ i + 1 ] === 'number' ? [] : this.createObject();
                cur[ key ] = next;
            }

            cur = next;
        }

        for ( let i = 0; i < sources.length; i++ ) this.mergeInto( cur, sources[ i ] );
        return target;
    }

}
