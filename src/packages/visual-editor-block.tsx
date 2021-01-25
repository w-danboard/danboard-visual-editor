import { computed, defineComponent, PropType } from "vue";
import { VisualEditorBlockData, VisualEditorConfig } from '@/packages/visual-editor.utils'

export const VisualEditorBlock = defineComponent({
  props: {
    block: {
      type: Object as PropType<VisualEditorBlockData>,
      requried: true
    },
    config: {
      type: Object as PropType<VisualEditorConfig>,
      requried: true
    }
  },
  setup (props) {
    
    const style = computed(() => ({
      top: `${props.block!.top}px`,
      left: `${props.block!.left}px`
    }))

    return () => {

      const component = props.config!.componentMap[props.block!.componentKey]
      const Render = component!.render()

      return (
        <div class="visual-editor-block" style={style.value}>
          {Render}
        </div>
      )
    }
  }
})