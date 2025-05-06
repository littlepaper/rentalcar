/**
 * 主程序入口文件
 * 负责初始化应用程序的核心功能
 */

import { initializeMenu } from './components/menu.js';
import { DepartmentManager } from './components/department.js';

/**
 * 初始化应用程序
 * 加载菜单组件并进行初始化
 */
async function initializeApp() {
    try {
        const response = await fetch('../components/menu.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        document.getElementById('sidebar-container').innerHTML = data;
        // 初始化菜单功能
        initializeMenu();
        initializeMenuToggle();
        
        // 初始化部门管理模块
        const departmentManager = new DepartmentManager();
        departmentManager.init();
    } catch (error) {
        console.error('加载菜单失败:', error);
    }
}

/**
 * 初始化菜单折叠功能
 * @description 为折叠按钮添加点击事件，切换菜单的折叠状态
 */
function initializeMenuToggle() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.toggle-btn')) {
            document.querySelector('.sidebar').classList.toggle('collapsed');
        }
    });
}

/**
 * 工具函数：防抖
 * @param {Function} func 需要防抖的函数
 * @param {number} wait 等待时间（毫秒）
 * @returns {Function} 返回防抖后的函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 当 DOM 加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initializeApp); 