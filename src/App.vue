<template>
  <div id="app">
    <editor-home></editor-home>
  </div>
</template>
<script>
import EditorHome from './views/EditorHome'
export default {
  name: 'app',
  components: {
    'editor-home': EditorHome
  }
}

</script>
<style>
#app {
  width: 100%;
  height: 100%;
}

</style>
