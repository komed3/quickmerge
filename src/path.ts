/**
 * Path provides utilities for compiling and normalizing object paths.
 * 
 * It supports dot notation (e.g., 'a.b.c') and bracket notation (e.g., 'a[0].b').
 * Efficient path compilation is achieved through optional caching.
 * 
 * @author Paul Köhler
 * @license MIT
 */


/** Represents a single segment of a path, either a string key or a numeric index. */
export type PathToken = string | number;

/** Represents a compiled path, consisting of an array of tokens. */
export interface CompiledPath {
    /** The tokens that make up the path. */
    readonly tokens: PathToken[];
}

/** Types that can be treated as a path: a string or a pre-compiled path object. */
export type PathLike = string | CompiledPath;

/** Configuration options for path handling. */
export interface PathOptions {
    /** Whether to enable caching of compiled paths (defaults to true). */
    cache?: boolean;
    /** The maximum number of paths to keep in the cache (defaults to 1000). */
    maxCacheSize?: number;
}


/**
 * The Path class handles the parsing and compilation of path strings into tokens.
 * It provides a centralized way to work with object paths across the library.
 */
export class Path {

    /** Internal cache for compiled paths. */
    private cache?: Map< string, CompiledPath >;

    /** The maximum allowed size of the path cache. */
    private maxCacheSize: number;

    /**
     * Creates a new Path instance with the specified options.
     * 
     * @param {PathOptions} [options={}] - Configuration options for the Path instance.
     */
    constructor ( options: PathOptions = {} ) {
        if ( options.cache !== false ) this.cache = new Map();
        this.maxCacheSize = options.maxCacheSize ?? 1000;
    }

    /**
     * Compiles a path string into a CompiledPath object.
     * 
     * @param {string} path - The path string to compile.
     * @returns {CompiledPath} The compiled path object.
     */
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

            // Parsing dot "."
            if ( c === 46 ) {
                if ( key ) { tokens.push( key ), key = '' }
                i++; continue;
            }

            // Parsing "[" bracket
            if ( c === 91 ) {
                if ( key ) { tokens.push( key ), key = '' }

                i++; // Skip '['
                const start = i;

                // Find closing bracket
                while ( i < path.length && path.charCodeAt( i ) !== 93 ) i++;

                const inner: any = path.slice( start, i );
                const num = inner >>> 0;
                
                if ( String( num ) === inner ) tokens.push( num );
                else tokens.push( inner );

                i++; // Skip ']'
                continue;
            }

            // Default char
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

    /**
     * Checks if a value is a CompiledPath object.
     * 
     * @param {any} path - The value to check.
     * @returns {path is CompiledPath} True if the value is a CompiledPath.
     */
    public isCompiled ( path: any ) : path is CompiledPath {
        return path && Array.isArray( path.tokens );
    }

    /**
     * Normalizes a path-like value into a CompiledPath.
     * 
     * @param {PathLike} path - The path-like value to normalize.
     * @returns {CompiledPath} The normalized CompiledPath.
     */
    public normalize ( path: PathLike ) : CompiledPath {
        return typeof path === 'string' ? this.compile( path ) : path;
    }

    /**
     * Clears the internal path cache.
     */
    public clearCache () : void {
        this.cache?.clear();
    }

    /**
     * Returns the current number of cached paths.
     * 
     * @returns {number} The size of the cache.
     */
    public get size () : number {
        return this.cache?.size ?? 0;
    }

}
