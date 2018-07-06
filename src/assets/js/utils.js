function objectPath(obj, path, valueObj) {
    var _vm = this
    var splitKey = path.split('.')
    var target = obj
    var attr
    var v = valueObj == null ? undefined : valueObj.v
    var dv = valueObj == null ? null : valueObj.dv
    for (var i = 0, len = splitKey.length; i < len; i++) {
        attr = splitKey[i]
        var last = i === len - 1
        if (target.hasOwnProperty(attr) === false) {
            if (last) {
                _vm.$set(target, attr, dv)
            } else {
                _vm.$set(target, attr, {})
            }
        } else if (last && v !== undefined) {
            target[attr] = v
        }
        target = target[attr]
    }
    return { v: target }
}

function deepClone(source) {
    if (source == null) {
        return
    }
    return JSON.parse(JSON.stringify(source))
}

export { objectPath, deepClone }
