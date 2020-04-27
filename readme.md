## hd-debug-tools

> 混沌大学h5 debugger工具。

## Features
- view console logs
- view network requests
- view document elements
- view cookies/LocalStorage/SessionStorage
- Execute JS command manually
- Custom plugin

## Usage

Download the latest release.(`dist/debugger.min.js`)

Or, install vim npm:
```shell
npm install hd-debug-tools
```

import to your project:

```html
<script src="../dist/debugger.min.js"></script>
<script>
new Debugger.default()
</script>
```