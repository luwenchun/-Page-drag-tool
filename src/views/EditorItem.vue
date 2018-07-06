<template>
  <wn-col :span="span" @click.native="click">
    <slot>
    </slot>
  </wn-col>
</template>
<script>
import { EditorUtils } from '../assets/js/winning-editor'

export default {
  name: 'EditorItem',
  props: {
    span: {
      type: Number,
      required: true
    },
    nodeKey: {
      type: Number
    }
  },
  data() {
    return {}
  },
  mounted: function() {

  },
  methods: {
    click: function() {
      EditorUtils.emitItemClick(this.nodeKey)
    }
  }
}

</script>
<style scoped>
.editor-item {
  border: dashed 1px blue
}
</style>
