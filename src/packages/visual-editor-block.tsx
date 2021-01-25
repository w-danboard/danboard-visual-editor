import { computed, defineComponent, PropType } from "vue";
import { VisualEditorBlockData } from '@/packages/visual-editor.utils'

export const VisualEditorBlock = defineComponent({
  props: {
    block: {
      type: Object as PropType<VisualEditorBlockData>,
      requried: true
    }
  },
  setup (props) {
    
    const style = computed(() => ({
      top: `${props.block!.top}px`,
      left: `${props.block!.left}px`
    }))

    return () => (
      <div class="visual-editor-block" style={style.value}>
        这是一条block
      </div>
    )
  }
})