import { CompiledPath, Path, PathLike, PathOptions, PathToken } from './path';

export class Accessor {

    private readonly path: Path;

    constructor ( options: PathOptions = {} ) {
        this.path = new Path ( options );
    }

    private test ( obj: any, path: PathLike ) : any {
        const tokens = this.path.normalize( path ).tokens;
        let cur: any = obj;

        for ( let i = 0; i < tokens.length; i++ ) {
            if ( cur == null ) throw Error ();
            cur = cur[ tokens[ i ] ];
        }

        return cur;
    }

    private walk ( obj: any, path: PathLike, create: boolean ) : { parent: any, key: PathToken, value: any } | undefined {
        const tokens = this.path.normalize( path ).tokens;
        let cur = obj;

        for ( let i = 0; i < tokens.length - 1; i++ ) {
            const key = tokens[ i ];
            let next = cur?.[ key ];

            if ( next == null ) {
                if ( ! create ) return;

                next = typeof tokens[ i + 1 ] === 'number' ? [] : {};
                cur[ key ] = next;
            }

            cur = next;
        }

        const lastKey = tokens[ tokens.length - 1 ];
        return { parent: cur, key: lastKey, value: cur?.[ lastKey ] };
    }

    public compiledPath ( path: PathLike ) : CompiledPath {
        return this.path.normalize( path );
    }

    public has < O = any > ( obj: O, path: PathLike ) : boolean {
        try { this.test( obj, path ); return true }
        catch { return false }
    }

    public get < O = any, V = any > ( obj: O, path: PathLike ) : V | undefined {
        try { return this.test( obj, path ) }
        catch { /** silence */ }
    }

    public set < O = any, V = any > ( obj: O, path: PathLike, value: V ) : void {
        const res = this.walk( obj, path, true );
        if ( res ) res.parent[ res.key ] = value;
    }

    public delete< O = any > ( obj: O, path: PathLike ) : void {
        const res = this.walk( obj, path, false );
        if ( res && res.parent != null ) delete res.parent[ res.key ];
    }

    public update< O = any > ( obj: O, path: PathLike, fn: ( v: any ) => any ) : void {
        const res = this.walk( obj, path, true );
        if ( res ) res.parent[ res.key ] = fn( res.value );
    }

}

const defaultAccessor = new Accessor ();
