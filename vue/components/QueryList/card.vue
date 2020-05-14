<template>
    <div class="box-shadow">
        <div class="box-title flex acenter" v-if="$slots['title']">
            <slot name="title"></slot>
        </div>
        <div class="box-content"><slot></slot></div>
    </div>
</template>

<style lang="less">
    .box-shadow{
        box-shadow: 0 1px 6px 0 hsla(0,0%,62.4%,.5);
        .box-title{
            line-height: 46px;
            padding: 0 24px;
            background: $light-gray;
        }
        .box-content{
            background: #fff;
            padding: 15px;
        }
        & + .box-shadow{
            margin-top: 20px;
        }
    }
</style>