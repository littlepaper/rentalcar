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
    const captchaImage = document.querySelector('img[alt="验证码"]');
    
    // 创建刷新按钮
    const refreshButton = document.createElement('img');
    refreshButton.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMy4yIDEyYzAtMS44LS44LTMuNC0yLjItNC42QzE5LjIgNS44IDE2LjggNSAxNC4zIDVjLTMuMiAwLTYuMSAxLjktNy4zIDQuOEw2IDExIj48L3BhdGg+PHBhdGggZD0iTTIgMTQuM2MwIDEuOC44IDMuNCAyLjIgNC42IDEuOCAxLjYgNC4yIDIuNCA2LjcgMi40IDMuMiAwIDYuMS0xLjkgNy4zLTQuOGwxLTEuMiI+PC9wYXRoPjxwYXRoIGQ9Ik0yIDEyaDRsLTQtNHY0eiI+PC9wYXRoPjxwYXRoIGQ9Ik0yMiAxMmgtNGw0IDR2LTR6Ij48L3BhdGg+PC9zdmc+';
    refreshButton.alt = '刷新验证码';
    refreshButton.style.cssText = 'cursor:pointer;width:20px;height:20px;margin-left:5px;vertical-align:middle;';
    refreshButton.title = '点击刷新验证码';
    
    // 将刷新按钮插入到验证码图片后面
    if (captchaImage && captchaImage.parentNode) {
        captchaImage.parentNode.insertBefore(refreshButton, captchaImage.nextSibling);
    }
    
    // 错误信息元素
    const usernameError = document.getElementById('username-error');
    const passwordError = document.getElementById('password-error');
    const captchaError = document.getElementById('captcha-error');
    
    // 添加输入事件监听，实时验证
    usernameInput.addEventListener('input', () => validateUsername(usernameInput, usernameError));
    passwordInput.addEventListener('input', () => validatePassword(passwordInput, passwordError));
    captchaInput.addEventListener('input', () => validateCaptcha(captchaInput, captchaError));
    
    // 初始化验证码
    let captchaData = generateCaptcha();
    updateCaptchaImage(captchaData.imageUrl, captchaImage);
    
    // 刷新按钮点击事件
    refreshButton.addEventListener('click', () => {
        captchaData = generateCaptcha();
        updateCaptchaImage(captchaData.imageUrl, captchaImage);
        captchaInput.value = '';
        validateCaptcha(captchaInput, captchaError);
        
        // 添加旋转动画效果
        refreshButton.style.transform = 'rotate(360deg)';
        refreshButton.style.transition = 'transform 0.5s';
        setTimeout(() => {
            refreshButton.style.transform = '';
            refreshButton.style.transition = '';
        }, 500);
    });
    
    // 验证码图片点击刷新
    captchaImage.addEventListener('click', () => {
        refreshButton.click(); // 触发刷新按钮的点击事件
    });
    
    // 登录按钮点击事件
    loginButton.addEventListener('click', () => {
        // 验证表单
        const isUsernameValid = validateUsername(usernameInput, usernameError);
        const isPasswordValid = validatePassword(passwordInput, passwordError);
        const isCaptchaValid = validateCaptcha(captchaInput, captchaError, captchaData.answer);
        
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
 * 生成计算式验证码
 * 生成简单的数学计算题作为验证码并转换为图片URL
 * @returns {Object} 包含验证码图片URL和正确答案的对象
 */
function generateCaptcha() {
    // 创建临时canvas
    const canvas = document.createElement('canvas');
    canvas.width = 120;  // 设置合适的宽度
    canvas.height = 40;  // 设置合适的高度
    const ctx = canvas.getContext('2d');
    
    // 生成两个随机数和运算符
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-', '×'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    // 计算正确答案
    let answer;
    switch(operator) {
        case '+':
            answer = num1 + num2;
            break;
        case '-':
            answer = num1 - num2;
            break;
        case '×':
            answer = num1 * num2;
            break;
    }
    
    // 构造计算式
    const captchaText = `${num1}${operator}${num2}=?`;
    
    // 设置背景
    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制干扰线
    for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = `rgba(${Math.random() * 100 + 150}, ${Math.random() * 100 + 150}, ${Math.random() * 100 + 150}, 0.2)`;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
    }
    
    // 绘制验证码文字
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#333';
    
    // 为每个字符添加随机偏移和旋转
    const chars = captchaText.split('');
    const charWidth = canvas.width / (chars.length + 2);
    
    chars.forEach((char, i) => {
        const x = charWidth * (i + 1.5);
        const y = canvas.height / 2 + (Math.random() * 6 - 3);
        const angle = Math.random() * 0.2 - 0.1;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 40%)`;
        ctx.fillText(char, 0, 0);
        ctx.restore();
    });
    
    // 转换canvas为图片URL
    const imageUrl = canvas.toDataURL('image/png');
    
    return {
        imageUrl: imageUrl,
        answer: answer.toString()
    };
}

/**
 * 更新验证码图片
 * @param {string} imageUrl - 验证码图片的URL
 * @param {HTMLImageElement} imageElement - 验证码图片元素
 */
function updateCaptchaImage(imageUrl, imageElement) {
    if (imageElement) {
        imageElement.src = imageUrl;
        imageElement.style.cursor = 'pointer';
        imageElement.title = '点击刷新验证码';
    }
}

/**
 * 验证验证码
 * @param {HTMLInputElement} input - 验证码输入框元素
 * @param {HTMLElement} errorElement - 错误信息显示元素
 * @param {string} correctAnswer - 正确的验证码答案
 * @returns {boolean} 验证是否通过
 */
function validateCaptcha(input, errorElement, correctAnswer) {
    // 如果错误提示元素不存在，创建一个新的
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = 'captcha-error';
        errorElement.className = 'error-message';
        input.parentNode.appendChild(errorElement);
    }

    const value = input.value.trim();
    
    if (value === '') {
        errorElement.textContent = '请输入计算结果';
        input.classList.add('error');
        return false;
    } else if (!correctAnswer) {
        // 如果没有正确答案，说明验证码未初始化
        errorElement.textContent = '验证码未加载，请刷新';
        input.classList.add('error');
        return false;
    } else if (value !== correctAnswer) {
        errorElement.textContent = '计算结果不正确';
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