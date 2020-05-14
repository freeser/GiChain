/**
 * Created by jiachenpan on 16/11/18.
 */
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path)
}

export function isvalidUsername(str) {
    const valid_map = ['admin', 'editor']
    return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
    const urlregex = /^((https?|ftp|wss?)?:\/\/)?([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+)(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
    const reg = /^[a-z]+$/
    return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
    const reg = /^[A-Z]+$/
    return reg.test(str)
}

/* 大小写字母*/
export function validateAlphabets(str) {
    const reg = /^[A-Za-z]+$/
    return reg.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
    return /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(email)
}
/**
 * 密码格式由数字小写字母大写字母特殊符号任选其三长度8位及以上
 * @param {String} password #
 */
export function validatePwd(password) {
    return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s])?[\x00-\xff]{8,12}$/.test(password)
}

/**
 * 正则验证小数位
 */
export function validateDecimal(val, num) {
    const reg = new RegExp('^[0-9]*[1-9][0-9]*$|^[+]{0,1}(\\d+\\.\\d{0,' + num + '})$')
    return reg.test(val)
}

/**
 * 正则校验手机号
 */
export function validatePhone(phone) {
    return /^\d{6,11}$/.test(phone)
}

/**
 * 正则校验IP
 */
export function validateIP(ip) {
    return /(?=(\b|\D))(((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))(?=(\b|\D))/.test(ip)
}
