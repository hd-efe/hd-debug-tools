export const query = (prop) => {
    let GETURL = {};
    if (location.search.length) {
        let args = decodeURIComponent(location.search).slice(1).split('&');
        for (let i = 0; i < args.length; i++) {
            let arg = args[i].split('=');
            GETURL[arg[0]] = arg[1];
        }
    }
    return GETURL[prop] || '';
}
