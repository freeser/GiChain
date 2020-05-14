<template>
    <el-input type="text" v-bind:value="value" v-on="$listeners" v-bind="$attrs" autoComplete="off" class="captcha-img">
        <el-button slot="append" @click="refresh" class="tcenter">
            <img class="img" :src="src" alt="验证码" title="点击刷新">
        </el-button>
    </el-input>
</template>
<script>
    export default {
        name: 'captcha-img',
        props: [ 'value' ],
        data () {
            return {
                src: ''
            }
        },
        mounted () {
            this.refresh()
        },
        methods: {
            refresh () {
                this.src = process.env.VUE_APP_HOST + '/authImage?v=' + +new Date()
                this.$emit('input', '')
            }
        }
    }
</script>
<style lang="scss">
    .captcha-img .el-input-group__append{
        padding: 0;
        .img{
            border-radius: 2px;
            max-height: 30px;
        }
    }
</style>
