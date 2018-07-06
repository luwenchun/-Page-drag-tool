<template>
  <div id="frame-west">
    <div v-for="(group,index) in groups" :key="index">
      <div class="widget-group"> {{group.name}}</div>
      <div class="widget-item" v-for="item in group.items" :key="item.type">
        <a class="draggable" :type="item.type">
          <i class="icon-widget-text"></i>
          <span>{{item.label}}</span>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import { dragUtils } from '../assets/js/winning-editor'
import components from '../assets/json/components.json'

export default {
  name: 'CompView',
  data() {
    return {
      groups: []
    }
  },
  mounted: function() {
    Object.keys(components).forEach(group => {
      const groupComps = components[group]
      const items = []
      Object.keys(groupComps).forEach(itemKey => {
        const compItem = groupComps[itemKey]
        if (!compItem.hidden) {
          items.push({ type: itemKey, label: compItem.label })
        }
      })
      this.groups.push({ name: group, items: items })
    })
    dragUtils.initDragComponent('.draggable', this.dragMoveListener)
  },
  methods: {
    dragMoveListener: function(event) {
      var target = event.target
      // keep the dragged position in the data-x/data-y attributes
      var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
      var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

      // translate the element
      target.style.webkitTransform =
        target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)'
      // update the posiion attributes
      target.setAttribute('data-x', x)
      target.setAttribute('data-y', y)
    }
  }
}

</script>
<style>
.frame-inner-list {
  padding: 8px 0;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

.widget-group {
  padding: 8px 12px;
  font-size: 14px;
  clear: both;
}

.widget-item {
  font-size: 12px;
  display: block;
  width: 45%;
  line-height: 26px;
  position: relative;
  float: left;
  left: 0;
  white-space: nowrap;
  padding: 2px;
  color: #333;
}

.widget-item a:hover {
  border: 1px dashed #77BDFF;
  color: #0DB3A6;
}

.widget-item a {
  display: block;
  cursor: move;
  background: #F4F6FC;
  border: 1px solid #F4F6FC;
  text-align: center;
}

#frame-west ul {
  position: relative;
  overflow: hidden;
  padding: 0 10px 10px 10px;
}

.clone-item {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 80px;
}
</style>
