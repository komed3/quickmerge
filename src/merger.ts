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
}
