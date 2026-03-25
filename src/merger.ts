import { Path, PathOptions } from './path';

export const enum ArrayMode {
    Replace = 'replace',
    Keep = 'keep',
    Concat = 'concat',
    Unique = 'unique'
}

export type ArrayFn = ( target: any[], source: any[] ) => any[];

export interface MergeOptions {
    deep?: boolean;
    protect?: boolean;
    mergeUndefined?: boolean;
    arrayMode?: ArrayMode | ArrayFn;
    pathOptions?: PathOptions;
}

export class Merger {

    private readonly deep: boolean;
    private readonly protect: boolean;
    private readonly mergeUndefined: boolean;

    private readonly arrayFn: ArrayFn;
    private readonly path: Path;

    constructor ( options: MergeOptions ) {
        this.deep = options.deep !== false;
        this.protect = !! options.protect;
        this.mergeUndefined = !! options.mergeUndefined;

        this.arrayFn = this.compileArrayFn( options.arrayMode );
        this.path = new Path ( options.pathOptions );
    }

    private compileArrayFn ( mode?: ArrayMode | ArrayFn ) : ArrayFn {
        switch ( mode ?? ArrayMode.Replace ) {
            case ArrayMode.Replace: return ( _a, b ) => b;
            case ArrayMode.Keep: return ( a, _b ) => a;
            case ArrayMode.Concat: return ( a, b ) => a.concat( b );
            case ArrayMode.Unique: return ( a, b ) => {
                const set = new Set( a );
                for ( let i = 0; i < b.length; i++ ) set.add( b[ i ] );
                return Array.from( set );
            };
        }

        if ( typeof mode === 'function' ) return mode;
        else throw new Error ( `Invalid array merge mode: ${ mode }` );
    }

}
