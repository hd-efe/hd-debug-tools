/**
 * A simple template engine
 * @param {*} tpl 模版
 * @param {*} data 注入模版的数据
 * @param {*} toString 是否返回子字符  true -> 字符串   false -> dom  默认值： true
 * 
 * @author jie
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 ``` js
 let data = {
    _id: 1,
    style: 'heihe',
    list: [{
        name: 1,
        age: 12
    }, {
        name: 2,
        age: 22
    }]
}

``` template
<div id="{{_id}}" class="vc-item {{style}}">
	{{ for(let i = 0 ; i< list.length; i++) }}
		{{ if (list[i].age > 20)}}
		<div class="vc-item>20">{{list[i].age}}</div>
		<div class="vc-item>20">{{list[i].name}}</div>
		{{ else }}
		<div class="vc-item<=20">{{list[i].age}}</div>
		<div class="vc-item<=20">{{list[i].name}}</div>
		{{ endif }}
	{{ endfor }}
</div>

``` js
tplEngine(list, data, false)
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *  
 */

var tplEngine = function (tpl, data, toString = true) {
    var reg = /\{\{([^\}]+)\}\}/g,
        code = 'var r=[];\n',
        codeWrap = '(function(){\n',
        match = [],
        cursor = 0;
    window.hd_tpl_res = ''
    window.hd_tpl_data = data;
    // line breaks
    tpl = tpl.replace(/^[/r/n]/, '').replace(/\r/g, '').replace(/\n/g, '')
    var add = function (line, isJS = false) {
        if (isJS) {
            if (line.match(/^ ?(for|if)/g)) {
                // for() ---> for {
                // if() ---> if() { 
                code += line + '{\n'
            } else if (line.match(/^ ?else/g)) {
                // else --->  } else {
                code += `}${line}{\n`;
            } else if (line.match(/(endfor|endif)/g)) {
                // endfor ---> }
                // endif ---> }
                code += '}\n'
            } else {
                code += `r.push(${line});\n`;
            }
        } else {
            code += `r.push('${line.replace(/'/g, "\\'")}');\n`
        }

    }
    while (match = reg.exec(tpl)) {
        add(tpl.slice(cursor, match.index))
        add(match[1], true)
        cursor = match.index + match[0].length;
    }
    add(tpl.substr(cursor, tpl.length - cursor))
    code += `hd_tpl_res = r.join("");`
    code = `with(hd_tpl_data) {\n ${code} \n}`
    codeWrap += code;
    codeWrap += `})();`
    // dont use new Function or evel
    let script = document.createElement('script')
    script.innerHTML = codeWrap;
    document.documentElement.appendChild(script)
    let dom = hd_tpl_res;
    document.documentElement.removeChild(script)
    if (!toString) {
        let el = document.createElement('div')
        el.innerHTML = dom;
        dom = el.children[0]
    }
    return dom

}
export default tplEngine;