/**
 * The default code preview template.
 */
export const DEFAULT_TEMPLATE = `
<figure className='preview'>
  <figcaption>{title}</figcaption>
  <div className='preview-showcase'>
    {preview}
  </div>
  <div className='preview-code'>
    {code}
  </div>
</figure>
`

export const ATTR_PATTERN =
  /\s*preview(?:=(?:"[^"]*"|'[^']*'|[^"'\s]*))?$|preview(?:=(?:"[^"]*"|'[^']*'|[^"'\s]*))?\s*/g

/**
 * The default <code/> preview template.
 */
export const DEFAULT_CODE_TEMPLATE = `import * as code_module_{index} from '{src}';
import code_content_{index} from '{src}?raw';

<code-preview  preview={code_module_{index}} {otherProps}>{code_content_{index}}</code-preview>
`
