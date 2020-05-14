export const maxLength = function(maxlen = 0) {
    function lengthFn(rule, value, callback) {
        let len = String(value).length
        if (len && maxlen && len > maxlen) {
            return callback(new Error('不超过'+ maxlen +'个字符'));
        } else {
            callback()
        }
    }
    return maxlen ? [{ validator: lengthFn, trigger: 'change'}] : []
}

export const requireRule = function(maxlen = 0) {
    return [{
        required: true,
        message: '不能为空',
        trigger: 'change'
    }].concat(maxLength(maxlen))
}

export const nameRule = function(maxlen = 0) {
    function nameMax(rule, value, callback) {
        if (String(value).match(new RegExp('^[a-zA-Z0-9\\u4e00-\\u9fa5]+$'))) {
            return callback()
        }
        return callback(new Error('请输入有效的内容'));
    }
    return [
        ...requireRule(maxlen),
        {
            validator: nameMax,
            trigger: 'change'
        }
    ]
}


/**
 * rq 必填
 * lt 小于
 * gt 大于
 * lte 小于等于
 * gte 大于等于
 * int 整数
 */
export function number(rule, value, callback) {
    // 去除空格
    value = String(value)
    let isnum = !!value.match(/^(\-)?\d+(?:\.\d+)?$/)
    // /^\d{1,13}(?:\.\d{0,1})?$/
    if (value && !isnum) {
        return callback(new Error('请输入有效的数字'));
    }

    if (rule.includes('rq') && !isnum) {
        return callback(new Error('请输入有效的数字'));
    }

    if (rule.includes('int') && !value.match(/^(\-)?\d+$/g)) {
        return callback(new Error('请输入有效的整数'));
    }

    value = parseFloat(value)

    if (rule.includes('gt') && value <= 0) {
        return callback(new Error('请输入大于0的数字'));
    } else if (rule.includes('gte') && value < 0) {
        return callback(new Error('请输入≥0的数字'));
    }

    callback();
};

export function gt0(rule, value, callback) {
    number(['gt'], value, callback)
}

export function gte0(rule, value, callback) {
    number(['gte'], value, callback)
}

export function gteint0(rule, value, callback) {
    number(['gte', 'int'], value, callback)
}

export function gtint0(rule, value, callback) {
    number(['gt', 'int'], value, callback)
}

export function intnum(rule, value, callback) {
    number(['int'], value, callback)
}

export function decimal(keep = 0, rang) {
    function keepFn(rule, value, callback) {
        if (String(value).match(new RegExp('^(\\-)?\\d{1,13}(?:\\.\\d{1,'+ keep +'})?$'))) {
            return callback()
        }
        return callback(new Error('请输入有效的数字，最多保留' + keep + '位小数'));
    }
    function rangFn(rule, value, callback) {
        let val = parseFloat(value)
        let min = rang[0]
        let max = rang[1]
        let eq = rang[2]
        let eqName = eq ? '等于' : ''
        if (eq) {
            if (val >= min && val <= max) {
                return callback()
            }
        } else {
            if (val > min && val < max) {
                return callback()
            }
        }
        if (max == Infinity && min > -Infinity) {
            return callback(new Error('请输入大于'+ eqName +' '+ min +' 的数字'));
        }
        if (max < Infinity && min == -Infinity) {
            return callback(new Error('请输入小于'+ eqName +' '+ max +' 的数字'));
        }
        return callback(new Error('请输入 '+ min + ' - ' + max + ' 之间的数字'));
    }
    let rule1 = []
    // 有保留小数
    if (keep > 0) {
        rule1 = [{ validator: keepFn, trigger: 'change' }]
    } else if (keep == 0) {
        // 整数
        rule1 = [{ validator: intnum, trigger: 'change' }]
    }
    // keep: null时不限制小数位置

    let rule2 = []
    // 有范围的数字
    if (rang) {
        rule2 = [{ validator: rangFn, trigger: 'change' }]
    }
    return rule1.concat(rule2)
}