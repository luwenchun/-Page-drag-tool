<template>
  <div id="mainContainer" class="canvas-container">
    <div class="form-edit-title">
      <wn-row>
        <wn-col :span="4">
          <wn-input placeholder="屏宽(px)" size="small" v-model="actualWidth"></wn-input>
        </wn-col>
        <wn-col :span="6" :push="17">
          <wn-button size="small" type="success" id="preview">预览</wn-button>
        </wn-col>
      </wn-row>
    </div>
    <div id="editorContainer">
      <div id="itemContainer" :style="'zoom:'+zoomPercent">
        <editor-dyn-container :vNode="vNode" v-if="show"></editor-dyn-container>
      </div>
      <div id="bgGrid" :hidden="hiddenCanvas">
        <wn-row>
        </wn-row>
        <wn-row v-for="(rowItem,index) in vNode.children" :key="index" :rowNum="index">
          <wn-col :span="6" class="drop-zone" v-for="(colItem,index) in rowItem.children" :key="index">
          </wn-col>
          <wn-col :span="6" class="drop-zone" :colNum="rowItem.children.length" v-if="rowItem.children.length<4">
          </wn-col>
        </wn-row>
        <wn-row :rowNum="rowNum">
          <wn-col :span="6" class="drop-zone" colNum="0">
          </wn-col>
        </wn-row>
      </div>
      <!--<canvas id="canvas" :hidden="hiddenCanvas"></canvas>-->
      <div class="empty" v-if="vNode.children.length===0">
        <div class="img"></div>
        <span>拖入左侧控件绘制表单</span>
      </div>
      <!-- <div class="modal-dialog-wrapper" id="dialog" v-show="modalview" title="点击鼠标取消预览！">
                                                      <div class="modal-dialog" id="modal-dialog">
                                                      </div>
                                                    </div> -->
    </div>
  </div>
</template>
<script>
import { EditorUtils, Editor } from '../assets/js/winning-editor'

var editor = new Editor('form')

export default {
  name: 'ContainerView',
  data() {
    return {
      vNode: editor.getData(),
      hiddenCanvas: true,
      actualWidth: 1280,
      show: true
    }
  },
  mounted: function() {
    EditorUtils.initContainer('mainContainer', 'canvas') // draw dynamic container
    var dragZoneIneract = EditorUtils.initDragZone('.drop-zone', '.draggable')
    dragZoneIneract.on('dragenter', this.dragZoneEnter) // drag item into dragable zone listener
    dragZoneIneract.on('drop', this.dragZoneDrop) // drop item listener
    dragZoneIneract.on('dragleave', this.dragZoneLeave) // drag item outside dragable zone listener
    EditorUtils.onDragStart(this.dragStart)
    EditorUtils.onDragEnd(this.dragEnd)
    EditorUtils.onItemClick(this.itemClick) // component item click listener
    EditorUtils.onOptionsUpdate(this.updateOptions) // component attributes changed listener
    EditorUtils.onOptionsRollback(this.rollBackOptions) // rollback component dynamic content
  },
  methods: {
    dragStart: function(event) {
      this.hiddenCanvas = false
    },
    dragEnd: function(event) {
      this.hiddenCanvas = true
    },
    dragZoneEnter: function(event) {
      var dropZone = event.target
      dropZone.classList.add('drop-enter')
    },
    dragZoneDrop: function(event) {
      var dropZone = event.target
      dropZone.classList.remove('drop-enter')
      var rowNum = dropZone.parentNode.getAttribute('rowNum')
      var colNum = dropZone.getAttribute('colNum')
      var dragItemType = event.relatedTarget.getAttribute('type')
      editor.add(dragItemType, rowNum, colNum)
    },
    dragZoneLeave: function(event) {
      var dropZone = event.target
      dropZone.classList.remove('drop-enter')
    },
    /*
    Use v-if to destory vue
    */
    refresh: function() {
      this.show = false
      this.$nextTick(function() {
        this.show = true
      })
    },
    /*
    Trigger attribute view change if click component item
    */
    itemClick: function(nodeKey) {
      var widgets = editor.getWidgetByKey(nodeKey)
      this.$parent.$refs.attrView.init(nodeKey, widgets)
    },
    /*
    Trigger component attribute changing
    Rebuild dynamic page(refresh) for saving attibutes options due to bind data changing problem
    */
    updateOptions: function(options, isSave) {
      editor.updateVnodeOpts(options, isSave)
      if (isSave) {
        this.refresh()
      }
    },
    /**
     Rollback changed component attributes if attribute is not saved
     */
    rollBackOptions: function(nodeKey) {
      editor.rollbackVnodeOpts(nodeKey)
    }
  },
  computed: {
    zoomPercent() {
      return EditorUtils['cWidth'] / (this.actualWidth - 180)
    },
    rowNum() {
      return this.vNode.children.length
    }
  }
}

</script>
<style scoped>
.empty {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  text-align: center;
  width: 323px;
  height: 240px;
  font-size: 20px;
  color: #c5c5c5;
}


.img {
  background-image: url(../assets/images/form_empty.png);
  width: 323px;
  height: 215px;
}

.form-edit-title {
  height: 45px;
  line-height: 39px;
  font-size: 18px;
  padding: 0 0px 0 6px;
  border-bottom: solid 1px #e0e0e0;
}

.canvas-container {
  display: inline-block;
  position: absolute;
  left: 251px;
  top: 50px;
  bottom: 0;
  right: 400px;
}

#bgGrid {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px
}

#itemContainer {
  position: absolute;
  padding: 20px;
  width: 100%
}

















































/*#editorContainer {
  height: 100%;
  width: 100%;
  position: relative
}*/

.drop-zone {
  height: 39px;
  border: dashed 1px blue
}

.drop-enter {
  height: 39px;
  border: solid 1px red
}


























































/*预览模态框*/

.modal-dialog-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999999;
}

.modal-dialog-wrapper:before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
}

.modal-dialog {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  box-shadow: 1px 2px 8px rgba(255, 255, 255, .5);
  background: #fff;
  overflow: auto;
}
</style>
