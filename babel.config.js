module.exports = {
  presets: [
    '@vue/app',
  ],
  plugins: ['@babel/plugin-proposal-export-default-from'],

  // 修复 cli 打包错误， "Cannot assign to read only property 'exports' of object '#<Object>"
  // 可能导致原因 babel, node_modules 依赖关系
  // 未能完成确切修复，暂这样解决，无法确定后续会不会造成其他影响
  sourceType: 'unambiguous',
}
