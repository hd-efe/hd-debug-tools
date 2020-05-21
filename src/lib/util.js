
// 获取url参数 第一个
export const get_param = (key) => {
    return new URLSearchParams(window.location.search).get(key)
}
// 获取url参数 全部
export const get_params = (key) => {
    return new URLSearchParams(window.location.search).getAll(key)
}

const is_xcx = get_param('xcx_open_id')

export const getEnv = () => {
    let environment;
    let user_id = get_search_params('user_id') || '';
    let versionName = get_search_params('versionName') || '';
    let pageId = get_search_params('pageId') || '';
    if (is_weixin()) {
        environment = 'wx';
    } else if (user_id && versionName && pageId && (window.webkit || window.bridge)) {
        environment = 'app'
    } else {
        environment = 'other';
    }
    return environment;
}

// 混沌h5 链接 拼接参数
export const fill_url_params = (url) => {
    let search = window.location.search || '?'
    if (/^(https|http)\:\/\/(ttools|tools)\.hundun\.cn.*/.test(url)) {
        let match_query = url.match(/\?.*/g)
        if (match_query) {
            return url + '&' + search.slice(1)
        } else {
            return url + search
        }
    } else {
        return url
    }
}

export const openUrl = (url) => {
    if (!/\:\/\//.test(url)) {
        return false
    }
    url = fill_url_params(url)
    let env = getEnv();
    let magicUrl = process.env.MAGICWINDOW;
    if (env === 'app') {
        return window.location.href = url
    } else {
        if (env === 'wx') {
            let match_url = url.match(/(https|http).+/g)
            if (match_url) {
                url = decodeURIComponent(match_url[0])
                return window.location.href = url
            } else {
                if (is_xcx) {
                    // 小程序中跳转到引导下载页
                    return wx.miniProgram.navigateTo({
                        url: "/pages/downloadApp/index"
                    });
                }
                return window.location.href = magicUrl
            }
        } else {
            setTimeout(() => {
                return window.location.href = magicUrl
            }, 1000)
            return window.location.href = url
        }
    }
};

