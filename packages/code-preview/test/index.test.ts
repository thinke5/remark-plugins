/// <reference types="vitest/globals" />

import { compile } from '@mdx-js/mdx'
import { remark } from 'remark'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import remarkCodePreview from '../src/index.js'
import { encode as base64Encode } from 'js-base64'

const exampleMd = `# Example

\`\`\`html preview title="Code title"
<div class='foo'>Hello, World!</div>
\`\`\`
`

const exampleMdx_tsx = `# 测试的 doc

1. 测试 1
2. 测试 2\`jsx\`

代码\`tsx\`

\`\`\`tsx preview import title="计数器"
import { createSignal } from 'solid-js'

/** 计数器 ⌚️ */
export default function Counter() {
  const [num, setNum] = createSignal(0)
  return <button class="text-red font-600" onClick={() => setNum(num() + 1)}>计数 = {num()}</button>
};
\`\`\`

结束🉑
`

it('复杂转换-jsx转dataUri导入且使用其他CodePreview组件', async () => {
  const file = await compile(exampleMdx_tsx, {
    remarkPlugins: [
      [
        remarkCodePreview,
        {
          mdxJsx: true,
          contentPrefix: "import { CodePreview } from '~/codePreview';",
          template: `{import}\n\n<CodePreview preview={ {preview} } code={ {code} } title="{title}" />`,
          transformTemplateData(data: Record<string, string>) {
            if (['jsx', 'tsx'].includes(data.lang)) {
              const exampleCode = base64Encode(data.preview)
              const hash = 'mfl2m9n3__1de6zdbf0' // `${Date.now().toString(36)}__${Math.random().toString(36).substr(2, 9)}`
              const componentName = `Component_${hash}`
              const importCode = `import ${componentName} from "data:text/tsx;base64,${exampleCode}";`
              const previewCode = componentName
              const codeCode = JSON.stringify(data.preview)

              return {
                ...data,
                import: importCode,
                preview: previewCode,
                code: codeCode
              }
            }
            return data
          }
        }
      ]
    ]
  })

  expect(String(file)).toMatchSnapshot()
})

it('复杂转换-jsx转dataUri导入', async () => {
  const file = await remark()
    .use(remarkCodePreview, {
      mdxJsx: true,
      template: `{import}\n\n<figure class='foo'>
<figcaption>{title}</figcaption>
<div class='foo-preview'>
{preview}
</div>
<div class='foo-code'>
{code}
</div>
</figure>`,
      transformTemplateData(_data) {
        const data = _data as Record<string, string>
        const includeLang = ['jsx', 'tsx']
        if (includeLang.includes(data.lang)) {
          const exampleCode = base64Encode(data.preview)
          const hash = 'mfl2m9n3__1de6zdbf9' // `${Date.now().toString(36)}__${Math.random().toString(36).substr(2, 9)}`
          const componentName = `Component_${hash}`
          const importCode = `import ${componentName} from "data:text/tsx;base64,${exampleCode}";`
          const previewCode = `<${componentName} />`

          return {
            ...data,
            import: importCode,
            preview: previewCode
          }
        }
        return data
      }
    })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(exampleMdx_tsx)

  expect(String(file)).toMatchSnapshot()
})

it('可以添加文件内容前缀-import', async () => {
  const file = await compile(exampleMd, {
    remarkPlugins: [
      [
        remarkCodePreview,
        {
          mdxJsx: true,
          contentPrefix:
            "import { Foo } from 'foo';\n\nimport { Bar } from 'bar';\n\nimport { C } from 'cc';"
        }
      ]
    ]
  })

  expect(String(file)).toMatchSnapshot()
})

it('可以添加文件内容前缀', async () => {
  const file = await compile(exampleMd, {
    remarkPlugins: [
      [remarkCodePreview, { mdxJsx: true, contentPrefix: '# Test DEMO' }]
    ]
  })
  expect(String(file)).toMatchSnapshot()
})

it('should transform code blocks into code previews', async () => {
  const file = await remark()
    .use(remarkCodePreview)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(exampleMd)

  expect(String(file)).toMatchSnapshot()
})

it('should support mdx compiler', async () => {
  const mdx = `import { Foo } from 'foo'

# Example

\`\`\`jsx preview title="Code title"
<Foo />
\`\`\`
`

  const file = await compile(mdx, {
    remarkPlugins: [[remarkCodePreview, { mdxJsx: true }]]
  })

  expect(String(file)).toMatchSnapshot()
})

it('should use a custom template when provided in options', async () => {
  const template = `
<figure class='foo'>
<figcaption>{title}</figcaption>
<div class='foo-preview'>
{preview}
</div>
<div class='foo-code'>
{code}
</div>
</figure>
`

  const file = await remark().use(remarkCodePreview, {
    template,
    templateOptions: {
      ignoreMissing: true
    }
  }).process(`\`\`\`html preview
<div class='foo'>Hello, World!</div>
\`\`\``)

  expect(String(file)).toMatchSnapshot()
})

it('should not transform code blocks that do not have `preview` attribute', async () => {
  const inputMarkdown = `
\`\`\`jsx
<Foo />
\`\`\`
    `

  const file = await remark().use(remarkCodePreview).process(inputMarkdown)

  expect(String(file)).toMatchSnapshot()
})
