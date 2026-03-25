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
import { Merger, type MergeOptions } from './merger';
import { Path } from './path';

export * from './accessor';
export * from './merger';
export * from './path';


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
