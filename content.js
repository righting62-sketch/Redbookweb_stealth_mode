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

// ============================================
// 兜底：直接用 JS 去除关注按钮的边框/背景
// CSS 选择器可能因动态类名失效，这里通过文本内容兜底
// ============================================

const FOLLOW_BUTTON_STYLE = {
  backgroundColor: 'transparent',
  background: 'transparent',
  border: 'none',
  borderRadius: '0',
  outline: 'none',
  boxShadow: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  appearance: 'none'
};

function styleFollowButtons() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(function(button) {
    const text = (button.textContent || '').trim();
    // 匹配"关注"按钮（可能包含 + 图标，所以只检查是否包含"关注"）
    if (text.indexOf('关注') !== -1) {
      Object.assign(button.style, FOLLOW_BUTTON_STYLE);
      // 同时处理子元素
      const children = button.querySelectorAll('*');
      children.forEach(function(child) {
        child.style.borderColor = 'transparent';
        child.style.boxShadow = 'none';
      });
    }
  });
}

function observeFollowButtons() {
  const observer = new MutationObserver(function() {
    styleFollowButtons();
  });

  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    styleFollowButtons();
    observeFollowButtons();
    hideAvatars();
    observeAvatars();
  });
} else {
  styleFollowButtons();
  observeFollowButtons();
  hideAvatars();
  observeAvatars();
}

// ============================================
// 隐藏所有用户头像
// ============================================

function isAvatarElement(element) {
  if (element.tagName !== 'IMG') return false;

  const src = (element.src || '').toLowerCase();
  const className = (element.className || '').toLowerCase();
  const id = (element.id || '').toLowerCase();

  return (
    className.indexOf('avatar') !== -1 ||
    id.indexOf('user-hover-guide') !== -1 ||
    src.indexOf('avatar') !== -1 ||
    src.indexOf('sns-avatar') !== -1
  );
}

function hideElement(element) {
  element.style.display = 'none';
  element.style.visibility = 'hidden';
  element.style.opacity = '0';
}

function hideAvatars() {
  // 通过选择器查找
  const selectors = [
    '.avatar-item',
    'img.avatar-item',
    '[class*="avatar"] img',
    '[id*="user-hover-guide"] img',
    'img[src*="avatar"]',
    'img[src*="sns-avatar"]'
  ];

  selectors.forEach(function(selector) {
    try {
      document.querySelectorAll(selector).forEach(hideElement);
    } catch (e) {
      // 忽略非法选择器
    }
  });

  // 兜底：遍历所有 img 标签
  document.querySelectorAll('img').forEach(function(img) {
    if (isAvatarElement(img)) {
      hideElement(img);
      // 同时隐藏父级 avatar 容器
      let parent = img.parentElement;
      for (let i = 0; i < 3 && parent; i++) {
        const parentClass = (parent.className || '').toLowerCase();
        const parentId = (parent.id || '').toLowerCase();
        if (
          parentClass.indexOf('avatar') !== -1 ||
          parentId.indexOf('user-hover-guide') !== -1
        ) {
          hideElement(parent);
          break;
        }
        parent = parent.parentElement;
      }
    }
  });
}

function observeAvatars() {
  const observer = new MutationObserver(function(mutations) {
    let shouldHide = false;

    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'IMG' && isAvatarElement(node)) {
              hideElement(node);
              shouldHide = true;
            } else if (node.querySelectorAll) {
              node.querySelectorAll('img').forEach(function(img) {
                if (isAvatarElement(img)) {
                  hideElement(img);
                  shouldHide = true;
                }
              });
            }
          }
        });
      }
      if (
        mutation.type === 'attributes' &&
        mutation.target.tagName === 'IMG' &&
        (mutation.attributeName === 'src' || mutation.attributeName === 'class')
      ) {
        if (isAvatarElement(mutation.target)) {
          hideElement(mutation.target);
          shouldHide = true;
        }
      }
    });

    if (shouldHide) {
      hideAvatars();
    }
  });

  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'class']
    });
  }
}