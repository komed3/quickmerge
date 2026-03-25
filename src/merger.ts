import { Path, PathOptions } from './path';

export const enum ArrayMode {
    Replace = 'replace',
    Keep = 'keep',
    Concat = 'concat',
    Unique = 'unique'
}

export type ArrayFn = ( target: any[], source: any[] ) => any[];

export interface MergeOptions {
    protect?: boolean;
    deep?: boolean;
    mergeUndefined?: boolean;
    arrayMode?: ArrayMode | ArrayFn;
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

}
