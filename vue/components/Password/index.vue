<template>
    <el-input :type="type" v-bind:value="value" v-on="$listeners" v-bind="$attrs" autoComplete="off" class="no-prepend">
        <template slot="prepend"><input type="password" tabindex="100" /></template>
        <!-- <el-button slot="append" @click="toggleType" class="tcenter" tabindex="101">
            <i class="iconfont big18" :class="type == 'password' ? 'icon-yanjing-bi' : 'icon-chakanyanjingshishifenxi2'"></i>
        </el-button> -->
    </el-input>
</template>
<script>
    export default {
        name: 'password',
        props: [ 'value' ],
        data () {
            return {
                type: 'password'
            }
        },
        methods: {
            toggleType () {
                this.type = this.type == 'text' ? 'password' : 'text'
            }
        }
    }
</script>
<style lang="scss">
    .el-input.el-input-group--prepend.no-prepend{
        .el-input-group__prepend{
            position: absolute; border: 0!important; opacity: 0!important;
            width: 0!important; height: 0!important; overflow: hidden!important;
            input{ width: 0!important; height: 0!important; }
        }
    }
</style>
