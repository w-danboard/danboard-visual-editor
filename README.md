# danboard-visual-editor

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


 - 搭建页面，左侧组件列表、中间容器画布、右侧编辑组件
 - 从菜单拖拽组件到容器
 - Block的选中状态
 - 容器内的组件拖拽
 - 命令队列及对应的快捷键
 - 单选、多选
 - 操作栏按钮：
  - 撤销、重做
  - 导入、导出
  - 置顶、置底
  - 删除、清空
  - 拖拽吸附功能
 - 组件设置预定义好的属性
 - 右键操作菜单
 - 拖拽调整宽高
 - 组件绑定值
  - 根据组件标识，通过作用域插槽自定义某个组件的行为
  - 输入框：双向绑定值、调整宽度
  - 按钮：类型、文字、大小尺寸、拖拽调整宽高
  - 图片：自定义图片地址，拖拽调整图片宽高
  - 下拉框：预定义选项值，双向绑定字段
