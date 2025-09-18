# remark-plugin-props-docgen

[![npm version](https://img.shields.io/npm/v/@thinke/remark-plugin-props-docgen)](https://www.npmjs.com/package/@thinke/remark-plugin-props-docgen)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个remark插件，用于从React组件自动生成属性文档表格。

## 功能

- 解析React/Solidjs组件属性（props）并生成Markdown表格
- 支持TypeScript组件
- 可自定义文档生成逻辑
- 与MDX无缝集成

## Install

```bash
npm install @thinke/remark-plugin-props-docgen --save-dev
# or
pnpm install -D @thinke/remark-plugin-props-docgen
```

## 使用

在Markdown/MDX文件中使用`<docgen>`标签指定组件路径：

```mdx
<docgen src="./path/to/your/Component.tsx" />
```

插件会自动解析组件属性并生成文档表格。

## 配置

在remark配置中添加插件并传入选项：

```js
import remarkDocgen from '@thinke/remark-plugin-props-docgen';

remark()
  .use(remarkDocgen, {
    // 自定义文档生成函数
    transformToMarkdown: (componentDoc) => {
      // 返回自定义Markdown字符串
    },
    // react-docgen-typescript解析选项
    docgenParserOptions: {
      propFilter: (prop) => !prop.parent
    }
  })
```

### 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `transformToMarkdown` | `(data: ComponentDoc) => string` | 默认表格生成器 | 自定义文档生成函数 |
| `docgenParserOptions` | `ParserOptions` | `{}` | react-docgen-typescript解析选项 |

## 示例输出

插件会生成如下格式的表格：

```markdown
## API

| propName | 说明 | 类型 | 默认值 |
|----------|------|------|---------|
| name | 名称 | `string` | `'TestCom'` |
| age | 年龄<br/><br/>多行注释<br/>多<br/>行 | `number` | `18` |
| gender | 性别 | `"male" \| "female"` | - |
```

## API参考

### `remarkDocgen(options?: Options)`

插件主函数，接受可选配置对象。

#### `Options`
```ts
interface Options {
  transformToMarkdown?: (data: ComponentDoc) => string;
  docgenParserOptions?: docgen.ParserOptions;
}
```

