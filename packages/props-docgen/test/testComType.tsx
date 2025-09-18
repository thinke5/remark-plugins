import type { Options as PupaOptions } from 'pupa'

/**
 * Column properties.
 */
type IColumnProps = {
  /** prop1 description */
  prop1?: string
  /** prop2 description
   * @default 0
   */
  prop2: number
  /**
   * prop3 description
   */
  prop3: () => void
  /** prop4 description */
  prop4: 'option1' | 'option2' | 'option3'
}

/**
 * TestCom properties.
 *
 */
export interface TestComProps extends IColumnProps {
  /** 名称
   * @default 'test'
   */
  name?: string
  /**
   * 年龄 一个`jsx-cc`
   *
   * @default 0
   * @max 100
   * @min 0
   * @link https://www.baidu.com
   */
  age?: number
  /** 配置 */
  otions?: PupaOptions
  /** cc配置 */
  cc?: ICCname

  /** @skip */
  ddd?: string
}

type ICCname = {
  /** 地址 */
  address?: string
  /** 姓名 */
  name?: string
}
