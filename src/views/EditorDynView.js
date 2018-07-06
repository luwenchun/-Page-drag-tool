import { handleOptions } from '../assets/js/component'

export default {
    name: 'EditorDynView',
    props: {
        vNode: {
            type: Object,
            default: function () {
                return null
            }
        }
    },
    data() {
        return {
            domTree: this.vNode,
            data: {}
        }
    },
    render(h) {
        console.log('render')
        return this.createElement(h, this.domTree)
    },
    methods: {
        createElement: function (h, vNode) {
            var _self = this
            if (vNode == null) {
                throw new Error('vNode can\'t be null')
            }
            if ((typeof vNode) === 'string') {
                return vNode
            }
            const dynContext = handleOptions(this, vNode, this.data)
            const newChildren = vNode.children.concat(dynContext.children)
            const children = newChildren.map(function (child) {
                return _self.createElement(h, child)
            })
            return h(dynContext.tag, dynContext.attr.native(), children)
        }
    }
}
