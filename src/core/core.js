/**
 * 
 * hd-debugger 工具  v1.0.0 By jie
 * 
 */
import { query } from '../lib/tools'
import init_ls_plugin from '../plugins/localstorage'

class Core {
    store = []
    settings = {
        cdn: '//cdn.bootcss.com/vConsole/3.3.4/vconsole.min.js',
        // 是否在页面最开始 加载script
        default_load_script: true,
        // 是否开启默认body的entry
        enable_body_entry: true,
        // 是否开启url entry
        enable_url_entry: true,
        // url入口 key
        url_entry_key: 'vconsole',
        // url入口 value
        url_entry_value: 'show',
        // 自定义entry
        entry: null
    }
    // script 是否已经加载完成
    loaded_script = false
    // VConsole实例
    vc = null
    method_list = ['log', 'info', 'warn', 'debug', 'error']
    constructor(options) {
        this.merge_options(options)
        this.init()
    }
    rewrite_console() {
        var _this = this
        _this.method_list.forEach(item => {
            var method = console[item]
            console[item] = function () {
                _this.store.push({
                    logType: item,
                    logs: arguments
                })
                method.apply(console, arguments)
            }
        })
    }
    async init() {
        // 重写console
        this.rewrite_console()
        // 是否直接加载js
        if (this.settings.default_load_script) {
            try {
                await this.load_script()
            } catch (e) {
                console.log(e)
            }
        }
        if (this.settings.enable_body_entry) {
            this.ebable_body_entry()
        }
        if (this.settings.enable_url_entry) {
            this.enable_url_entry()
        }
    }
    // merge options into settings
    merge_options(options) {
        if (!!options) {
            for (var i in options) {
                if (options.hasOwnProperty(i)) {
                    this.settings[i] = options[i]
                }
            }
        }
    }
    load_script(src = this.settings.cdn) {
        var _this = this
        if (!!_this.loaded_script) {
            return
        }
        return new Promise((resolve, reject) => {
            var script, ready, t;
            script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = src
            script.onload = script.onreadystatechange = function () {
                if ((!this.readyState || this.readyState == 'complete')) {
                    _this.load_script_complete()
                    resolve()
                }
            }
            script.onerror = function (err) {
                console.debug('js加载出错，请检查url是否有错')
                reject(err)
            }
            t = document.getElementsByTagName('script')[0]
            t.parentNode.insertBefore(script, t)
        })

    }
    load_script_complete() {
        this.loaded_script = true
        this.vc = new window.VConsole()
        this.load_vc_plugins()
        this.vc.hideSwitch()
    }
    load_vc_plugins() {
        const ls_plugin = init_ls_plugin()
        this.vc.addPlugin(ls_plugin)

    }
    show_vc() {
        if (!this.vc) {
            console.debug(`VConsole未完成加载`)
            return false
        }
        if (!this.is_vc_switch_show()) {
            this.vc.showSwitch()
        }
        this.vc.show()
    }
    // vc-swicth 是否已经show
    is_vc_switch_show() {
        let vc_switch = document.querySelector('.vc-switch')
        return !!vc_switch && vc_switch.style.display == 'block'
    }
    async enable_url_entry() {
        let _this = this
        if (!_this.loaded_script) {
            await this.load_script()
        }
        let k = this.settings.url_entry_key;
        let v = this.settings.url_entry_value;
        let real_value = query(k)
        if (real_value && real_value === v) {
            this.show_vc()
        }
    }
    async ebable_body_entry() {
        let _this = this
        if (!_this.loaded_script) {
            await this.load_script()
        }
        const maxClientX = 40
        const maxClientY = 40
        var count = 0,
            entry = document.querySelector('body')
        if (entry) {
            entry.addEventListener('click', function (e) {
                if (e.clientX < maxClientX && e.clientY < maxClientY) {
                    count++
                } else {
                    count = 0
                }
                if (count > 5) {
                    count = -1000
                    _this.show_vc()
                }
            })
        }
    }
}

export default Core