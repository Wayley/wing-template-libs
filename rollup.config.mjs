import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { readFileSync } from 'fs';
import { builtinModules } from 'module';
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const name = pkg.name.replaceAll(/-|\./g, '_');

const output = [
  'amd', // 异步模块加载，适用于 RequireJS 等模块加载器
  'cjs', // CommonJS，适用于 Node 环境和其他打包工具（别名：commonjs）
  'es', // 将 bundle 保留为 ES 模块文件，适用于其他打包工具，以及支持 <script type=module> 标签的浏览器。（别名：esm，module）
  'iife', // 自执行函数，适用于 <script> 标签（如果你想为你的应用程序创建 bundle，那么你可能会使用它）。iife 表示“自执行 函数表达式”
  'umd', // 通用模块定义规范，同时支持 amd，cjs 和 iife
  'system', //  SystemJS 模块加载器的原生格式（别名：systemjs）
].map((format) => ({ format, file: `dist/index.${format}.js`, name }));

export default {
  input: 'src/index.ts',
  external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {}), ...builtinModules],
  onwarn: (warning) => {
    throw Object.assign(new Error(), warning);
  },
  strictDeprecations: true,
  output,
  plugins: [terser(), typescript()],
};
