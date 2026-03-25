/**
 * QuickMerge is a fast and flexible object merging library.
 * 
 * Use the factory function to create a new instance of QuickMerge or
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
 * Creates a new instance of QuickMerge.
 * 
 * @param {MergeOptions} options - Configuration options for the QuickMerge instance.
 * @returns {QuickMerge} A new instance of QuickMerge.
 */
export const factory = ( options?: MergeOptions ) => Object.freeze( {
    accessor: new Accessor( options?.pathOptions ),
    merger: new Merger( options ),
    path: new Path( options?.pathOptions )
} );
