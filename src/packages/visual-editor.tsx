// 使用 defineCompoennt可以有更好的类型提示，当然不用是可以的
import { computed, defineComponent, PropType, ref } from 'vue'
import './visual-editor.scss'
import { VisualEditorModelValue, VisualEditorConfig, VisualEditorComponent, createNewBlock } from '@/packages/visual-editor.utils'
import { useModel } from '@/packages/utils/useModel'
import { VisualEditorBlock } from './visual-editor-block'

export const VisualEditor = defineComponent({
  components: {
    VisualEditorBlock
  },
  props: {
    modelValue: {
      type: Object as PropType<VisualEditorModelValue>,
      required: true
    },
    config: {
      type: Object as PropType<VisualEditorConfig>,
      required: true
    }
  },
  emits: {
    'update:modelValue': (val?: VisualEditorModelValue) => true
  },
  setup (props, ctx) {

    const dataModel = useModel(() => props.modelValue, val => ctx.emit('update:modelValue', val))
    const containerRef = ref({} as HTMLDivElement)


    // 编辑区域 外层宽高
    const containerStyles = computed(() => ({
      width: `${dataModel.value.container.width}px`,
      height: `${dataModel.value.container.height}px`
    }))

    // 拖拽
    const menuDragger = (() => {

      let component = null as null | VisualEditorComponent

      const blockHandler = {
        /**
         * 处理拖拽菜单组件开始动作
         * @param e 
         * @param current 
         */
        dragstart: (e: DragEvent, current: VisualEditorComponent) => {
          containerRef.value.addEventListener('dragenter', containerHandler.dragenter)
          containerRef.value.addEventListener('dragover', containerHandler.dragover)
          containerRef.value.addEventListener('dragleave', containerHandler.dragleave)
          containerRef.value.addEventListener('drop', containerHandler.drop)
          component = current
        },
        /**
         * 处理拖拽菜单组件结束动作
         * @param e 
         */
        dragend: (e: DragEvent) => {
          containerRef.value.removeEventListener('dragenter', containerHandler.dragenter)
          containerRef.value.removeEventListener('dragover', containerHandler.dragover)
          containerRef.value.removeEventListener('dragleave', containerHandler.dragleave)
          containerRef.value.removeEventListener('drop', containerHandler.drop)
          component = null
        }
      }

      const containerHandler = {
        // 拖拽单组件，进入容器的时候，设置鼠标为可放置状态
        dragenter: (e: DragEvent) => e.dataTransfer!.dropEffect = 'move',
        // 拖拽单组件，鼠标在容器中移动的时候，禁用默认事件
        dragover: (e: DragEvent) => e.preventDefault(),
        // 如果拖拽过程中，鼠标离开了容器，设置鼠标为不可放置的状态
        dragleave: (e: DragEvent) => e.dataTransfer!.dropEffect = 'none',
        // 拖拽容器中放置的时候，拖拽事件对象的offsetX和offsetY添加一条组件数据
        drop: (e: DragEvent) => {
          console.log('drop', component)
          const blocks = dataModel.value.blocks || []
          // blocks.push({
          //   top: e.offsetY,
          //   left: e.offsetX,
          //   componentKey: component!.key,
          //   adjustPosition: true
          // })
          blocks.push(createNewBlock({
            component: component!,
            top: e.offsetY,
            left: e.offsetX
          }))
          dataModel.value = {
            ...dataModel.value,
            blocks
          }
        }
      }

      return blockHandler
    })()

    // const blockDragger = (() => {

    // })()

    return () => (
      <div class="visual-editor">
        <div class="visual-editor-menu">
          {props.config.componentList.map(component => (
            <div class="visual-editor-menu-item"
              draggable
              onDragstart={e => {menuDragger.dragstart(e, component)}}
              onDragend={e => {menuDragger.dragend}}>
              <span class="visual-editor-menu-item-label">{component.label}</span>
              {component.preview()}
            </div>
          ))}
        </div>
        <div class="visual-editor-head">
          visual-editor-head
        </div>
        <div class="visual-editor-operator">
          visual-editor-operator
        </div>
        <div class="visual-editor-body">
          <div class="visual-editor-content">
            <div class="visual-eidtor-container" style={containerStyles.value} ref={containerRef}>
              { dataModel.value && dataModel.value.blocks && dataModel.value.blocks.length && (
                dataModel.value.blocks.map((block, index) => (
                  <VisualEditorBlock config={props.config} block={block} key={index}/>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
})