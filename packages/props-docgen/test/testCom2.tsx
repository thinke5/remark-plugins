/**
 *  测试组件2
 * @version 1.2
 * @description 测试组件-测试组件2
 */
export function TestCom2(props: {
  /** 名称
   * @default 'TestCom'
   */
  name?: string
  /** 年龄
   *
   * 多行注释
   * 多
   * 行
   * @default 18
   */
  age?: number
  /** 性别 */
  gender?: 'male' | 'female'
  node?: React.ReactNode
}) {
  return <div data-name={props.name}>This is TestCom</div>
}
