import { Path, PathLike, PathOptions, PathToken } from './path';

export class Accessor {

    private readonly path: Path;

    constructor ( options: PathOptions = {} ) {
        this.path = new Path ( options );
    }

    private isUnsafeKey ( key: any ) : boolean {
        return key === '__proto__' || key === 'constructor' || key === 'prototype';
    }

    private walk ( obj: any, path: PathLike, create: boolean ) : { parent: any, key: PathToken, value: any } | undefined {
        const tokens = this.path.normalize( path ).tokens;
        let cur = obj;

        for ( let i = 0; i < tokens.length - 1; i++ ) {
            const key = tokens[ i ];

            if ( this.isUnsafeKey( key ) ) return;

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

    public has < O = any > ( obj: O, path: PathLike ) : boolean {
        const tokens = this.path.normalize( path ).tokens;
        let cur: any = obj;

        for ( let i = 0; i < tokens.length; i++ ) {
            if ( cur == null ) return false;
            cur = cur[ tokens[ i ] ];
        }

        return true;
    }

    public get < O = any, V = any > ( obj: O, path: PathLike ) : V | undefined {
        const tokens = this.path.normalize( path ).tokens;
        let cur: any = obj;

        for ( let i = 0; i < tokens.length; i++ ) {
            if ( cur == null ) return undefined;
            cur = cur[ tokens[ i ] ];
        }

        return cur;
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

    public static has < O = any > ( obj: O, path: PathLike ) : boolean {
        return defaultAccessor.has( obj, path );
    }

    public static get < O = any, V = any > ( obj: O, path: PathLike ) : V | undefined {
        return defaultAccessor.get( obj, path );
    }

    public static set < O = any, V = any > ( obj: O, path: PathLike, value: V ) : void {
        defaultAccessor.set( obj, path, value );
    }

    public static delete < O = any > ( obj: O, path: PathLike ) : void {
        defaultAccessor.delete( obj, path );
    }

    public static update < O = any > ( obj: O, path: PathLike, fn: ( v: any ) => any ) : void {
        defaultAccessor.update( obj, path, fn );
    }

}

const defaultAccessor = new Accessor ();
