<template>
    <div class="query-list-component">
        <b-card v-if="$slots.search">
            <template slot="title" v-if="searchTitle">
                <span class="big18" v-if="!$slots['search-title']">查询</span>
                <slot name="search-title"></slot>
            </template>
            <div class="search-box clearfix">
                <slot name="search"></slot>
                <template v-if="searchBtn">
                    <el-button
                        type="primary"
                        :loading="btnLoading"
                        @click="$emit('btnSearch')"
                        class="filter-item"
                        >搜索</el-button
                    >
                    <el-button
                        type="default"
                        @click="$emit('clearFun')"
                        class="filter-item"
                        >重置</el-button
                    >
                </template>
            </div>
        </b-card>
        <b-card>
            <template slot="title">
                <slot name="list-title"></slot>
                <el-button
                    class="bgfff text-btn"
                    v-if="downUrl && showElement(downUrl)"
                    @click="$emit('downloadBtn')"
                    >导出为excel</el-button
                >
            </template>
            <template>
                <slot></slot>
            </template>
        </b-card>
        <slot name="other"></slot>
    </div>
</template>
<script>
    import BCard from './card'
    export default {
        props: {
            btnLoading: false,
            searchTitle: {
                type: Boolean,
                default: true,
            },
            searchBtn: {
                type: Boolean,
                default: true,
            },
            downUrl: '',
        },
        components: {
            BCard,
        },
    }
</script>

<style lang="less">
    .search-box {
        margin-bottom: -15px;
        .filter-item {
            float: left;
            max-width: 184px;
            margin: 0 7px 15px 0;
            &.el-input__inner,
            .el-input__inner {
                border-radius: 2px;
                height: 36px !important;
                line-height: 1 !important;
                font-size: 16px;
            }
            &.el-button {
                height: 36px;
            }
        }
        .el-date-editor {
            margin-right: 7px;
            margin-bottom: 15px;
            max-width: 350px;
            input {
                width: 44% !important;
            }
            .el-range__close-icon {
                width: 15px !important;
            }
        }
        .el-date-editor--date {
            input {
                width: 100% !important;
            }
        }
        .max-el-date-editor {
            input {
                width: 100% !important;
            }
        }
        .el-dropdown {
            border: 1px solid #dcdfe6;
            line-height: 36px;
            border-radius: 2px;
            padding: 0 15px;
            width: 184px;
            i {
                color: #c0c4cc;
            }
        }
    }
    .no-box-shadow {
        .box-shadow {
            box-shadow: none;
            .box-content {
                padding: 0;
            }
            & + .box-shadow {
                margin-top: 0;
            }
        }
    }
</style>
