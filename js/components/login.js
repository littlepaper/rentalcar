/**
 * 登录页面功能模块
 * 处理登录表单验证和提交逻辑
 */

'use strict';

/**
 * 初始化登录页面
 * 设置表单验证和提交事件监听
 */
export function initializeLogin() {
    // 获取表单元素
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const captchaInput = document.getElementById('captcha');
    const loginButton = document.getElementById('login-btn');
    const rememberCheckbox = document.getElementById('remember');
    const refreshCaptchaButton = document.getElementById('refresh-captcha');
    
    // 错误信息元素
    const usernameError = document.getElementById('username-error');
    const passwordError = document.getElementById('password-error');
    const captchaError = document.getElementById('captcha-error');
    
    // 添加输入事件监听，实时验证
    usernameInput.addEventListener('input', () => validateUsername(usernameInput, usernameError));
    passwordInput.addEventListener('input', () => validatePassword(passwordInput, passwordError));
    captchaInput.addEventListener('input', () => validateCaptcha(captchaInput, captchaError));
    
    // 初始化验证码
    let captchaText = generateCaptcha();
    
    // 刷新验证码按钮点击事件
    refreshCaptchaButton.addEventListener('click', () => {
        captchaText = generateCaptcha();
        captchaInput.value = '';
        validateCaptcha(captchaInput, captchaError);
    });
    
    // 登录按钮点击事件
    loginButton.addEventListener('click', () => {
        // 验证表单
        const isUsernameValid = validateUsername(usernameInput, usernameError);
        const isPasswordValid = validatePassword(passwordInput, passwordError);
        const isCaptchaValid = validateCaptcha(captchaInput, captchaError, captchaText);
        
        // 如果验证通过，提交表单
        if (isUsernameValid && isPasswordValid && isCaptchaValid) {
            handleLogin({
                username: usernameInput.value,
                password: passwordInput.value,
                remember: rememberCheckbox.checked
            });
        }
    });
    
    // 回车键提交表单
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loginButton.click();
        }
    });
    
    captchaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loginButton.click();
        }
    });
    
    // 检查本地存储中是否有保存的用户名
    checkSavedCredentials();
}

/**
 * 验证用户名
 * @param {HTMLInputElement} input - 用户名输入框元素
 * @param {HTMLElement} errorElement - 错误信息显示元素
 * @returns {boolean} 验证是否通过
 */
function validateUsername(input, errorElement) {
    const value = input.value.trim();
    
    if (value === '') {
        errorElement.textContent = '用户名不能为空';
        input.classList.add('error');
        return false;
    } else if (value.length < 3) {
        errorElement.textContent = '用户名长度不能少于3个字符';
        input.classList.add('error');
        return false;
    } else {
        errorElement.textContent = '';
        input.classList.remove('error');
        return true;
    }
}

/**
 * 验证密码
 * @param {HTMLInputElement} input - 密码输入框元素
 * @param {HTMLElement} errorElement - 错误信息显示元素
 * @returns {boolean} 验证是否通过
 */
function validatePassword(input, errorElement) {
    const value = input.value;
    
    if (value === '') {
        errorElement.textContent = '密码不能为空';
        input.classList.add('error');
        return false;
    } else if (value.length < 6) {
        errorElement.textContent = '密码长度不能少于6个字符';
        input.classList.add('error');
        return false;
    } else {
        errorElement.textContent = '';
        input.classList.remove('error');
        return true;
    }
}

/**
 * 处理登录请求
 * @param {Object} loginData - 登录数据
 * @param {string} loginData.username - 用户名
 * @param {string} loginData.password - 密码
 * @param {boolean} loginData.remember - 是否记住登录状态
 */
function handleLogin(loginData) {
    // 显示加载状态
    const loginButton = document.getElementById('login-btn');
    const originalText = loginButton.textContent;
    loginButton.textContent = '登录中...';
    loginButton.disabled = true;
    
    // 这里应该是实际的登录API调用
    // 模拟API调用延迟
    setTimeout(() => {
        // 模拟登录成功
        console.log('登录数据:', loginData);
        
        // 如果选择了记住我，保存用户名到本地存储
        if (loginData.remember) {
            localStorage.setItem('savedUsername', loginData.username);
        } else {
            localStorage.removeItem('savedUsername');
        }
        
        // 登录成功后重定向到首页
        alert('登录成功！');
        loadHomePage();
        
        // 恢复按钮状态
        loginButton.textContent = originalText;
        loginButton.disabled = false;
    }, 1500);
}

/**
 * 检查本地存储中是否有保存的用户名
 */
function checkSavedCredentials() {
    const savedUsername = localStorage.getItem('savedUsername');
    if (savedUsername) {
        const usernameInput = document.getElementById('username');
        const rememberCheckbox = document.getElementById('remember');
        
        usernameInput.value = savedUsername;
        rememberCheckbox.checked = true;
    }
}

/**
 * 加载首页
 */
function loadHomePage() {
    // 加载首页内容
    fetch('components/home.html')
        .then(response => response.text())
        .then(html => {
            document.querySelector('.main-content').innerHTML = html;
            
            // 动态加载home.js
            const homeScript = document.createElement('script');
            homeScript.type = 'module';
            homeScript.src = 'js/components/home.js';
            homeScript.onload = () => {
                // 确保脚本加载后初始化日期时间
                if (typeof window.initDateTime === 'function') {
                    window.initDateTime();
                }
            };
            document.body.appendChild(homeScript);
        })
        .catch(error => {
            console.error('加载首页失败:', error);
            document.querySelector('.main-content').innerHTML = '<p>加载首页失败，请稍后再试</p>';
        });
}

/**
 * 生成随机验证码
 * 生成4位随机字符的验证码并绘制到canvas上
 * @returns {string} 生成的验证码文本
 */
function generateCaptcha() {
    const canvas = document.getElementById('captcha-canvas');
    const ctx = canvas.getContext('2d');
    const captchaLength = 4;
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let captchaText = '';
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 设置背景
    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 生成随机验证码
    for (let i = 0; i < captchaLength; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        captchaText += chars[randomIndex];
    }
    
    // 绘制验证码
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 绘制干扰线
    for (let i = 0; i < 6; i++) {
        ctx.strokeStyle = getRandomColor(150, 200);
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
    }
    
    // 绘制干扰点
    for (let i = 0; i < 30; i++) {
        ctx.fillStyle = getRandomColor(150, 200);
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // 绘制验证码文字
    for (let i = 0; i < captchaLength; i++) {
        const x = (i + 0.5) * (canvas.width / captchaLength);
        const y = canvas.height / 2 + Math.random() * 8 - 4;
        const angle = Math.random() * 0.4 - 0.2;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = getRandomColor(10, 100);
        ctx.fillText(captchaText[i], 0, 0);
        ctx.restore();
    }
    
    console.log('生成的验证码:', captchaText); // 开发环境调试用，生产环境应移除
    return captchaText;
}

/**
 * 获取随机颜色
 * @param {number} min - 颜色最小值
 * @param {number} max - 颜色最大值
 * @returns {string} 随机颜色
 */
function getRandomColor(min, max) {
    const r = Math.floor(Math.random() * (max - min) + min);
    const g = Math.floor(Math.random() * (max - min) + min);
    const b = Math.floor(Math.random() * (max - min) + min);
    return `rgb(${r},${g},${b})`;
}

/**
 * 验证验证码
 * @param {HTMLInputElement} input - 验证码输入框元素
 * @param {HTMLElement} errorElement - 错误信息显示元素
 * @param {string} correctCaptcha - 正确的验证码
 * @returns {boolean} 验证是否通过
 */
function validateCaptcha(input, errorElement, correctCaptcha) {
    const value = input.value.trim();
    
    if (value === '') {
        errorElement.textContent = '验证码不能为空';
        input.classList.add('error');
        return false;
    } else if (value.length < 4) {
        errorElement.textContent = '验证码长度不正确';
        input.classList.add('error');
        return false;
    } else if (correctCaptcha && value.toLowerCase() !== correctCaptcha.toLowerCase()) {
        errorElement.textContent = '验证码不正确';
        input.classList.add('error');
        return false;
    } else {
        errorElement.textContent = '';
        input.classList.remove('error');
        return true;
    }
}

// 导出初始化函数，供外部调用
export default { initializeLogin };