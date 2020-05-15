import Raven from 'raven-js'
import Vue from 'vue'
import RavenVue from 'raven-js/plugins/vue'
export const init_sentry = (option = {}) => {
    let default_opt = {
        tag: ''
    }
    const options = Object.assign(default_opt, option)
    const is_online = /\/\/tools.hundun.cn/g.test(window.location.origin)
    const st_host = is_online ? 'https://7a2ed938556147e3a4931ceffe3370c1@sentry.hundun.cn/145' : 'https://9166b6148e934b9ab67020c1a5609dcc@sentry.hundun.cn/8'
    const ravenOptions = {
        ignoreErrors: [
            'WeixinJSBridge is not defined',
            'TouTiao is not defined',
            'Can\'t find variable: ZhihuiOS',
            'x5onSkinSwitch is not defined',
            'main is not defined',
            'Can\'t find variable: main'
        ],
        includePaths: [
            /https?:\/\/(t)?tools\.hundun\.cn/
        ]
    }

    Raven.setTagsContext({
        environment: is_online ? 'production' : 'test',
        application: options.tag
    })

    Raven.config(process.env.SENTRY_HOST || st_host, ravenOptions).addPlugin(RavenVue, Vue).install();

    window.onerror = function (e) {
        console.log('from window.onerror')
        Raven.captureException(e)
    }
    window.addEventListener('error', event => {
        console.log('from window.addEventListener(error)')
        // 过滤js error
        let target = event.target || event.srcElement;
        let isElementTarget = target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement;
        if (!isElementTarget) return false;
        // 上报资源地址
        let url = target.src || target.href
        if (url && url != window.location.href) {
            console.log(`资源 ${url} 加载失败`)
            Raven.captureMessage(`资源加载失败`)
        }
    }, false)
    Vue.config.errorHandler = (err, vm, info) => {
        console.log('from Vue.config.errorHandler')
        Raven.captureException(err)
    }
}