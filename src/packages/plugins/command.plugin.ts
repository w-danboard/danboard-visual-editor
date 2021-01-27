import { reactive } from "vue";

export interface CommandExecute {
  undo?: () => void,
  redo: () => void
}

export interface Command {
  name: string,                                     // 命令唯一标识
  keyboard?: string | string[],                     // 命令监听快捷键
  execute: (...args: any[]) => CommandExecute,      // 命令被执行的时候，所做的内容
  followQueue?: boolean                             // 命令之行完之后，是否需要将命令执行得到的undo,redo存入命令队列
}

export function useCommander () {
  /**
   * reactive: 返回对象的响应式副本
   * 响应式转换是“深”的——它影响所有嵌套 property。
   * 在基于 ES2015 Proxy (opens new window)的实现中，返回的代理是不等于原始对象。
   * 建议只使用响应式代理，避免依赖原始对象。    
   */
  const state = reactive({
    current: -1,
    queue: [] as CommandExecute[],
    commands: {} as Record<string, (...args: any[]) => void>
  })

  const registry = (command: Command) => {
    state.commands[command.name] = (...args) => {
      const { undo, redo } = command.execute(...args)
      redo()
      if (command.followQueue === false) {
        return
      }
      // if (command.followQueue !== false) {
      //   state.queue.push({ undo, redo })
      //   state.current += 1
      // }
      // redo()
      console.log(state)

      let { queue, current } = state
      if (queue.length > 0) {
        queue = queue.slice(0, current + 1)
        state.queue = queue
      }

      queue.push({ undo, redo })
      state.current = current + 1
      // redo()
      // ;(!command.doNothingWhenExecute && redo())
    }
  }

  registry({
    name: 'undo',
    keyboard: 'ctrl+z',
    followQueue: false,
    execute: () => {
      // 命令被执行的时候，要做的事情
      console.log('undo===>')
      return {
        redo: () => {
          console.log('重做')
          // 重新做一遍，要做的事情
          const { current } = state
          if (current === -1) return
          const queueItem = state.queue[state.current]
          !!queueItem.undo && queueItem.undo()
          state.current --
        }
      }
    }
  })

  registry({
    name: 'redo',
    keyboard: [
      'ctrl+y',
      'ctrl+shift+z'
    ],
    followQueue: false,
    execute: () => {
      return {
        redo: () => {
          console.log('执行撤销')
          const queueItem = state.queue[state.current + 1]
          if (!!queueItem) {
            queueItem.redo()
            state.current++
          }
        }
      }
    }
  })

  return {
    state,
    registry
  }
}

