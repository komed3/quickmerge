/**
 * Accessor provides high-level methods for interacting with nested object structures.
 * 
 * It allows for safe getting, setting, deleting, and updating of values at specific paths.
 * The class handles path normalization and provides protection against prototype pollution.
 * 
 * @author Paul Köhler
 * @license MIT
 */

import { Path, PathLike, PathOptions, PathToken } from './path';


/**
 * The Accessor class provides a set of methods to access and manipulate data within objects
 * using path strings or compiled path objects.
 */
export class Accessor {

    /** The internal Path instance used for path normalization and compilation. */
    private readonly path: Path;

    /**
     * Creates a new Accessor instance with the given path options.
     * 
     * @param {PathOptions} [options={}] - Configuration options for the internal Path handler.
     */
    constructor ( options: PathOptions = {} ) {
        this.path = new Path ( options );
    }

    /**
     * Checks if a key is considered "unsafe" for object manipulation (prototype pollution protection).
     * 
     * @param {any} key - The key to check.
     * @returns {boolean} True if the key is unsafe, otherwise false.
     */
    private isUnsafeKey ( key: any ) : boolean {
        return key === '__proto__' || key === 'constructor' || key === 'prototype';
    }

    /**
     * Internal method to traverse an object structure following a given path.
     * 
     * @param {any} obj - The target object to walk through.
     * @param {PathLike} path - The path to follow.
     * @param {boolean} create - Whether to create missing objects/arrays along the path.
     * @returns {{ parent: any, key: PathToken, value: any } | undefined} An object containing the parent, key, and value at the end of the path, or undefined if not found.
     */
    private walk ( obj: any, path: PathLike, create: boolean ) : { parent: any, key: PathToken, value: any } | undefined {
        const tokens = this.path.normalize( path ).tokens;
        let cur = obj;

        for ( let i = 0; i < tokens.length - 1; i++ ) {
            const key = tokens[ i ];
            if ( this.isUnsafeKey( key ) ) return;
            let next = cur?.[ key ];

            if ( next == null ) {
                if ( ! create ) return;

                next = typeof tokens[ i + 1 ] === 'number' ? [] : {};
                cur[ key ] = next;
            }

            cur = next;
        }

        const lastKey = tokens[ tokens.length - 1 ];

        // @ts-ignore
        return { parent: cur, key: lastKey, value: cur?.[ lastKey ] };
    }

    /**
     * Checks if a value exists at the specified path within an object.
     * 
     * @template O
     * @param {O} obj - The object to check.
     * @param {PathLike} path - The path to verify.
     * @returns {boolean} True if the path exists, otherwise false.
     */
    public has < O = any > ( obj: O, path: PathLike ) : boolean {
        const tokens = this.path.normalize( path ).tokens;
        let cur: any = obj;

        for ( let i = 0; i < tokens.length; i++ ) {
            if ( cur == null ) return false;
            cur = cur[ tokens[ i ] ];
        }

        return true;
    }

    /**
     * Retrieves the value at the specified path within an object.
     * 
     * @template O, V
     * @param {O} obj - The object to retrieve the value from.
     * @param {PathLike} path - The path to the value.
     * @returns {V | undefined} The value at the path, or undefined if not found.
     */
    public get < O = any, V = any > ( obj: O, path: PathLike ) : V | undefined {
        const tokens = this.path.normalize( path ).tokens;
        let cur: any = obj;

        for ( let i = 0; i < tokens.length; i++ ) {
            if ( cur == null ) return undefined;
            cur = cur[ tokens[ i ] ];
        }

        return cur;
    }

    /**
     * Sets a value at the specified path within an object, creating missing structures if necessary.
     * 
     * @template O, V
     * @param {O} obj - The object to modify.
     * @param {PathLike} path - The path where the value should be set.
     * @param {V} value - The value to set.
     */
    public set < O = any, V = any > ( obj: O, path: PathLike, value: V ) : void {
        const res = this.walk( obj, path, true );
        if ( res ) res.parent[ res.key ] = value;
    }

    /**
     * Deletes the property/index at the specified path within an object.
     * 
     * @template O
     * @param {O} obj - The object to modify.
     * @param {PathLike} path - The path to the property to delete.
     */
    public delete < O = any > ( obj: O, path: PathLike ) : void {
        const res = this.walk( obj, path, false );
        if ( res && res.parent != null ) delete res.parent[ res.key ];
    }

    /**
     * Updates the value at the specified path using a transformation function.
     * 
     * @template O
     * @param {O} obj - The object to modify.
     * @param {PathLike} path - The path to the value to update.
     * @param {( v: any ) => any} fn - The function to transform the existing value.
     */
    public update < O = any > ( obj: O, path: PathLike, fn: ( v: any ) => any ) : void {
        const res = this.walk( obj, path, true );
        if ( res ) res.parent[ res.key ] = fn( res.value );
    }

}
