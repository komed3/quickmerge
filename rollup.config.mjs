import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import cleanup from 'rollup-plugin-cleanup';
import prettier from 'rollup-plugin-prettier';

export default {
    input: 'src/index.ts',
    plugins: [
        resolve( { extensions: [ '.js', '.ts' ] } ), commonjs(),
        typescript( { tsconfig: 'tsconfig.json', compilerOptions: { declaration: false } } ),
        cleanup( { comments: 'istanbul', extensions: [ 'js', 'ts' ] } ),
        prettier( {
            parser: 'babel', tabWidth: 2, bracketSpacing: true, bracketSameLine: true, singleQuote: true,
            jsxSingleQuote: true, trailingComma: 'none', objectWrap: 'collapse'
        } )
    ],
    output: [ {
        dir: 'dist',
        format: 'cjs',
        entryFileNames: '[name].cjs',
        preserveModules: true,
        exports: 'named'
    }, {
        dir: 'dist',
        format: 'es',
        entryFileNames: '[name].mjs',
        preserveModules: true
    }, {
        file: 'dist/bundle.umd.js',
        format: 'umd',
        name: 'QuickMerge'
    }, {
        file: 'dist/bundle.umd.min.js',
        format: 'umd',
        name: 'QuickMerge',
        plugins: [ terser() ]
    } ]
};
