<template>
    <div class="cs-captcha-component">
        <template ng-if="type=='aliyun'">
            <div id="__nc">
                <div :id="dynamicId" class="nc-container"></div>
            </div>
        </template>
        <template ng-if="type=='google'">
            <div :id="dynamicId" class="g-recaptcha"></div>
        </template>
    </div>
</template>

<script>
    import { isPc } from '@/utils/isPc'

    function randomCode (length) {
        let str = ''
        for (; str.length < length; str += Math.random().toString(36).substr(2)) { }
        return str.substr(0, length)
    }

    export default {
        name: 'captcha-ali',
        data () {
            return {
                type: '',
                loading: true,
                $nc: null
            }
        },
        computed: {
            dynamicId () {
                this.nc_id = randomCode(10)
                return this.nc_id
            },
            language () {
                const locale = 'zh_CN'
                switch (locale) {
                    case 'zh_CN': return this.type == 'aliyun' ? 'cn' : 'zh-CN'
                    case 'zh_TW': return this.type == 'aliyun' ? 'tw' : 'zh-TW'
                    case 'th': return this.type == 'aliyun' ? 'th_TH' : 'th'
                    default: return locale
                }
            }
        },
        mounted () {
            this.initAliYun()
        },
        methods: {
            initAliYun() {
                let that = this
                let _ispc = isPc()
                const fnInit = function() {
                    if (that.type) return
                    that.type = 'aliyun'
                    let nc_scene = _ispc ? 'nc_register' : 'nc_register_h5';
                    let nc_appkey = 'FFFF0N000000000068DC'
                    let nc_token = [nc_appkey, (new Date()).getTime(), Math.random()].join(':');
                    let config = {
                        renderTo: '#' + that.dynamicId,
                        appkey: nc_appkey,
                        scene: nc_scene,
                        token: nc_token,
                        language: that.language,
                        bannerHidden:false,
                        initHidden:false,
                        callback: (data) => {
                            that.$emit('callback', {
                                appKey: nc_appkey,
                                csessionid: data.csessionid,
                                sig: data.sig,
                                token: nc_token,
                                scene: nc_scene,
                                type: 'aliyun'
                            })
                        }
                    }

                    try {
                        if (!_ispc && typeof NoCaptcha != 'undefined') {
                            that.$nc = NoCaptcha.init(config);
                            NoCaptcha.setEnabled(true);
                            that.$nc.reset();
                        } else if (_ispc && typeof noCaptcha != 'undefined') {
                            that.$nc = new noCaptcha(config)
                        }
                    } catch(e){}
                }
                if (_ispc) {
                    !that.type && this.load('https://aeis.alicdn.com/sd/ncpc/nc.js?t=2018112112').then(fnInit)
                } else {
                    !that.type && this.load('https://g.alicdn.com/sd/nch5/index.js?t=2018112112').then(fnInit)
                }
            },
            reset() {
                this.$nc.reload();
                this.$emit('callback', {
                    appKey: '',
                    csessionid: '',
                    sig: '',
                    token: '',
                    scene: '',
                    type: ''
                })
            },
            initGoogle() {
                let that = this
                // 为google验证服务
                window.onCallback = function (res) {
                    that.$emit('callback', {
                        type: 'google',
                        csessionid: res
                    })
                }
                window.onloadCallback = function() {
                    if (typeof grecaptcha != 'undefined' && !that.type) {
                        that.type = 'google'
                        try {
                            grecaptcha.render(that.dynamicId, {
                                'sitekey' : '6LfweGoUAAAAAOUzttoBCSJhiyQo_0j96OIVWNRW',
                                'callback' : onCallback
                            })
                        } catch (e) {}
                        that.loading = false
                    }
                }
                this.load('https://www.google.com/recaptcha/api.js?onload=onloadCallback&hl=' + this.language + '&render=explicit')
            },
            load (src, opts = {}) {
                let { async = !1, defer = !1, parent = document.head, crossorigin = !1 } = opts
                return new Promise(function (resolve, reject) {
                    var s = document.createElement('script')
                    s.type = 'text/javascript'
                    s.src = src
                    async && s.setAttribute('async', async)
                    defer && s.setAttribute('defer', defer)
                    crossorigin && s.setAttribute('crossOrigin', 'anonymous')
                    s.onload = () => { resolve(src) }
                    s.onerror = () => reject(new Error(src))
                    parent.appendChild(s)
                })
            }
        },
        beforeDestroy () {
            var olds = document.head.querySelectorAll('script')
            try {
                for(var i = 0; i < olds.length; i++){
                    let src = olds[i].src
                    if (src.indexOf('alicdn.com/sd/ncpc/nc') != -1 ||
                        src.indexOf('alicdn.com/security/umscript') != -1 ||
                        src.indexOf('alicdn.com/js/awsc') != -1 ||
                        src.indexOf('alicdn.com/js/cj/110') != -1 ||
                        src.indexOf('umid/getumid') != -1 ||
                        src.indexOf('recaptcha/api') != -1 ||
                        src.indexOf('nocaptcha/initialize') != -1) {
                        document.head.removeChild(olds[i])
                    }
                }
                this.type = ''
            } catch(e){}
        }
    }
</script>

<style lang="scss">
    @import '~@/styles/variables.scss';
    .cs-captcha-component{
        min-height: 50px;
        .nc_wrapper{ width: 100%!important; }
        .nc_scale{
            background: #fff;
            border-radius: 3px;
            height: 50px;
        }
        .nc-container .nc_scale .btn_slide,.nc-container .nc_scale .btn_ok{
            border: 1px solid #DDDFE7;
            background: #F2F6FF;
        }
        .nc-container .nc_scale span{
            background: $light-blue;
            border-radius: 2px;
            width: 46px; height: 50px; line-height: 49px;
            &.btn_slide{
                color: #0045B7;
                font-size: 24px
            }
        }
        .nc-container .nc_scale .scale_text{
            line-height: 50px;
            border: 1px solid #DDDFE7;
        }
        .nc-container .nc_scale .nc_ok,
        .nc-container .nc_scale .nc_bg{
            background: #D8E2F7!important;
            border-radius: 3px 0 0 3px;
        }
        .nc-container .nc_scale span.nc-lang-cnt{
            font-size: 16px;
        }
        .nc-container .scale_text.scale_text.slidetounlock span[data-nc-lang="_yesTEXT"]{
            color: #fff;
        }
        .nc-container .scale_text.scale_text.slidetounlock span[data-nc-lang="_startTEXT"]{
            color: #fff;
            // background: -webkit-gradient(linear,left top,right top,color-stop(0,#4d4d4d),color-stop(.4,#4d4d4d),color-stop(.5,#fff),color-stop(.6,#4d4d4d),color-stop(1,#4d4d4d));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .nc-container .errloading {
            border: $light-blue 1px solid;
            background-image: none;
            width: 100%!important;
            padding: 9px 14px;
        }
        ._nc{
            .stage{
                padding: 0;
            }
            .stage1 {
                .slider{
                    left: 0; right: 0;
                    background: $light-blue;
                    border: 1px solid $light-blue;
                    border-radius: 3px;
                    box-shadow: none;
                }
                .label{
                    font-size: 18px;
                }
                .button{
                    background: $light-blue;
                    border: 1px solid $light-blue;
                    border-radius: 1px;
                }
                .bg-green {
                    background-color: #1D243B;
                    color: $light-blue;
                }
                .bg-red {
                    background-color: $red;
                }
            }
        }
    }
</style>

