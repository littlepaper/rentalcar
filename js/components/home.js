/**
 * 首页组件JavaScript文件
 * @description 处理首页日期时间显示逻辑
 * @version 1.0.0
 */

'use strict';

let updateInterval = null;
let retryCount = 0;
const MAX_RETRIES = 5;

/**
 * 更新时间显示
 * @description 每秒更新一次当前时间
 * @returns {boolean} 更新是否成功
 */
function updateDateTime() {
    const timeElement = document.getElementById('current-time');
    if (!timeElement) {
        if (retryCount < MAX_RETRIES) {
            retryCount++;
            return false;
        } else {
            console.warn('时间显示元素不存在，停止更新时间');
            if (updateInterval) {
                clearInterval(updateInterval);
                updateInterval = null;
            }
            return false;
        }
    }
    retryCount = 0; // 重置重试计数
    const now = new Date();
    timeElement.textContent = now.toLocaleTimeString('zh-CN');
    return true;
}

/**
 * 初始化时间显示
 * @description 初始化并开始时间更新
 */
function initDateTime() {
    // 清除可能存在的旧定时器
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
    
    // 重置重试计数
    retryCount = 0;
    
    const tryUpdate = () => {
        if (updateDateTime()) {
            if (!updateInterval) {
                updateInterval = setInterval(updateDateTime, 1000);
            }
        } else if (retryCount < MAX_RETRIES) {
            // 如果元素不存在且未超过最大重试次数，继续重试
            setTimeout(tryUpdate, 500);
        }
    };
    
    tryUpdate();
}

// 将初始化函数挂载到window对象，使其可以全局访问
window.initDateTime = initDateTime;

// 确保在不同的页面加载状态下都能正确初始化
const initOnLoad = () => {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(initDateTime, 100);
    } else {
        document.addEventListener('DOMContentLoaded', initDateTime);
    }
};

initOnLoad();

export { updateDateTime, initDateTime };