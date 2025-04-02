import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      vue: pluginVue,
    },
    rules: {
      // 将规则放在这里，确保应用到所有文件
      "vue/multi-word-component-names": "off",
    },
  },
  // 其他配置保持不变
  pluginJs.configs.recommended,
  // 使用扩展但不覆盖我们的规则
  ...pluginVue.configs["flat/essential"],
];
