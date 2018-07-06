const vBuilder = {
    createVnode: function (prop, children) {
        return new Vnode(prop, children)
    },
    createRoot: function (prop, children) {
        var root = new Vnode(prop, children)
        root.key = -1
        root.seq = 0
        root.isRoot = true
        root.genKey = function () {
            return this.seq++
        }
        return root
    },
    createAttr: function (source) {
        return new Attribute(source)
    }
}

function Vnode(prop, children) {
    if (prop == null) {
        prop = {}
    }
    this.children = []
    if (Array.isArray(children)) {
        this.children = children
    } else if (children instanceof Vnode) {
        this.children.push(children)
    }
    this.tag = prop.tag
    if (prop.attr instanceof Attribute) {
        this.attr = prop.attr
    } else {
        this.attr = new Attribute(prop.attr)
    }

    this.type = prop.type // input,form .etc
    this.key = prop.key
    this.defaultValue = prop.defaultValue
    // dynamic content
    if (Array.isArray(prop.options)) {
        this.options = prop.options
    } else {
        this.options = []
    }
}

function Attribute(source) {
    if (source == null) {
        this.source = {}
    } else {
        this.source = source
    }
    this.set = function (attr, value) {
        if (this.source[attr] == null) {
            this.source[attr] = value
        } else {
            this.source[attr] = Object.assign(this.source[attr], value)
        }
    }
}

Attribute.prototype.native = function () {
    var target = Object.assign({}, this.source)
    return target
}

export default vBuilder
