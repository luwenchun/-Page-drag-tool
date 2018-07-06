import { EditorUtils } from '../assets/js/winning-editor'
import { deepClone } from '../assets/js/utils'
import compAttrs from '../assets/json/baseCompAttrs.json'

function Option(prop, value, lazy) {
    this.prop = prop
    lazy ? this.lazy = true : this.lazy = false
    this.value = value
    this.lazyValue = value
}
Option.prototype.getValue = function () {
    return this.lazy ? this.lazyValue : this.value
}
function getOptByProp(prop, opts) {
    if (!Array.isArray(opts)) {
        return
    }

    for (var i = 0, len = opts.length; i < len; i++) {
        if (opts[i].prop === prop) {
            return opts[i]
        }
    }

    return
}

function getOptByIndex(opts, index) {
    if (!Array.isArray(opts)) {
        return
    }
    return opts[index]
}

export default {
    name: 'CompAttrView',
    /**
     * options:
     * {
     *    vnodeKey1: options Array,
     *    vnodeKey2: options Array
     * }
     */
    options: {},
    data() {
        return {
            widgets: [],
            show: true
        }
    },
    render(h) {
        if (this.widgets != null) {
            var attrs = this.drawWidgets(h)
        }
        return this.renderContainer(h, attrs)
    },
    methods: {
        renderContainer: function (h, attrs) {
            if (attrs != null && attrs.length > 0) {
                const saveOptions = () => { this.saveOptions() }
                var save = <wn-button size="small" type="success" class="save" onClick={saveOptions}>
                    保存</wn-button>
            }
            if (this.show) {
                return (<div >
                    <div class="widget-cate">属性</div>
                    <wn-form label-width="28%" label-position="left">
                        {attrs}
                    </wn-form> {save}</div>)
            }
        },
        renderInput: function (item, option, h) {
            // handle lazy value and if option don't have get value function(children options)
            // then return value
            const value = option.getValue != null ? option.getValue() : option.value
            const onInput = (newValue) => { this.updateOptions(option, newValue, item) }
            return (<wn-form-item label={item.label}>
                <wn-input size="small" value={value} onInput={onInput}></wn-input>
            </wn-form-item>)
        },
        renderList: function (item, option, h) {
            let optList = option.value
            if (!Array.isArray(optList)) {
                optList = []
            }
            var index = 0
            let list = optList.map(data => {
                // check el
                if (data.el !== item.el) {
                    throw new Error('error for list widget,el value not match:' + item.el)
                }
                // list support render other widget by el
                const widgetsRender = this.renderListItem(data.el, data.options, h)

                const deleteClick = () => { this.listDelete(optList, index++) }
                return (<div style="border: solid white">
                    <wn-button size="small" type="danger" onClick={deleteClick}>删除</wn-button>
                    {widgetsRender}</div>)
            })
            const addClick = () => { this.listAdd(optList, item) }
            return (<div><p>{item.label}
                <wn-button style="position: absolute; right: 20px" size="small" type="success" onClick={addClick}>
                    新增</wn-button>
            </p>{list}</div>)
        },
        renderListItem: function (el, itemOpt, h) {
            const listWidgets = compAttrs[el]
            const widgetsRender = listWidgets.map(item => {
                let opt = getOptByProp(item.prop, itemOpt)
                if (opt == null) {
                    opt = new Option(item.prop, item.defaultValue, item.lazy)
                    itemOpt.push(opt)
                }
                return this.widgetRender(item, opt, h)
            })
            return widgetsRender
        },
        updateOptions: function (option, newValue, item) {
            option.lazy ? option.lazyValue = newValue : option.value = newValue
            // if not lazy ,update dynamic page
            if (!option.lazy) {
                EditorUtils.emitOptionsUpdate(this.$options.options, false)
            }
        },
        widgetRender: function (item, opt, h) {
            if (item.widget === 'input') {
                return this.renderInput(item, opt, h)
            } else if (item.widget === 'list') {
                return this.renderList(item, opt, h)
            }
        },
        /*
         render widgets
         */
        drawWidgets: function (h) {
            var attrs = []
            var _self = this
            var options = this.$options.options
            this.widgets.forEach(function (compWidget) {
                const widgets = compWidget.widgets
                const nodeKey = compWidget.key
                widgets.forEach((item, index) => {
                    const option = getOptByIndex(options[nodeKey], index)
                    attrs.push(_self.widgetRender(item, option, h))
                })
            })
            return attrs
        },
        /*
        init attributes value
        */
        init: function (rootKey, widgets) {
            const orginalKey = this.$options.options.root
            // same item do nothing
            if (orginalKey === rootKey) {
                return
            }
            // trigger rollback if item changed
            if (orginalKey != null && orginalKey !== rootKey) {
                EditorUtils.emitOptionsRollback(orginalKey)
            }
            this.$options.options = { root: rootKey }
            this.widgets = widgets
            var options = this.$options.options
            if (this.widgets != null) {
                this.widgets.forEach(function (compWidget) {
                    const nodeKey = compWidget.key // vnode id
                    const widgets = compWidget.widgets // vnode related widgets for dynamic content
                    let vNodeOpts = compWidget.opts // vnode saved options
                    widgets.forEach(item => {
                        const vNodeOpt = getOptByProp(item.prop, vNodeOpts)
                        let value = (vNodeOpt != null && vNodeOpt.value != null) ? vNodeOpt.value : item.defaultValue
                        // deep clone
                        if (typeof value === 'object') {
                            value = deepClone(value)
                        }
                        const opt = new Option(item.prop, value, item.lazy)
                        if (options.hasOwnProperty(nodeKey)) {
                            options[nodeKey].push(opt)
                        } else {
                            options[nodeKey] = [opt]
                        }
                    })
                })
            }
            this.refreshView()
        },
        refreshView: function () {
            this.show = false
            this.$nextTick(function () {
                this.show = true
            })
        },
        /*
        save options, handle lazy value
        */
        saveOptions: function () {
            var options = this.$options.options
            Object.keys(options).forEach(key => {
                const opts = options[key]
                if (!Array.isArray(opts)) {
                    return
                }
                opts.forEach(item => {
                    if (item.lazy) {
                        item.value = item.lazyValue
                    }
                })
            })
            EditorUtils.emitOptionsUpdate(options, true)
        },
        listDelete: function (list, index) {
            list.splice(index, 1)
            EditorUtils.emitOptionsUpdate(this.$options.options, false)
            this.refreshView()
        },
        listAdd: function (list, item) {
            list.push({ el: item.el, options: [] })
            EditorUtils.emitOptionsUpdate(this.$options.options, false)
            this.refreshView()
        }
    }
}
