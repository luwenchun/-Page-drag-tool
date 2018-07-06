import interact from 'interactjs'
import Vue from 'vue'
import { stardComp } from './component'
import vdata from './vdata'
import compAttrs from '../json/baseCompAttrs.json'

const editorContainerWidth = window.innerWidth - 550
const gridSize = 30
const gridColNum = 24
const eventBus = new Vue()
const dragStartEvent = 'drag-start'
const dragEndEvent = 'drag-end'
const editorItemClickEvent = 'item-click'
const optionsUpdateEvent = 'item-option-update'
const optionsRollbackEvent = 'item-option-rollback'

const dragUtils = {

  initDragComponent: function (selector, dragMoveListener) {
    interact(selector).draggable({
      // snap: {
      //   targets: [
      //     interact.createSnapGrid({ x: gridSize, y: gridSize })
      //   ],
      //   range: Infinity,
      //   relativePoints: [{ x: 0, y: 0 }]
      // },
      inertia: true,
      autoScroll: true,
      manualStart: true,
      onstart: function (event) {
        eventBus.$emit(dragStartEvent, event)
      },
      onmove: dragMoveListener,
      onend: function (event) {
        var target = event.target
        target.parentNode.removeChild(target)
        eventBus.$emit(dragEndEvent, event)
      }

    }).on('move', function (event) {
      var interaction = event.interaction
      if (interaction.pointerIsDown && !interaction.interacting()) {
        var clone = event.currentTarget.cloneNode(true)
        clone.classList.add('clone-item')
        event.currentTarget.parentNode.appendChild(clone)
        interaction.start({ name: 'drag' },
          event.interactable,
          clone)
      }
    })
  },
  createDragContainer: function (selector, acceptSelector) {
    return interact(selector).dropzone({
      // only accept elements matching this CSS selector
      accept: acceptSelector,
      // Require a 75% element overlap for a drop to be possible
      overlap: 0.75,

      // listen for drop related events:

      ondropactivate: function (event) {
      },
      ondropdeactivate: function (event) { }
    })
  }
}

const EditorUtils = {

  cWidth: editorContainerWidth,

  initContainer: function (mainContainerId, canvasId) {
    document.getElementById(mainContainerId).style.width = editorContainerWidth + 'px'
    var skip = true
    if (!skip) {
      drawContainer(canvasId)
    }
  },

  initDragZone: function (containerSelector, acceptSelector) {
    return dragUtils.createDragContainer(containerSelector, acceptSelector)
  },

  onDragStart: function (callback) {
    eventBus.$on(dragStartEvent, event => {
      callback(event)
    })
  },
  onDragEnd: function (callback) {
    eventBus.$on(dragEndEvent, event => {
      callback(event)
    })
  },
  emitItemClick: function (vNode) {
    eventBus.$emit(editorItemClickEvent, vNode)
  },
  onItemClick: function (callback) {
    eventBus.$on(editorItemClickEvent, item => {
      callback(item)
    })
  },
  onOptionsUpdate: function (callback) {
    eventBus.$on(optionsUpdateEvent, (options, isSave) => {
      callback(options, isSave)
    })
  },
  emitOptionsUpdate: function (options, isSave) {
    eventBus.$emit(optionsUpdateEvent, options, isSave)
  },
  onOptionsRollback: function (callback) {
    eventBus.$on(optionsRollbackEvent, (nodeKey) => {
      callback(nodeKey)
    })
  },
  emitOptionsRollback: function (nodeKey) {
    eventBus.$emit(optionsRollbackEvent, nodeKey)
  }
}

/**
 * Core object
 * @param {*} compName root node for dynamic view
 */
function Editor(compName) {
  this.root = stardComp.createRoot(compName)
  this.optBackUp = {}
}

Editor.prototype.getData = function () {
  return this.root
}
/**
 * Find vNode by key
 */
Editor.prototype.findByKey = function (key, vNode) {
  if (key == null) {
    return undefined
  }
  var _self = this
  if (vNode == null) {
    vNode = this.root
  }
  if (vNode.key === key) {
    return vNode
  }
  var child
  var target
  for (var i = 0, len = vNode.children.length; i < len; i++) {
    child = vNode.children[i]
    target = _self.findByKey(key, child)
    if (target != null) {
      return target
    }
  }

  return undefined
}
/**
Update component attributes
 */
Editor.prototype.updateVnodeOpts = function (options, isSave) {
  if (options == null || options.length === 0) {
    return
  }
  var vNode = this.findByKey(options.root)
  if (vNode == null) {
    return
  }

  this.updateOpt(vNode, options[vNode.key], isSave)
  vNode.children.forEach(child => {
    this.updateOpt(child, options[child.key], isSave)
  })
  // clean backup if do saving
  if (isSave) {
    this.optBackUp = {}
  }
}

Editor.prototype.updateOpt = function (vNode, opt, isSave) {
  const nodeKey = vNode.key
  if (opt != null) {
    // backup before update
    if (this.optBackUp[nodeKey] == null && !isSave) {
      this.optBackUp[nodeKey] = vNode.options
    }
    vNode.options = opt
  }
}

/**
 * Rollback opts by nodeKey
 */
Editor.prototype.rollbackVnodeOpts = function (nodeKey) {
  var vNode = this.findByKey(nodeKey)
  if (vNode == null) {
    return
  }
  this.rollbackOpt(vNode)
  vNode.children.forEach(child => {
    this.rollbackOpt(child)
  })
  this.optBackUp = {}
}

Editor.prototype.rollbackOpt = function (vNode) {
  const optBackUp = this.optBackUp[vNode.key]
  if (optBackUp == null) {
    return
  }
  vNode.options = optBackUp
}

/**
 * Generate widgets with value for component attributes by key
 */
Editor.prototype.getWidgetByKey = function (nodeKey) {
  var widgets = []
  var vNode = this.findByKey(nodeKey)
  if (vNode == null) {
    return widgets
  }
  var widget = compAttrs[vNode.type]
  if (widget != null) {
    widgets.push({ key: vNode.key, widgets: widget, opts: vNode.options })
  }
  vNode.children.forEach(child => {
    widget = compAttrs[child.type]
    if (widget != null) {
      widgets.push({ key: child.key, widgets: widget, opts: child.options })
    }
  })
  return widgets
}

Editor.prototype.add = function (type, rowNum, colNum) {
  var row = Number(rowNum)
  var col = Number(colNum)
  var root = this.root
  if (root.children.length < row + 1) {
    root.children.push(this.createRow())
  }
  var rowObj = root.children[row]
  if (rowObj.children.length < col + 1) {
    rowObj.children.push(this.createEditorItem(type, 6))
  }
}

Editor.prototype.createFormItem = function (item) {
  var formItem = stardComp.create('form-item', this.root)
  formItem.children = [item]
  return formItem
}

Editor.prototype.createItem = function (type) {
  var item = stardComp.create(type, this.root)
  return this.createFormItem(item)
}

Editor.prototype.createRow = function () {
  return vdata.createVnode({ tag: 'wn-row' })
}

Editor.prototype.createEditorItem = function (type, span) {
  var attr = vdata.createAttr()
  var item = this.createItem(type)
  attr.set('props', { nodeKey: item.key, span: span })
  return vdata.createVnode({ tag: 'ui-editor-item', attr: attr }, item)
}

function drawContainer(canvasId) {
  var canvas = document.getElementById(canvasId)
  canvas.setAttribute('width', canvas.parentNode.clientWidth)
  canvas.setAttribute('height', canvas.parentNode.clientHeight)
  var ctx = canvas.getContext('2d')
  var rowNum = Math.ceil(canvas.parentNode.clientHeight / gridSize)
  for (var row = 0; row < rowNum; row++) {
    for (var col = 0; col < gridColNum; col++) {
      ctx.strokeRect(col * gridSize, row * gridSize, gridSize, gridSize)
    }
  }
}

export { dragUtils, EditorUtils, Editor }
