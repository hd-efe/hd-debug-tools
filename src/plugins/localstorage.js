const css = `
.ls-pligin-row {
    display: flex;
    border-bottom: 1px solid #eee;
}
.ls-plugin-row-key {
    flex: 1;
    padding: 5px 8px;
    white-space: pre-wrap;
    word-break: break-word;
    border-right: 1px solid #eee;
}
.ls-plugin-row-value {
    flex: 4;
    padding: 5px 8px;
    padding-left: 5px;
    white-space: pre-wrap;
    word-break: break-word;
}
.ls-plugin-row-oper {
    padding: 5px 8px;
    padding-left: 5px;
    flex: 1;
}
`
import tpl from './plugin.row.html'
import tplEngine from '../lib/tpl_engine'
const injectCss = () => {
    let style = document.getElementsByTagName('style')
    if (style && style[0]) {
        let origin_innerHTML = style[0].innerHTML
        style[0].innerHTML = origin_innerHTML + css
    }else {
        // TODO: 没有style标签 创建标签
    }
}
const init_ls_plugin = () => {
    var ls_plugin = new VConsole.VConsolePlugin('ls_plugin', 'LocalStorage');
    ls_plugin.on('init', () => {
        injectCss()
    })
    ls_plugin.on('renderTab', (cb) => {
        let storage = window.localStorage
        let keys = Object.keys(storage)
        let a = tplEngine(tpl, {storage, keys})
        cb(a)
    })
    return ls_plugin
}
export default init_ls_plugin