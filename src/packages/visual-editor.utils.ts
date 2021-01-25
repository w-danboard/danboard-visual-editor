export interface VisualEditorBlockData {
  componentKey: string,       // 映射VisualEditorConfig中componentMap的component对象
  top: number,                // 组件的top定位
  left: number,               // 组件的left定位
  adjustPosition?: boolean,   // 是否需要调整位置
  focus: boolean              // 当前是否为选中状态
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

export function createNewBlock ({
  component,
  top,
  left
}: {
  component: VisualEditorComponent,
  top: number,
  left: number
}): VisualEditorBlockData {
  return {
    top,
    left,
    componentKey: component!.key,
    adjustPosition: true,
    focus: false
  }
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