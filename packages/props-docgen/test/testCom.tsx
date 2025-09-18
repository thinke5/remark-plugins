import { TestComProps } from './testComType'

/**
 *  测试组件
 * @version 1.0
 * @description 测试组件-测试组件
 */
export function TestCom(props: TestComProps) {
  return <div data-name={props.name}>This is TestCom</div>
}
