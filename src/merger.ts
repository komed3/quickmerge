import { Path, PathLike, PathOptions } from './path';

export const enum ArrayMode {
    Replace = 'replace',
    Keep = 'keep',
    Concat = 'concat',
    Unique = 'unique'
}

export type ArrayFn = ( target: any[], source: any[] ) => any[];

export type ValueFn = ( key: PropertyKey, targetVal: any, sourceVal: any ) => any;

export interface MergeOptions {
    protect?: boolean;
    deep?: boolean;
    mergeUndefined?: boolean;

    arrayMode?: ArrayMode | ArrayFn;
    valueFn?: ValueFn;

    strict?: boolean;
    createObject?: () => any;

    pathOptions?: PathOptions;
}

export class Merger {

    private readonly protect: boolean;
    private readonly deep: boolean;
    private readonly mergeUndefined: boolean;

    private readonly arrayFn: ArrayFn;
    private readonly path: Path;

    constructor ( options: MergeOptions ) {
        this.protect = !! options.protect;
        this.deep = options.deep !== false;
        this.mergeUndefined = !! options.mergeUndefined;

        this.arrayFn = this.compileArrayFn( options.arrayMode );
        this.path = new Path ( options.pathOptions );
    }

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

    private isUnsafeKey ( key: any ) : boolean {
        return key === '__proto__' || key === 'constructor' || key === 'prototype';
    }

    private mergeInto ( target: any, source: any ) : void {
        if ( source == null ) return;
        const stack: [ any, any ][] = [ [ target, source ] ];

        while ( stack.length ) {
            const [ t, s ] = stack.pop()!;

            for ( const key in s ) {
                if ( this.isUnsafeKey( key ) ) continue;
                const sv = s[ key ], tv = t[ key ];

                // undefined handling
                if ( sv === undefined && ! this.mergeUndefined ) continue;
                // protect
                if ( this.protect && key in t ) continue;

                // arrays
                if ( Array.isArray( sv ) ) {
                    if ( Array.isArray( tv ) ) t[ key ] = this.arrayFn( tv, sv );
                    else t[ key ] = this.arrayFn( [], sv );
                    continue;
                }

                // objects (deep)
                if ( this.deep && sv && typeof sv === 'object' ) {
                    if ( tv && typeof tv === 'object' ) stack.push( [ tv, sv ] );
                    else {
                        const next = Object.create( null );
                        t[ key ] = next;
                        stack.push( [ next, sv ] );
                    }

                    continue;
                }

                // primitive
                t[ key ] = sv;
            }
        }
    }

    public merge < T > ( target: T, ...sources: any[] ) : T {
        for ( let i = 0; i < sources.length; i++ ) this.mergeInto( target, sources[ i ] );
        return target;
    }

    public mergeAt < T > ( target: T, path: PathLike, ...sources: any[] ) : T {
        const tokens = this.path.normalize( path ).tokens;
        let cur: any = target;

        for ( let i = 0; i < tokens.length; i++ ) {
            const key = tokens[ i ];

            if ( this.isUnsafeKey( key ) ) return target;

            let next = cur[ key ];

            if ( next == null ) {
                next = typeof tokens[ i + 1 ] === 'number' ? [] : Object.create( null );
                cur[ key ] = next;
            }

            cur = next;
        }

        for ( let i = 0; i < sources.length; i++ ) this.mergeInto( cur, sources[ i ] );
        return target;
    }

}
