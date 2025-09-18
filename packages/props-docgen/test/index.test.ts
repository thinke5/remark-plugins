/// <reference types="vitest/globals" />

import { compile } from '@mdx-js/mdx'
import remarkCodePreview from '../src/index.js'
import { VFile } from 'vfile'

it('should support inline', async () => {
  const mdx = `import { Foo } from 'foo'

# Example

<docgen src="./testCom2.tsx"/>

## End
`

  const f = new VFile({
    value: mdx,
    path: '/Users/xinge/Documents/code/github/thinke5/remark-plugins/packages/props-docgen/test/index.test.mdx'
  })
  const file = await compile(f, {
    remarkPlugins: [[remarkCodePreview, { mdxJsx: true }]]
  })

  expect(String(file)).toMatchSnapshot()
})

it('should support outfile', async () => {
  const mdx = `import { Foo } from 'foo'

# Example

<docgen src="./testCom.tsx"/>

## End
`

  const f = new VFile({
    value: mdx,
    path: '/Users/xinge/Documents/code/github/thinke5/remark-plugins/packages/props-docgen/test/index.test.mdx'
  })
  const file = await compile(f, {
    remarkPlugins: [[remarkCodePreview, { mdxJsx: true }]]
  })

  expect(String(file)).toMatchSnapshot()
})
