<template>
    <div class="flex acenter pagination-page" v-if="total && pagesize">
        <span>显示{{start}} - {{end}}项&emsp;共{{total}}项</span>&emsp;
        <el-pagination class="flex_1 flex" prev-text="前一页" next-text="下一页"
            :page-sizes="[10, 20, 30, 50, 100]" :page-size="pagesize" :current-page="pagenum"
            @current-change="getList" @size-change="sizeChangeFun" 
            layout="prev, pager, next" :total="total">
            <!-- layout="sizes, prev, pager, next" -->
        </el-pagination>
    </div>
</template>
<script>
    export default {
        props: {
            pageSize: {
                type: Number,
                default: 10
            },
            pageNum: {
                type: Number,
                default: 1
            },
            total: Number
        },
        data (){
            return {
                pagenum: 1,
                pagesize: this.$store.state.user.pageSize[this.$route.name] || 10
            }
        },
        methods: {
            getList (val){
                this.$emit('getList', val)
            },
            // 修改每页条数
            sizeChangeFun (val){
                let num = Math.ceil(this.$math.Div(this.total, val))
                this.pagenum > num && (this.pagenum = num)
                this.pagesize = val
                this.$store.commit('SET_PAGESIZE', [this.$route.name, val])
                this.$emit('getList', this.pagenum, val)
            }
        },
        computed: {
            lastPage (){
                return Math.ceil(this.total / this.pageSize) - this.pagenum <= 0
            },
            start (){
                return this.pagesize * this.pageNum - this.pagesize + 1
            },
            end (){
                return this.total < this.pagesize * this.pageNum ? this.total : this.pagesize * this.pageNum
            }
        },
        watch: {
            pageNum (n){
                this.pagenum = n
            }
        }
    }
</script>
<style lang="scss">
    @import '~@/styles/variables.scss';
    .pagination-page{
        padding-top: 24px;
        color: $txt-color
    }
    .el-pagination{
        padding: 0;
        justify-content: flex-end;
        .el-pagination__sizes{
            -webkit-box-flex: 1;
            -webkit-flex: 1;
                -ms-flex: 1;
                    flex: 1;
            input{
                height: 33px!important;
            }
        }
        button, li{
            height: 33px!important;
            line-height: 33px!important;
            border: 1px solid #E6E6E6!important;
            color: $txt-color!important;
            &:hover{
                background: #F1F1F1;
            }
        }
        li{
            min-width: 33px!important;
            border-right: none!important;
            &:first-child{
                border-left: none!important
            }
        }
        button {
            padding: 0 20px!important;
            &.disabled:hover{
                color: #c0c4cc!important
            }
        }
        .active{
            background: #F1F1F1
        }
    }
</style>

