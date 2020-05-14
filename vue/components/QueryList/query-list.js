/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
// 查询列表结果页面公共方法
import QueryList from './index'
import CsPagination from '../Pagination'

export default {
    components: {
        QueryList,
        CsPagination
    },
    data() {
        return {
            tableData: null,
            total: 0,
            listLoading: false,
            form: {},
            lockForm: {},
            pagination: {
                total: 0,
                limit: 10,
                page: 1
            },
            download: false
        }
    },
    mounted() {
        this.$nextTick(() => {
            if (!this.notLoading) {
                this.btnSearch()
            }
        })
        this.$bus.$emit('back-url', this.$route.query.from || '');
    },
    methods: {
        // 查询列表(分页)
        getList(pageNum = 1) {
            if (this.listLoading || !this.queryUrl) { return }
            if (this.pagination) {
                // 替换每页条数
                this.pagination.limit = this.lockForm.pageSize = this.$store.state.user.pageSize[this.$route.name] || 10
                    // 替换每页页码
                this.pagination.page = this.lockForm.pageIndex = pageNum
            }

            this.form = {
                ...this.lockForm
            }
            this.listLoading = true
            // 私有变量以下划线开头的变量在request里面$get请求前处理掉
            this.$axios
                .$get(this.queryUrl, this.form)
                .then(d => {
                    this.listLoading = false
                    if (d.success && d.data) {
                        let incream = 0
                        let data = d.data
                        if (this.pagination) {
                            let pa = data.pagination
                            this.pagination = {
                                total: pa.total,
                                limit: pa.size,
                                page: pa.num
                            }
                            incream = pa.size * (pa.num - 1)
                        }
                        this.tableData = ('content' in data ? data.content || [] : data).map((item, idx) => {
                            return {
                                num: (idx + 1) + incream,
                                ...item
                            }
                        })
                    } else {
                        this.tableData = []
                        if (this.pagination) {
                            this.pagination.total = 0
                        }
                    }
                })
                .catch(() => {
                    this.tableData = []
                    this.listLoading = false
                    if (this.pagination) {
                        this.pagination.total = 0
                    }
                })
        },
        refreshList() {
            this.getList(this.pagination ? this.pagination.page : 1)
        },
        // 搜索按钮
        btnSearch(pageNum = 1) {
            if (this.listLoading) { return }
            this.lockForm = {...this.form }
            this.getList(pageNum)
        },
        // 下载按钮
        downloadBtn(url, total) {
            if (total > 100000) {
                return this.$message.error('导出数据量过大（不能超过10万条）')
            }
            this.download = true
            let config = {
                method: 'get',
                url: '/dcpay_backstage' + url,
                data: this.lockForm
            }
            let $form = document.createElement('form')
            $form.setAttribute('target', 'down-file-iframe')
            $form.setAttribute('method', config.method)
            $form.setAttribute('action', config.url)
            $form.setAttribute('style', 'width:0;height:0;position:fixed;bottom: -1000;left: -1000;')
            for (var key in config.data) {
                let $input = document.createElement('input')
                $input.setAttribute('type', 'hidden')
                $input.setAttribute('name', key)
                $input.value = config.data[key]
                $form.appendChild($input)
            }
            document.body.appendChild($form)
            $form.submit()
            document.body.removeChild($form)
            window.setTimeout(() => (this.download = false), 500)
        },
        // 清空搜索框
        clearFun() {
            let form = {}
            Object.keys(this.form).forEach(key => {
                if (key.includes('_')) {
                    form[key] = this.form[key]
                }
            })
            this.form = form
        }
    },
    destroyed() {
        this.$bus.$emit('back-url', this.$route.query.from || '')
    }
}
