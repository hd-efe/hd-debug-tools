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

Or, install vim npm:
```shell
npm install hd-debug-tools
```

import to your project:

```vue
<script>
import { HDDT } from 'hd-debug-tools

created() {
    new HDDT({
        // ...config
    })
}
</script>
```

## Configure

|key|含义|类型|默认值|
|----|:--:|--|--|
|default_load_script|是否在页面最开始加载script|Boolean|true|
|enable_body_entry|是否开启默认body的entry|Boolean|true|
|enable_url_entry|是否开启url entry|Boolean|true|
|url_entry_key|url入口 key|String|vconsole|
|url_entry_value|url入口 value|String|show|
|entry|自定义entry|String|null|
