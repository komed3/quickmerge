import { CompiledPath, Path, PathOptions } from './path';

export class Accessor {

    private readonly path: Path;

    constructor ( options: PathOptions = {} ) {
        this.path = new Path( options );
    }

}

const defaultAccessor = new Accessor ();
