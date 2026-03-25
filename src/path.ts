export type PathToken = string | number;

export interface CompiledPath {
    readonly tokens: PathToken[];
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

    public compile ( path: string ) : CompiledPath {
        if ( ! path ) return Object.freeze( { tokens: [] } );

        if ( this.cache ) {
            const cached = this.cache.get( path );
            if ( cached ) return cached;
        }

        const tokens: PathToken[] = [];
        let i = 0, key = '';

        while ( i < path.length ) {
            const c = path.charCodeAt( i );

            // dot "."
            if ( c === 46 ) {
                if ( key ) { tokens.push( key ), key = '' }
                i++; continue;
            }

            // "[" bracket
            if ( c === 91 ) {
                if ( key ) { tokens.push( key ), key = '' }

                i++; // skip '['
                const start = i;

                // find closing bracket
                while ( i < path.length && path.charCodeAt( i ) !== 93 ) i++;

                const inner: any = path.slice( start, i );
                const num = inner >>> 0;
                if ( String( num ) === inner ) tokens.push( num );
                else tokens.push( inner );

                i++; // skip ']'
                continue;
            }

            // default char
            key += path[ i ], i++;
        }

        if ( key ) tokens.push( key );
        const compiled = Object.freeze( { tokens } );

        if ( this.cache ) {
            if ( this.cache.size >= this.maxCacheSize ) this.cache.clear();
            this.cache.set( path, compiled );
        }

        return compiled;
    }

    public clearCache () : void {
        this.cache?.clear();
    }

}
