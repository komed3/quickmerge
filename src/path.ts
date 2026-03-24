export type PathToken = string | number;

export interface CompiledPath {
    tokens: PathToken[];
}

export interface PathOptions {
    cache?: boolean;
    maxCacheSize?: number;
}

export class Path {

    private cache?: Map< string, CompiledPath >;
    private maxCacheSize: number;

    constructor ( options: PathOptions = {} ) {
        if ( options.cache !== false ) this.cache = new Map();
        this.maxCacheSize = options.maxCacheSize ?? 1000;
    }

}
