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
      if (command.followQueue) {
        state.queue.push({ undo, redo })
        state.current += 1
      }
      redo()
    }
  }

  registry({
    name: 'undo',
    keyboard: 'ctrl+z',
    followQueue: false,
    execute: () => {
      // 命令被执行的时候，要做的事情
      return {
        redo: () => {
          // 重新做一遍，要做的事情
          const { current } = state
          if (current === -1) return
          const { undo } = state.queue[current]
          !!undo && undo()
          state.current -= 1
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
          let { current } = state
          if (!state.queue[current]) return
          const { redo } = state.queue[current]
          redo()
          state.current += 1
        }
      }
    }
  })

  return {
    state,
    registry
  }
}

