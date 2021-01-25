export interface VisualEditorBlockData {
  componentKey: string,
  top: number,
  left: number
}

export interface VisualEditorModelValue {
  container: {
    width: number,
    height: number
  },
  blocks: VisualEditorBlockData[]
}

export interface VisualEditorComponent {
  key: string,
  label: string,
  preview: () => JSX.Element,
  render: () => JSX.Element
}

export function createVisualEditorConfig () {

  const componentList: VisualEditorComponent[] = []
  /**
   * 关于Record: https://blog.csdn.net/weixin_38080573/article/details/92838045
   *  Record是TypeScript的一个高级类型
   *  他会将一个类型的所有属性值都映射到另一个类型上并创造一个新的类型
   */
  const componentMap: Record<string, VisualEditorComponent> = {}

  return {
    componentList,
    componentMap,
    // 每次调用此函数，就注册一个组件
    registry: (key: string, component: Omit<VisualEditorComponent, 'key'>) => { // Omit删除 Exclude排除
      let comp = { key, ...component }
      componentList.push(comp)
      componentMap[key] = comp
    }
  }
}

export type VisualEditorConfig = ReturnType<typeof createVisualEditorConfig>