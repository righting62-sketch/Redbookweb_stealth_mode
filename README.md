# 小红书隐形模式

一款 Chrome 浏览器扩展，用于让小红书网页版看起来更加低调、隐蔽。

## 功能

- **Logo 透明化**：顶部导航栏的小红书 Logo 自动隐藏
- **Favicon 替换**：浏览器标签页图标替换为透明图标
- **关注按钮去色**：红色"关注"按钮改为透明/无框线样式
- **头像隐藏**：页面中所有用户头像自动隐藏
- **红色元素淡化**：通知红点、点赞图标、Tab 选中态等品牌红色元素全部弱化
- **打开即生效**：无需手动操作，访问小红书页面自动应用

## 适用场景

在公共场合、办公环境或需要保持低调的场景下浏览小红书时，降低页面辨识度，避免被他人一眼认出。

## 安装方法

### 方式一：本地加载（推荐）

1. 打开 Chrome 浏览器，访问 `chrome://extensions/`
2. 开启右上角"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择本项目目录
5. 访问 `www.xiaohongshu.com`，效果自动生效

### 方式二：从 GitHub 下载

```bash
git clone https://github.com/righting62-sketch/Redbookweb_stealth_mode.git
```

然后按照"方式一"的步骤加载扩展。

## 文件说明

```
Redbookweb_stealth_mode/
├── manifest.json      # 扩展配置文件
├── styles.css         # 页面样式覆盖
├── content.js         # 动态元素处理脚本
├── icons/             # 扩展图标
│   ├── 16.png
│   ├── 48.png
│   └── 128.png
└── README.md          # 本文件
```

| 文件 | 说明 |
|------|------|
| `manifest.json` | 定义扩展权限、注入时机、目标域名 |
| `styles.css` | 覆盖小红书品牌色、Logo、按钮、头像等样式 |
| `content.js` | 处理 Favicon 替换、关注按钮去框、头像隐藏等动态内容 |

## 使用提示

- 修改扩展文件后，需要在 `chrome://extensions/` 中点击扩展卡片的刷新按钮才能生效
- 小红书前端页面结构可能更新，如遇部分元素未生效，可检查对应元素的 class 名称并调整 `styles.css` 或 `content.js`
- 本扩展仅修改页面视觉样式，不影响小红书账号功能、浏览和交互

## 注意事项

- 本项目仅供学习和个人使用
- 不保证小红书后续页面改版后所有功能持续有效
- 请勿用于违反小红书用户协议或相关法律法规的场景

## 技术栈

- Chrome Extension Manifest V3
- CSS3（`!important` 覆盖、伪元素、属性选择器）
- JavaScript（DOM 操作、MutationObserver）

## 开源协议

MIT License