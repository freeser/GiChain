/* eslint-disable no-underscore-dangle */
/* eslint-disable curly */
/* eslint-disable no-param-reassign */
// set function parseTime,formatTime to filter
export { parseTime, formatTime } from '@/utils'

function pluralize(time, label) {
    if (time === 1) {
        return time + label
    }
    return time + label + 's'
}

export function timeAgo(time) {
    const between = Date.now() / 1000 - Number(time)
    if (between < 3600) {
        return pluralize(~~(between / 60), ' minute')
    } else if (between < 86400) {
        return pluralize(~~(between / 3600), ' hour')
    }
    return pluralize(~~(between / 86400), ' day')
}

/* 数字 格式化*/
export function numberFormatter(num, digits) {
    const si = [{ value: 1e18, symbol: 'E' }, { value: 1e15, symbol: 'P' }, { value: 1e12, symbol: 'T' }, { value: 1e9, symbol: 'G' }, { value: 1e6, symbol: 'M' }, { value: 1e3, symbol: 'k' }]
    for (let i = 0; i < si.length; i++) {
        if (num >= si[i].value) {
            return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
        }
    }
    return num.toString()
}

export function toThousands(num, placeholder = '-') {
    if (!String(num).length) return placeholder
    return (Number(num) || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * 时间不显示今年
 */
export function yyyymmdd(val, fmt = 'yyyy-MM-dd hh:mm:ss', auto = true) {
    if (!val) return ''
    let _val = new Date(val.toString())
    if (_val == 'Invalid Date') {
        _val = new Date(val.toString().indexOf('-') != -1 ? val.replace(new RegExp(/-/gm), '/') : val)
    }
    val = _val
    let now = new Date()
    let c = {
        'y+': now.getFullYear(),
        'M+': now.getMonth() + 1,
        'd+': now.getDate()
    }
    let o = {
        'y+': String(now.getFullYear()),
        'M+': val.getMonth() + 1, // 月份
        'd+': val.getDate(), // 日
        'h+': val.getHours(), // 小时
        'm+': val.getMinutes(), // 分
        's+': val.getSeconds(), // 秒
        'q+': Math.floor((val.getMonth() + 3) / 3), // 季度
        S: val.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) {
        let year = o['y+'].substr(4 - RegExp.$1.length)
        fmt = fmt.replace(RegExp.$1, auto ? (c['y+'] != year ? year : '') : year)
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            let $val = RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(String(o[k]).length)
            if (['M+', 'd+'].indexOf(k) != -1 && auto && c['y+'] == o['y+'] && c['M+'] == o['M+'] && c['d+'] == o['d+']) {
                fmt = fmt.replace(RegExp.$1, '')
            } else {
                fmt = fmt.replace(RegExp.$1, $val)
            }
        }
    }
    let num = 0
    return fmt
        .split('')
        .map(item => {
            let isnum = parseInt(item, 10) >= 0
            return num ? item : isnum ? (num++, item) : ''
        })
        .join('')
}

/**
 * 千分位分割
 */
export function thousand(num, keep = 0) {
    if (num == Infinity) return '∞'
    if (num == -Infinity) return '-∞'
    if (!num) return '0.00'
    return (
        num &&
        num.toString().replace(/([+-]?)(\d+)([.]\d+)?/, function($0, $1, $2, $3 = '') {
            return (
                $1 +
                $2.replace(/(\d)(?=(\d{3})+$)/g, function($10, $11) {
                    return $11 + ','
                }) +
                (keep > 0 ? (($3 || '.') + Array(keep).fill('0').join('')).substr(0, keep + 1) : $3)
            )
        })
    )
}
