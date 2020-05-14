/* eslint-disable new-cap */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-empty */
/* eslint-disable no-underscore-dangle */
import Vue from 'vue'

const math = {
    // 精确算法 - 加法
    Add: function(arg1, arg2, keep) {
        if (arg1 === undefined || arg2 === undefined || arg1 === null || arg2 === null) {
            return 0
        }
        let r1
        let r2
        const Mu = this.Mul
        try {
            r1 = arg1.toString().split('.')[1].length
        } catch (e) {
            r1 = 0
        }
        try {
            r2 = arg2.toString().split('.')[1].length
        } catch (e) {
            r2 = 0
        }
        const m = Math.pow(10, Math.max(r1, r2))
        const val = (Mu(arg1, m) + Mu(arg2, m)) / m
        return keep && keep > 0 ? this.BtcRound(val, keep) : val
    },
    // 精确算法 - 减法
    Sub: function(arg1, arg2, keep) {
        if (arg1 === undefined || arg2 === undefined || arg1 === null || arg2 === null) {
            return 0
        }
        let r1
        let r2
        const Mu = this.Mul
        try {
            r1 = arg1.toString().split('.')[1].length
        } catch (e) {
            r1 = 0
        }
        try {
            r2 = arg2.toString().split('.')[1].length
        } catch (e) {
            r2 = 0
        }
        const m = Math.pow(10, Math.max(r1, r2))
        const n = r1 >= r2 ? r1 : r2
        const val = ((Mu(arg1, m) - Mu(arg2, m)) / m).toFixed(n)
        return keep && keep > 0 ? this.BtcRound(val, keep) : val
    },
    // 精确算法 - 乘法
    Mul: function(arg1, arg2, keep) {
        if (arg1 === undefined || arg2 === undefined || arg1 === null || arg2 === null) {
            return 0
        }
        let m = 0
        const s1 = arg1.toString()
        const s2 = arg2.toString()
        try {
            m += s1.split('.')[1].length
        } catch (e) {}
        try {
            m += s2.split('.')[1].length
        } catch (e) {}

        const val = (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m)
        return keep && keep > 0 ? this.BtcRound(val, keep) : val
    },
    // 精确除法
    Div: function(arg1, arg2, keep) {
        if (arg1 === undefined || arg2 === undefined || arg1 === null || arg2 === null) {
            return 0
        }
        let t1 = 0
        let t2 = 0
        let t3 = 0
        try {
            t1 = arg1.toString().split('.')[1].length
        } catch (e) {}
        try {
            t2 = arg2.toString().split('.')[1].length
        } catch (e) {}
        const arg3 = Number(arg1.toString().replace('.', '')) / Number(arg2.toString().replace('.', ''))
        try {
            t3 = arg3.toString().split('.')[1].length
        } catch (e) {}
        const val = Number(arg3.toString().replace('.', '')) / Math.pow(10, t1 + t2 + t3)
        return keep && keep > 0 ? this.BtcRound(val, keep) : val
    },
    // 格式化数字千分位
    Thousands: function(num) {
        if (num === Infinity) {
            return '∞'
        }
        return (
            num &&
            num.toString().replace(/([+-]?)(\d+)([.]\d+)?/, function($0, $1, $2, $3) {
                return (
                    $1 +
                    $2.replace(/(\d)(?=(\d{3})+$)/g, function($10, $11) {
                        return $11 + ','
                    }) +
                    (!$3 ? '.00' : $3.length < 3 ? $3 + '0' : $3)
                )
            })
        )
    },
    // 格式化数字，保留小数位，不自动补0
    BtcRound: function(num, n) {
        let dd = 1
        let tempnum
        for (let i = 0; i < n; i++) {
            dd *= 10
        }
        tempnum = num * dd
        tempnum = Math.round(tempnum)
        return tempnum / dd
    },
    // 格式化输入为数字，小数位保留，不自动补
    InputNum(str, len = 4) {
        const reg = new RegExp('\\d+(\\.)?(\\d+)?', 'g')
        const reg2 = new RegExp('\\d+(\\.\\d{1,' + len + '})?', 'g')
        const resArr = reg.exec(str)
        const res2Arr = reg2.exec(str)
        const res = resArr ? resArr[0] : ''
        let res2 = res2Arr ? String(res2Arr[0]) : ''
        if (res2.includes('.')) {
            const _res2 = res2.split('.')
            res2 = parseInt(_res2[0], 10) + '.' + (_res2[1] || '')
        }
        // 返回值[处理为数字, 原始输入的只处理非数字的字符不包括小数点, 有小数点时原始输入]
        const result = [res, res2, res2.includes('.') ? res2 : res]
        return result
    },
    // 转数字
    Num(str) {
        return parseFloat(str || 0)
    },
    // 科学计数转换为字符串
    E2Str(num) {
        try {
            const _num = Number(num || 0)
            const m = _num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
            return _num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
        } catch (e) {
            return num
        }
    },
    // 保留小数，小数位0后面保留point位数字
    less1keep3(num, keep = 2, point = 3) {
        num = parseFloat(num)
        if (num < 1 / Math.pow(10, keep)) {
            const r = String(num).match(new RegExp('0.(0)*[0-9]{' + point + '}'))
            return r ? r[0] : num
        }
        return this.BtcRound(num, keep)
    },
    // 密码校验
    testPwd(v) {
        return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s])?[\x00-\xff]{8,12}$/.test(v)
        // return /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_][^\u4e00-\u9fa5]{7,}$/.test(v)
    },
    // 邮箱校验
    testEmail(v) {
        return /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(v)
    },
    // 手机号校验前面可加区号带空格
    testTel(v, bol) {
        if (bol) {
            return /^(\+\d{1,5}\s)(\d{6,11})$/.test(v)
        }
        return /^(\+\d{1,5}\s)?(\d{6,11})$/.test(v)
    },
    // 判断显示正负
    Abs(num, type) {
        let symbol = type == 4 ? '+' : type == 2 ? '-' : ''
        let number = math.Thousands(Math.abs(num))
        return symbol + number
    }
}

const plugin = {
    install(Vue) {
        Vue.prototype.$math = math
        Vue.$math = math
    },
    $math: math
}

Vue.use(plugin)
