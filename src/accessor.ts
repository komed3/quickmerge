import { CompiledPath, Path, PathOptions, PathToken } from './path';

export class Accessor {

    private readonly path: Path;

    constructor ( options: PathOptions = {} ) {
        this.path = new Path ( options );
    }

    private normalize ( path: string | CompiledPath ) : PathToken[] {
        return this.path.normalize( path ).tokens;
    }

    private walk ( obj: any, tokens: PathToken[], create: boolean ) : { parent: any; key: PathToken; value: any } | undefined {
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

    public has < O = any > ( obj: O, path: string | CompiledPath ) : boolean {
        const tokens = this.normalize( path );
        let cur: any = obj;

        for ( let i = 0; i < tokens.length; i++ ) {
            if ( cur == null || !( tokens[ i ] in cur ) ) return false;
            cur = cur[ tokens[ i ] ];
        }

        return true;
    }

}

const defaultAccessor = new Accessor ();
