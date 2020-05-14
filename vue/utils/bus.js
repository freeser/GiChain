import Vue from 'vue'

// 挂载全局事件
const bus = new Vue()
const plugin = {
    install(Vue) {
        Vue.prototype.$bus = bus
        Vue.$bus = bus
        window.$bus = bus
    },
    $bus: bus
}

Vue.use(plugin)