
import tpl from './plugin.performance.row.html'
import tplEngine from '../lib/tpl_engine'

const css = `
.performance-pligin-row {
    display: flex;
    border-bottom: 1px solid #eee;
}
.performance-plugin-row-key {
    flex: 1;
    padding: 5px 8px;
    white-space: pre-wrap;
    word-break: break-word;
    border-right: 1px solid #eee;
}
.performance-plugin-row-value {
    flex: 1;
    padding: 5px 8px;
    padding-left: 5px;
    white-space: pre-wrap;
    word-break: break-word;
}
`
window.timingObj = {};
const injectCss = () => {
    let style = document.getElementsByTagName('style')
    if (style && style[0]) {
        let origin_innerHTML = style[0].innerHTML
        style[0].innerHTML = origin_innerHTML + css
    }else {
        // TODO: 没有style标签 创建标签
    }
}
const init_performance_plugin = () => {
    var performance_plugin = new VConsole.VConsolePlugin('performance_plugin', 'performance');
    performance_plugin.on('init', () => {
        injectCss()
    })
    performance_plugin.on('renderTab', (cb) => {
        window.addEventListener('load', function () {
            getTiming()
            function getTiming() {
                let time = performance.timing
                var loadTime = (time.loadEventEnd - time.loadEventStart) / 1000;
                if (loadTime < 0) {
                    setTimeout(function () {
                        getTiming();
                    }, 200);
                    return;
                }
                try {
                    timingObj['重定向时间'] = (time.redirectEnd - time.redirectStart);
                    timingObj['DNS解析时间'] = (time.domainLookupEnd - time.domainLookupStart);
                    timingObj['TCP完成握手时间'] = (time.connectEnd - time.connectStart);
                    timingObj['HTTP请求响应完成时间'] = (time.responseEnd - time.requestStart);
                    timingObj['DOM开始加载前所花费时间'] = (time.responseEnd - time.navigationStart);
                    timingObj['DOM加载完成时间'] = (time.domComplete - time.domLoading);
                    timingObj['DOM结构解析完成时间'] = (time.domInteractive - time.domLoading);
                    timingObj['脚本加载时间'] = (time.domContentLoadedEventEnd - time.domContentLoadedEventStart);
                    timingObj['onload事件时间'] = (time.loadEventEnd - time.loadEventStart);
                    timingObj['页面完全加载时间'] = (timingObj['重定向时间'] + timingObj['DNS解析时间'] + timingObj['TCP完成握手时间'] + timingObj['HTTP请求响应完成时间'] + timingObj['DOM结构解析完成时间'] + timingObj['DOM加载完成时间']);

                    let value = timingObj
                    let keys = Object.keys(value)
                    let a = tplEngine(tpl, { value, keys })
                    cb(a)
                } catch (e) {
                    console.log(e)
                }
            }
        })
    })
    return performance_plugin
}
export default init_performance_plugin