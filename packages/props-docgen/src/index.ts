// import parseAttrs from 'attributes-parser'
import type { Root } from 'mdast'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { mdxFromMarkdown, MdxJsxFlowElement } from 'mdast-util-mdx'
import { mdxjs } from 'micromark-extension-mdxjs'
import path from 'node:path'
import docgen from 'react-docgen-typescript'
import { EXIT, SKIP, visit } from 'unist-util-visit'
import type { VFile } from 'vfile'
import type { Options } from './types.js'
import { gfmTable } from 'micromark-extension-gfm-table'
import { gfmTableFromMarkdown } from 'mdast-util-gfm-table'

export type * from './types.js'

/**
 * A [remark](https://github.com/remarkjs/remark) plugin for transforming code blocks into code previews.
 *
 * @param options - The configuration options for the plugin.
 * @returns A function that transforms the MDAST tree.
 */
export default function remarkCodePreview(
  this: unknown,
  options: Options = {}
) {
  const {
    transformToMarkdown = defaultTransformToMarkdown,
    docgenParserOptions
  } = options

  return (mdast: Root, vfile: VFile) => {
    if (!vfile.dirname) {
      console.error('vfile.dirname is undefined')
      return
    }
    // handele <code src="./example.tsx" />
    visit(
      mdast,
      'mdxJsxFlowElement',
      (node: MdxJsxFlowElement, index = 0, parent) => {
        if (node.name !== 'docgen') return

        const attributes = Array.from(node.attributes)
        const srcIndex = attributes.findIndex(
          attr => attr.type === 'mdxJsxAttribute' && attr.name === 'src'
        )
        // if no src attribute, return
        if (srcIndex === -1) return
        // get file path
        const src = attributes[srcIndex].value as string
        const filePath = path.join(vfile.dirname!, src)

        // parse code
        const [docgenResult] = docgen.parse(filePath, {
          shouldIncludePropTagMap: true,
          shouldExtractLiteralValuesFromEnum: true,
          ...docgenParserOptions,
          propFilter: {
            ...docgenParserOptions?.propFilter,
            skipPropsWithoutDoc: true
          }
        })

        // transform to markdown
        const markdownCode = transformToMarkdown(docgenResult)

        // console.log(markdownCode)
        // ----------------
        const previewTree = fromMarkdown(markdownCode, {
          extensions: [mdxjs(), gfmTable()],
          mdastExtensions: [mdxFromMarkdown(), gfmTableFromMarkdown()]
        })
        // Replace the node tree with the preview tree
        parent?.children.splice(index, 1, ...previewTree.children)

        const len = parent?.children?.length
        return len && len - 1 === 0 ? [EXIT, index] : [SKIP, index + 2]
      }
    )
  }
}

function defaultTransformToMarkdown(data: docgen.ComponentDoc): string {
  const codes = [
    ['propName', '说明', '类型', '默认值'],
    ['---', '---', '---', '---'],
    ...Object.entries(data.props).map(([key, value]) => {
      return [
        key,
        getPropsDescriptionString(value.description),
        `\`${getPropsTypeString(value.type)}\``,
        getPropsDefaultValueString(value.defaultValue)
      ]
    })
  ]
    .map(line => `| ${line.join(' | ')} |`)
    .join('\n')

  return `## API

${codes}\n\n`
}

function getPropsDefaultValueString(defaultValue: string | { value: string }) {
  if (defaultValue && typeof defaultValue === 'object' && defaultValue?.value) {
    return `\`${defaultValue.value}\``
  }
  return '-'
}

function getPropsDescriptionString(description: string) {
  return description.replaceAll('\n', '<br/>')
}

function getPropsTypeString(type: docgen.PropItemType) {
  // 需要配合 `shouldExtractLiteralValuesFromEnum: true`
  if (type.name === 'enum') {
    return type.value.map((item: { value: string }) => item.value).join(' \\| ')
  }
  return type.name
}
