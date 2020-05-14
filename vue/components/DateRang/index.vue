<template>
    <el-date-picker v-model="currValue" :type="type" range-separator="-" :placeholder="placeholder" start-placeholder="开始日期" end-placeholder="结束日期" :value-format="format" :format="format"> </el-date-picker>
</template>
<script>
    export default {
        name: 'date-range',
        props: {
            value: Array,
            keys: {
                type: Array,
                required: true,
                default() {
                    return []
                }
            },
            type: {
                type: String,
                default: 'datetimerange'
            },
            format: {
                type: String,
                default: 'yyyy-MM-dd HH:mm:ss'
            },
            placeholder: {
                type: String,
                default: '选择日期'
            },
            parent: Object
        },
        data () {
            return {
                currValue: this.value
            }
        },
        computed: {
            formRang() {
                return this.keys.map(key => (this.parent[key] || '')).join('')
            }
        },
        watch: {
            currValue(value) {
                this.setValue(value)
            },
            formRang(v) {
                if (!v) {
                    this.currValue = null
                }
            }
        },
        mounted () {
            this.setValue(this.value)
        },
        methods: {
            setValue(value) {
                if (!value) return
                [].concat(value).forEach((val, idx) => {
                    let key = this.keys[idx]
                    if (key) {
                        this.$set(this.parent, key, val)
                    }
                })
                this.currValue = value
            }
        }
    }
</script>