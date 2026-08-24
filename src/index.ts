/**
 * DeepMerge is a fast and flexible object merging library.
 * 
 * Use the factory function to create a new instance of DeepMerge or
 * import the individual classes to create your own instances.
 * 
 * @author Paul Köhler
 * @license MIT
 */

import { Accessor } from './accessor';
import type { ArrayFn, MergeOptions, ValueFn } from './merger';
import { ArrayMode, Merger } from './merger';
import type { CompiledPath, PathLike, PathOptions, PathToken } from './path';
import { Path } from './path';


/** Exports the types and interfaces used in DeepMerge. */
export { ArrayFn, ArrayMode, CompiledPath, PathLike, PathOptions, PathToken, ValueFn };


/**
 * Creates a new instance of DeepMerge.
 * 
 * @param {MergeOptions} options - Configuration options for the DeepMerge instance.
 * @returns {DeepMerge} A new instance of DeepMerge.
 */
export const factory = ( options?: MergeOptions ) => Object.freeze( {
  accessor: new Accessor( options?.pathOptions ),
  merger: new Merger( options ),
  path: new Path( options?.pathOptions )
} );


/** Exports the main DeepMerge object. */
export const DeepMerge = { Accessor, Merger, Path, factory } as const;
