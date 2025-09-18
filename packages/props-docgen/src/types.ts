import docgen from 'react-docgen-typescript'

/**
 * Options for configuring the remarkCodePreview plugin.
 */
export interface Options {
  transformToMarkdown?: (data: docgen.ComponentDoc) => string
  /** options for `react-docgen-typescript`
   * @doc https://github.com/styleguidist/react-docgen-typescript
   */
  docgenParserOptions?: docgen.ParserOptions
}
