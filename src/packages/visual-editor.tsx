// 使用 defineCompoennt可以有更好的类型提示，当然不用是可以的
import { computed, defineComponent, PropType } from 'vue'
import './visual-editor.scss'
import { VisualEditorModelValue, VisualEditorConfig } from '@/packages/visual-editor.utils'
import { useModel } from '@/packages/utils/useModel'
import { VisualEditorBlock } from './visual-editor-block'
import component from '*.vue'

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


    // 编辑区域 外层宽高
    const containerStyles = computed(() => ({
      width: `${dataModel.value.container.width}px`,
      height: `${dataModel.value.container.height}px`
    }))

    return () => (
      <div class="visual-editor">
        <div class="visual-editor-menu">
          {props.config.componentList.map(component => <div class="visual-editor-menu-item">
            <span class="visual-editor-menu-item-label">{component.label}</span>
            {component.preview()}
          </div>)}
        </div>
        <div class="visual-editor-head">
          visual-editor-head
        </div>
        <div class="visual-editor-operator">
          visual-editor-operator
        </div>
        <div class="visual-editor-body">
          <div class="visual-editor-content">
            <div class="visual-eidtor-container" style={containerStyles.value}>
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