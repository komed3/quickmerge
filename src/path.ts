export type PathToken = string | number;

export interface CompiledPath {
    tokens: PathToken[];
}

export interface PathOptions {
    cache?: boolean;
    maxCacheSize?: number;
}

export class Path {}
