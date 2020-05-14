export default function(value) {
    ['[', ']', '{', '}'].forEach(code => {
        if (String(value).includes(code))
            value = String(value).replace(code, encodeURI(code))
    })
    return value
}