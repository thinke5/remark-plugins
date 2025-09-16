/// <reference types="vitest/globals" />

import { compile } from '@mdx-js/mdx'
import remarkCodePreview from '../src/index.js'

it('支持<code src="./example.tsx" />的导入', async () => {
  const file = await compile(
    `# 测试的 doc\n\n<code src="./example.tsx" title="标题" open n={null} num={12} text={'xcc' + 123} >example</code>\n\n<div>\n\n<code src="./example2.tsx" />\n\n<code />\n\n</div>\n\n结束`,
    {
      remarkPlugins: [
        [
          remarkCodePreview,
          {
            mdxJsx: true
          }
        ]
      ]
    }
  )

  expect(String(file)).toMatchSnapshot()
})
