import { useCommander } from '@/packages/plugins/command.plugin'
import { VisualEditorBlockData, VisualEditorModelValue } from '@/packages/visual-editor.utils'

export function useVisualCommand (
  {
    focusData,
    updateBlocks,
    dataModel
  }: {
    focusData: {
      value: {
        focus: VisualEditorBlockData[],
        unFocus: VisualEditorBlockData[]
      }
    },
    updateBlocks: (blocks: VisualEditorBlockData[]) => void,
    dataModel: {
      value: VisualEditorModelValue
    }
  }
) {
  const commander = useCommander()

  commander.registry({
    name: 'delete',
    keyboard: [
      'backspace',
      'delete',
      'ctrl+d'
    ],
    execute: () => {
      let data = {
        before: dataModel.value.blocks || [],
        after: focusData.value.unFocus
      }
      console.log('执行删除命令')
      return {
        undo: () => {
          console.log('撤回删除命令')
          updateBlocks(data.after)
        },
        redo: () => {
          console.log('重置删除命令')
          updateBlocks(data.before)
        }
      }
    }
  })

  console.log('我是commander', commander)

  return {
    undo: () => commander.state.commands.undo(),
    redo: () => commander.state.commands.redo(),
    delete: () => commander.state.commands.delete()
  }
}