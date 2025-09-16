import type { Options as PupaOptions } from 'pupa'

/**
 * Options for configuring the remarkCodePreview plugin.
 */
export interface Options {
  /**
   * Data to interpolate into template.
   */
  data?: { [key: string]: unknown }

  /**
   * Whether to support [MDX compiler](https://mdxjs.com/).
   */
  mdxJsx?: boolean
  /**
   * The code preview template to use.
   */
  template?: string
  /**
   * Transform template data.
   */
  transformTemplateData?: (
    data: Record<string, unknown>
  ) => Record<string, unknown>
  /**
   * Options for [pupa](https://github.com/sindresorhus/pupa).
   */
  templateOptions?: PupaOptions
  /** 在每个文件内容的前面添加统一字符 */
  contentPrefix?: string
  /** 类似 `<code src="./example.tsx" />` 的模板 */
  codeImportTemplate?: string
  /** Transform code import template data. */
  transformCodeImportTemplateData?: (
    data: Record<string, unknown>
  ) => Record<string, unknown>
  codeImportTemplateOptions?: PupaOptions
}
