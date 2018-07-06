import vdata from './vdata'
import { objectPath } from './utils'
import components from '../json/components.json'

function DynamicContext(tag, attr, children) {
    this.tag = tag
    this.attr = attr
    this.children = children
}

/*
generate html element attributes
 */
function handleOptions(_vm, vNode, obj) {
    let options = vNode.options
    if (options == null) {
        options = []
    }
    let splitKey
    let attr = vdata.createAttr(vNode.attr.native())
    let bind = vModel.bind(_vm)
    let data = obj
    let tag = vNode.tag
    let children = []
    options.forEach(item => {
        const prop = item.prop
        const value = item.value
        if (prop == null || value == null) {
            return
        }
        if (prop === 'v-model') {
            bind(attr, data, value)
        } else if (prop === 'children') {
            let childNode
            if (Array.isArray(value)) {
                value.forEach(child => {
                    const options = child.options
                    childNode = stardComp.create(child.el)
                    childNode.options = options != null ? options : []
                    children.push(childNode)
                })
            } else {
                childNode = value
                children.push(childNode)
            }
        } else {
            splitKey = prop.split('.')
            if (splitKey.length === 1) {
                attr.set(prop, value)
            } else if (splitKey.length === 2) {
                const object = {}
                object[splitKey[1]] = value
                attr.set(splitKey[0], object)
            } else {
                throw new Error('not support props:' + prop)
            }
        }
    })
    return new DynamicContext(tag, attr, children)
}

function vModel(attr, obj, model) {
    var objPath = objectPath.bind(this)
    attr.set('props', { value: objPath(obj, model).v })
    attr.set('on', {
        input: function (value) {
            objPath(obj, model, { v: value })
            this.$emit('input', value)
        }.bind(this)
    })
}

var stardComp = {}

Object.keys(components).forEach(key => {
    Object.assign(stardComp, components[key])
})

function validate(compName) {
    if (compName == null) {
        throw new Error('component name cannot be null')
    }
    if (stardComp[compName] == null) {
        throw new Error('cannot get component name:[' + compName + ']')
    }
}

stardComp.createRoot = function (compName) {
    validate(compName)
    var vNode = vdata.createRoot(stardComp[compName])
    vNode.type = compName
    return vNode
}

/**
 * Generate vnode data by component type
 */
stardComp.create = function (compName, root) {
    validate(compName)
    const compData = stardComp[compName]
    const vNode = vdata.createVnode(compData)
    vNode.type = compName
    if (root != null) {
        const key = root.genKey()
        vNode.key = key
    }
    const _self = this
    const children = compData.children
    if (children != null) {
        children.forEach(child => {
            const childNode = _self.create(child.key, root)
            vNode.children.push(childNode)
        })
    }
    return vNode
}

export { stardComp, handleOptions }
