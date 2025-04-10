// 引入必要的模块和插件
import globals from 'globals' // 提供预定义全局变量的集合
import pluginJs from '@eslint/js' // ESLint 官方提供的 JavaScript 规则插件
import pluginVue from 'eslint-plugin-vue' // Vue 专用的 ESLint 插件

export default [
  // 基础配置：适用于所有 `.js`, `.mjs`, `.cjs`, `.vue` 文件
  {
    files: ['**/*.{js,mjs,cjs,vue}'], // 指定该配置应用的文件类型
    languageOptions: {
      globals: { ...globals.browser }, // 将浏览器环境中的全局变量（如 `window`）标记为可用
    },
  },

  // 使用插件推荐的基础规则配置
  pluginJs.configs.recommended, // 应用官方推荐的 JavaScript 规则
  ...pluginVue.configs['flat/essential'], // 展开并应用 Vue 插件的核心规则集

  // 自定义规则：覆盖 Vue 插件的默认规则
  {
    files: ['**/*.vue'], // 仅对 `.vue` 文件生效
    rules: {
      'vue/multi-word-component-names': 'off', // 禁用强制要求多单词组件名称的规则
    },
  },

  // 针对纯 JavaScript 文件的额外配置
  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'], // 仅对 `.js`, `.cjs`, `.mjs` 文件生效
    languageOptions: {
      globals: {
        module: 'writable', // 允许修改 `module` 全局变量
        exports: 'writable', // 允许修改 `exports` 全局变量
        require: 'readonly', // 只读访问 `require` 全局变量
      },
    },
  },
]
