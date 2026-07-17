// ============================================
// 小红书网页 - 内容脚本
// 负责：替换Favicon透明图标 + 监听动态DOM变化
// ============================================

// 1x1 透明 PNG 的 base64 编码
const TRANSPARENT_FAVICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+YSHy2wAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAZSURBVHjaYmBgYKhiYGBgYGBgYGBgYGBgYCAFAB4AAOH5Ah+AAAAAElFTkSuQmCC';

/**
 * 替换页面中所有 favicon 链接透明图标
 */
function replaceFavicons() {
  const selectors = [
    'link[rel="icon"]',
    'link[rel="shortcut icon"]',
    'link[rel="shortcut"]',
    'link[rel="apple-touch-icon"]',
    'link[rel="apple-touch-icon-precomposed"]'
  ];

  selectors.forEach(function(selector) {
    const links = document.querySelectorAll(selector);
    links.forEach(function(link) {
      if (link.href !== TRANSPARENT_FAVICON) {
        link.href = TRANSPARENT_FAVICON;
        link.type = 'image/png';
      }
    });
  });
}

/**
 * 监听 <head> 中的变化，防止小红书动态替换回原 favicon
 */
function observeFaviconChanges() {
  const observer = new MutationObserver(function(mutations) {
    let shouldReplace = false;

    mutations.forEach(function(mutation) {
      // 检查新增节点
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeName === 'LINK' &&
              (node.rel === 'icon' || node.rel === 'shortcut icon' ||
               node.rel === 'shortcut' || node.rel === 'apple-touch-icon' ||
               node.rel === 'apple-touch-icon-precomposed')) {
            shouldReplace = true;
          }
        });
      }
      // 检查属性变化
      if (mutation.type === 'attributes' &&
          mutation.target.nodeName === 'LINK' &&
          mutation.attributeName === 'href') {
        shouldReplace = true;
      }
    });

    if (shouldReplace) {
      replaceFavicons();
    }
  });

  // 监听 <head> 的子节点变化
  if (document.head) {
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['href']
    });
  }

  return observer;
}

// ============================================
// 初始化
// ============================================

// 在 document_start 时立即尝试替换 favicon
if (document.head) {
  replaceFavicons();
}

// DOM 准备好后再次替换 + 开始监听
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    replaceFavicons();
    observeFaviconChanges();
  });
} else {
  replaceFavicons();
  observeFaviconChanges();
}

// 页面完全加载后再次确认
window.addEventListener('load', function() {
  replaceFavicons();
});