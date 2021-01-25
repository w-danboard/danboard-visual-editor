// 使用 defineCompoennt可以有更好的类型提示，当然不用是可以的
import { computed, defineComponent, PropType, ref } from 'vue'
import './visual-editor.scss'
import { VisualEditorModelValue, VisualEditorConfig, VisualEditorComponent } from '@/packages/visual-editor.utils'
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
    const menuDraggier = {
      current: {
        component: null as null | VisualEditorComponent
      },
      dragstart: (e: DragEvent, component: VisualEditorComponent) => {
        // e.dataTransfer!.dropEffect = 'move'
        containerRef.value.addEventListener('dragenter', menuDraggier.dragenter)
        containerRef.value.addEventListener('dragover', menuDraggier.dragover)
        containerRef.value.addEventListener('dragleave', menuDraggier.dragleave)
        containerRef.value.addEventListener('drop', menuDraggier.drop)
        menuDraggier.current.component = component
      },
      // 进入container
      dragenter: (e: DragEvent) => {
        e.dataTransfer!.dropEffect = 'move'
      },
      dragover: (e: DragEvent) => {
        e.preventDefault()
      },
      // 离开container
      dragleave: (e: DragEvent) => {
        e.dataTransfer!.dropEffect = 'none'
      },
      dragend: (e: DragEvent) => {
        containerRef.value.removeEventListener('dragenter', menuDraggier.dragenter)
        containerRef.value.removeEventListener('dragover', menuDraggier.dragover)
        containerRef.value.removeEventListener('dragleave', menuDraggier.dragleave)
        containerRef.value.removeEventListener('drop', menuDraggier.drop)
        menuDraggier.current.component = null
      },
      drop: (e: DragEvent) => {
        console.log('drop', menuDraggier.current.component)
        const blocks = dataModel.value.blocks || []
        blocks.push({
          top: e.offsetY,
          left: e.offsetX
        })
        dataModel.value = {
          ...dataModel.value,
          blocks
        }
      }
    }

    return () => (
      <div class="visual-editor">
        <div class="visual-editor-menu">
          {props.config.componentList.map(component => (
            <div class="visual-editor-menu-item"
              draggable
              onDragstart={e => {menuDraggier.dragstart(e, component)}}
              onDragend={e => {menuDraggier.dragend}}>
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
                  <VisualEditorBlock block={block} key={index}/>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
})