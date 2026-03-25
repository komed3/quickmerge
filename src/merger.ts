import { Path, PathOptions } from './path';

export const enum ArrayMode {
    Replace = 'replace',
    Concat = 'concat',
    Unique = 'unique',
    Keep = 'keep'
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

    private mergeArrayFn ( mode?: ArrayMode | ArrayFn ) : ArrayFn {

    }

}
