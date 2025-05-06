/**
 * 首页组件JavaScript文件
 * @description 处理首页日期时间显示逻辑
 * @version 1.0.0
 */

'use strict';

/**
 * 更新时间显示
 * @description 每秒更新一次当前时间
 * @returns {boolean} 更新是否成功
 */
function updateDateTime() {
    const timeElement = document.getElementById('current-time');
    if (!timeElement) {
        console.warn('时间显示元素不存在，停止更新时间');
        return false;
    }
    const now = new Date();
    timeElement.textContent = now.toLocaleTimeString('zh-CN');
    return true;
}

let updateInterval = null;

/**
 * 初始化时间显示
 * @description 初始化并开始时间更新
 */
function initDateTime() {
    // 清除可能存在的旧定时器
    if (updateInterval) {
        clearInterval(updateInterval);
    }
    
    // 确保元素存在并可以更新
    if (updateDateTime()) {
        updateInterval = setInterval(updateDateTime, 1000);
    } else {
        // 如果元素不存在，等待一段时间后重试
        setTimeout(() => {
            if (updateDateTime()) {
                updateInterval = setInterval(updateDateTime, 1000);
            }
        }, 500);
    }
}

// 将初始化函数挂载到window对象，使其可以全局访问
window.initDateTime = initDateTime;

// 等待DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', initDateTime);

// 为了确保在组件动态加载时也能正确初始化
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initDateTime, 100);
}

export { updateDateTime, initDateTime };