<template>
  <div class="app">
    <h1>这个是页面内容</h1>
    <visual-editor v-model="jsonData"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { VisualEditor } from '@/packages/visual-editor';


export default defineComponent({
  name: 'App',
  components: {
    VisualEditor
  },
  data () {
    return {
      jsonData: {
        container: {
          height: 500,
          width: 800
        },
        blocks: [
          {
            top: 100,
            left: 100
          },
          {
            top: 200,
            left: 200
          }
        ]
      }
    }
  }
});
</script>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
}
</style>
