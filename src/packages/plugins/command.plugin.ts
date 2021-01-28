import { reactive, onUnmounted } from "vue";
import { KeyboardCode } from "./keyboard-code";

export interface CommandExecute {
  undo?: () => void,
  redo: () => void
}

export interface Command {
  name: string,                                     // 命令唯一标识
  keyboard?: string | string[],                     // 命令监听快捷键
  execute: (...args: any[]) => CommandExecute,      // 命令被执行的时候，所做的内容
  followQueue?: boolean,                            // 命令之行完之后，是否需要将命令执行得到的undo,redo存入命令队列
  init?: () => ((() => void) | undefined),          // 命令初始化函数
  data?: any,                                       // 命令缓存所需要的数据
}

export function useCommander () {
  /**
   * reactive: 返回对象的响应式副本
   * 响应式转换是“深”的——它影响所有嵌套 property。
   * 在基于 ES2015 Proxy (opens new window)的实现中，返回的代理是不等于原始对象。
   * 建议只使用响应式代理，避免依赖原始对象。    
   */
  const state = reactive({
    current: -1,                                                // 队列中当前的命令
    queue: [] as CommandExecute[],                              // 命令队列
    commandArray: [] as Command[],                              // 命令对象数组
    commands: {} as Record<string, (...args: any[]) => void>,   // 命令对象，方便通过命令的名称调用命令的execute函数，并且执行额外的命令队列的逻辑
    destroyList: [] as ((() => void) | undefined)[],            // 组件销毁的时候，需要调用的销毁逻辑数组
  })

  // 注册一个命令
  const registry = (command: Command) => {
    state.commandArray.push(command)
    state.commands[command.name] = (...args) => {
      const { undo, redo } = command.execute(...args)
      redo()
      // 如果命令执行之后，不需要进入命令队列，则直接结束
      if (command.followQueue === false) {
        return
      }
      // if (command.followQueue !== false) {
      //   state.queue.push({ undo, redo })
      //   state.current += 1
      // }
      // redo()

      // 否则，将命令队列中剩余的命令去除，保留current及其之前的命令
      let { queue, current } = state
      if (queue.length > 0) {
        queue = queue.slice(0, current + 1)
        state.queue = queue
      }

      // 设置命令队列中最后一个命令为当前执行的命令
      queue.push({ undo, redo })
      // 索引+1，指向队列中的最后一个命令
      state.current = current + 1
      // redo()
      // ;(!command.doNothingWhenExecute && redo())
    }
  }

  const keyboardEvent = (() => {

    const onKeydown = (e: KeyboardEvent) => {
      if (document.activeElement !== document.body) return
      
      const {keyCode, shiftKey, altKey, ctrlKey, metaKey} = e
      let keyString: string[] = []
      if (ctrlKey || metaKey) keyString.push('ctrl')
      if (shiftKey) keyString.push('shift')
      if (altKey) keyString.push('alt')
      keyString.push(KeyboardCode[keyCode])
      const keyNames = keyString.join(' + ')
      console.log('当前快捷键', keyNames)
      state.commandArray.forEach(({ keyboard, name }) => {
        if (!keyboard) return
        const keys = Array.isArray(keyboard) ? keyboard : [keyboard]
        if (keys.indexOf(keyNames) > -1) {
          state.commands[name]()
          e.stopPropagation()
          e.preventDefault()
        }
      })
    }

    const init = () => {
      window.addEventListener('keydown', onKeydown)
      return () => window.removeEventListener('keydown', onKeydown)
    }
    return init
  })()

  // useCommander初始化函数，负责初始化键盘监听事件，调用命令的初始化逻辑
  const init = () => {
    const onKeydown = (e: KeyboardEvent) => {
        // console.log('监听到键盘事件', e)
    }
    window.addEventListener('keydown', onKeydown)
    state.commandArray.forEach(command => !!command.init && state.destroyList.push(command.init()))
    state.destroyList.push(keyboardEvent())
    state.destroyList.push(() => window.removeEventListener('keydown', onKeydown))
  }

  registry({
    name: 'undo',
    keyboard: 'ctrl + z',
    followQueue: false,
    execute: () => {
      // 命令被执行的时候，要做的事情
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
      'ctrl + y',
      'ctrl + shift + z'
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

  onUnmounted(() => state.destroyList.forEach(fn => !!fn && fn()))

  return {
    state,
    registry,
    init
  }
}

