import { Path, PathOptions } from './path';

export const enum ArrayMode {
    Replace = 'replace',
    Concat = 'concat',
    Unique = 'unique',
    Keep = 'keep'
}

export interface MergeOptions {
    deep?: boolean;
    protect?: boolean;
    mergeUndefined?: boolean;
    arrayMode?: ArrayMode | ( ( target: any[], source: any[] ) => any[] );
    pathOptions?: PathOptions;
}

export class Merger {

    private readonly deep: boolean;
    private readonly protect: boolean;
    private readonly mergeUndefined: boolean;

    private readonly mergeArray: ( a: any[], b: any[] ) => any[];
    private readonly path: Path;

    constructor ( options: MergeOptions ) {}

}
