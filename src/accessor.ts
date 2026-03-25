import { CompiledPath, Path, PathOptions, PathToken } from './path';

export class Accessor {

    private readonly path: Path;

    constructor ( options: PathOptions = {} ) {
        this.path = new Path ( options );
    }

    private normalize ( path: string | CompiledPath ) : PathToken[] {
        return this.path.normalize( path ).tokens;
    }

}

const defaultAccessor = new Accessor ();
