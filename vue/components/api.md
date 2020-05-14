# 组件文档

## BackToTop

返回顶部，无依赖，直接引入调用

![alt text](../static/backtotop.png "Title")

## Captcha

滑动验证，阿里的验证，需要去阿里申请，需要后台配合
会根据网络判断是使用goole验证（墙外）还是阿里验证

![alt text](../static/captcha.png "Title")

![alt text](../static/captcha-google.png "Title")

## CountDown

倒计时组件
依赖 `format-count-time.js`，对时区问题进行修复

| 名称     | 类型       | 是否必须  | 说明         |
| -------- | ------    | -------- | ------------ |
| value    | Number    | 是       | 要转转换的数字，单位秒 |
| start    | Boolean   | 否       | 默认`true`，是否自动开始  |
| format   | String    | 否       | 默认`hh:mm:ss`，可以是`mm:ss` 或者 `ss`等任意时间格式 |
| on-finish   | Function    | 否       | 倒计时完成事件 |

```html
<!-- data参数 timer: 10 -->
<count-down v-model="timer" format="s秒" @on-finish="() => true"/>
<count-down :value="10" format="s"/>
```

## DateRang

日期（范围）控件，依赖`Element-UI`，对element的日期组件二次封装，实现自动更改传入的两个表单key更改表单的值

主要服务于组件`QueryList`

| 名称     | 类型       | 是否必须  | 说明         |
| -------- | ------    | -------- | ------------ |
| value    | Data || Data[]    | 否       | 日期的默认值 |
| keys    | Array   | 是       | 要为`parent`设置的字段 |
| type    | String   | 否       | 默认`datetimerange`，默认日期范围，其它值可以是`data | daterange`等，参考 `Element-UI` |
| format   | String    | 否       | 默认`yyyy-MM-dd HH:mm:ss` |
| placeholder   | String    | 否       | `type: data`时生效，文本框默认占位 |
| parent   | Object    | 是       | `keys`应于的表单 |


```html
<!-- 为表单form设置参数，如下为表单添加'beginTime', 'endTime'两个值 -->
<date-rang :parent="form" :keys="['flowMonth']" type="date" format="yyyy-MM" class="filter-item"></date-rang>
<date-rang :parent="form" :keys="['beginTime', 'endTime']" class="filter-item"></date-rang>
```