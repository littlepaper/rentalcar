/**
 * 菜单组件的JavaScript模块
 * @module MenuComponent
 * @description 提供菜单的初始化、折叠、展开等功能
 */

/**
 * 初始化菜单组件
 * @function initializeMenu
 * @description 初始化菜单的所有功能，包括折叠、子菜单和活动状态
 * @returns {void}
 */
export function initializeMenu() {
    setupMenuToggle();
    setupSubmenuToggle();
    setupActiveMenuItem();
    console.log('菜单初始化完成');
}

/**
 * 设置菜单折叠功能
 * @private
 * @description 处理菜单的折叠/展开状态，并保存状态到localStorage
 * @returns {void}
 */
function setupMenuToggle() {
    const toggleBtn = document.querySelector('.toggle-btn');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            if (mainContent) {
                // 添加过渡效果
                mainContent.style.transition = 'margin-left 0.3s ease';
                mainContent.style.marginLeft = sidebar.classList.contains('collapsed') ? '70px' : '260px';
            }
            // 保存菜单状态到 localStorage
            localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
        });

        // 恢复上次的菜单状态
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (isCollapsed) {
            sidebar.classList.add('collapsed');
            if (mainContent) {
                mainContent.style.marginLeft = '70px';
            }
        }
    }
}

/**
 * 设置子菜单切换功能
 * @private
 * @description 处理子菜单的展开/收起，包括动画效果和图标旋转
 * @returns {void}
 */
function setupSubmenuToggle() {
    // 使用事件委托处理子菜单点击
    document.addEventListener('click', (e) => {
        const hasSubmenuLink = e.target.closest('.has-submenu');
        if (hasSubmenuLink) {
            e.preventDefault();
            e.stopPropagation(); // 阻止事件冒泡

            // 获取当前点击的菜单项和对应的子菜单
            const currentSubmenu = hasSubmenuLink.nextElementSibling;
            const submenuIcon = hasSubmenuLink.querySelector('.submenu-icon');
            const isOpen = currentSubmenu ? currentSubmenu.classList.contains('open') : false;

            // 关闭其他打开的子菜单，添加过渡动画
            const allSubmenus = document.querySelectorAll('.submenu');
            allSubmenus.forEach(submenu => {
                if (submenu !== currentSubmenu) {
                    const parentLink = submenu.previousElementSibling;
                    const parentIcon = parentLink ? parentLink.querySelector('.submenu-icon') : null;
                    if (parentIcon) {
                        parentIcon.style.transform = 'rotate(0deg)';
                    }
                    submenu.style.maxHeight = '0';
                    submenu.classList.remove('open');
                }
            });

            // 切换当前子菜单的状态，添加过渡动画
            if (submenuIcon) {
                submenuIcon.style.transform = !isOpen ? 'rotate(90deg)' : 'rotate(0deg)';
            }
            if (currentSubmenu) {
                currentSubmenu.style.maxHeight = !isOpen ? `${currentSubmenu.scrollHeight}px` : '0';
                currentSubmenu.classList.toggle('open', !isOpen);
            }
        }
    });

    // 处理折叠状态下的子菜单
    const submenuTriggers = document.querySelectorAll('.has-submenu');
    submenuTriggers.forEach(trigger => {
        const submenu = trigger.nextElementSibling;
        const submenuIcon = trigger.querySelector('.submenu-icon');
        
        if (submenu) {
            // 设置子菜单的初始状态
            submenu.style.transition = 'all 0.3s ease';
            submenu.style.maxHeight = '0';
            
            // 鼠标进入时显示子菜单
            trigger.addEventListener('mouseenter', () => {
                if (document.querySelector('.sidebar').classList.contains('collapsed')) {
                    submenu.style.top = trigger.offsetTop + 'px';
                    submenu.style.maxHeight = `${submenu.scrollHeight}px`;
                    submenu.classList.add('open');
                    if (submenuIcon) {
                        submenuIcon.style.transform = 'rotate(90deg)';
                    }
                }
            });

            // 鼠标离开时隐藏子菜单
            trigger.addEventListener('mouseleave', (e) => {
                if (document.querySelector('.sidebar').classList.contains('collapsed')) {
                    // 检查鼠标是否移动到子菜单上
                    if (!e.relatedTarget || !submenu.contains(e.relatedTarget)) {
                        submenu.style.maxHeight = '0';
                        submenu.classList.remove('open');
                        if (submenuIcon) {
                            submenuIcon.style.transform = 'rotate(0deg)';
                        }
                    }
                }
            });

            // 子菜单也需要处理鼠标离开事件
            submenu.addEventListener('mouseleave', () => {
                if (document.querySelector('.sidebar').classList.contains('collapsed')) {
                    submenu.style.maxHeight = '0';
                    submenu.classList.remove('open');
                    if (submenuIcon) {
                        submenuIcon.style.transform = 'rotate(0deg)';
                    }
                }
            });
        }
    });
}

/**
 * 设置当前活动菜单项
 * @private
 */
function setupActiveMenuItem() {
    const navItems = document.querySelectorAll('.nav-item');
    const currentPath = window.location.pathname;
    
    // 首页菜单点击事件
    const homeLink = document.querySelector('.nav-item[href="#"]');
    if (homeLink) {
        homeLink.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const response = await fetch('components/home.html');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const html = await response.text();
                document.querySelector('.main-content').innerHTML = html;
                
                // 动态加载home.js并初始化日期时间
                const homeScript = document.createElement('script');
                homeScript.type = 'module';
                homeScript.src = 'js/components/home.js';
                homeScript.onload = () => {
                    // 确保脚本加载后初始化日期时间
                    setTimeout(() => {
                        if (typeof window.initDateTime === 'function') {
                            window.initDateTime();
                        }
                    }, 100);
                };
                document.body.appendChild(homeScript);
            } catch (error) {
                console.error('加载首页失败:', error);
                document.querySelector('.main-content').innerHTML = '<p>加载首页失败，请稍后再试</p>';
            }
        });
    }
    
    // 部门管理菜单点击事件
    const departmentLink = Array.from(document.querySelectorAll('.nav-item:not(.has-submenu) .nav-text')).find(el => el.textContent.includes('部门管理'))?.closest('.nav-item');
    if (departmentLink) {
        departmentLink.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                // 加载部门管理组件
                const response = await fetch('components/department.html');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const html = await response.text();
                document.querySelector('.main-content').innerHTML = html;
                
                // 动态加载department.js并初始化部门管理功能
                const departmentScript = document.createElement('script');
                departmentScript.type = 'module';
                departmentScript.src = 'js/components/department.js';
                document.body.appendChild(departmentScript);

                // 动态加载department.css
                if (!document.querySelector('link[href="css/components/department.css"]')) {
                    const departmentStyle = document.createElement('link');
                    departmentStyle.rel = 'stylesheet';
                    departmentStyle.href = 'css/components/department.css';
                    document.head.appendChild(departmentStyle);
                }

                // 初始化部门管理模块
                departmentScript.onload = () => {
                    import('./department.js').then(module => {
                        const departmentManager = new module.DepartmentManager();
                        departmentManager.init();
                    }).catch(error => {
                        console.error('加载部门管理模块失败:', error);
                    });
                };
            } catch (error) {
                console.error('加载部门管理页面失败:', error);
                document.querySelector('.main-content').innerHTML = '<p>加载部门管理页面失败，请稍后再试</p>';
            }
        });
    }
    
    // 登录菜单点击事件
    const loginLink = Array.from(document.querySelectorAll('.nav-item:not(.has-submenu) .nav-text')).find(el => el.textContent.includes('登录'))?.closest('.nav-item');
    if (loginLink) {
        loginLink.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                // 加载登录组件
                const response = await fetch('components/login.html');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const html = await response.text();
                document.querySelector('.main-content').innerHTML = html;
                
                // 动态加载login.js并初始化登录功能
                const loginScript = document.createElement('script');
                loginScript.type = 'module';
                loginScript.src = 'js/components/login.js';
                loginScript.onload = () => {
                    // 确保脚本加载后初始化登录功能
                    setTimeout(() => {
                        if (typeof window.initializeLogin === 'function') {
                            window.initializeLogin();
                        } else {
                            // 如果全局函数不可用，尝试导入模块并调用
                            import('/js/components/login.js')
                                .then(module => {
                                    if (typeof module.initializeLogin === 'function') {
                                        module.initializeLogin();
                                    }
                                })
                                .catch(err => console.error('加载登录模块失败:', err));
                        }
                    }, 100);
                };
                document.body.appendChild(loginScript);
            } catch (error) {
                console.error('加载登录页面失败:', error);
                document.querySelector('.main-content').innerHTML = '<p>加载登录页面失败，请稍后再试</p>';
            }
        });
    }

    navItems.forEach(item => {
        // 移除所有活动状态
        item.classList.remove('active');
        
        // 设置当前页面对应的菜单项为活动状态
        const href = item.getAttribute('href');
        if (href && (href === currentPath || (currentPath === '/' && href === 'index.html'))) {
            item.classList.add('active');
            
            // 如果是子菜单项，展开其父菜单
            const parentSubmenu = item.closest('.submenu');
            if (parentSubmenu) {
                parentSubmenu.classList.add('open');
                const parentTrigger = parentSubmenu.previousElementSibling;
                if (parentTrigger) {
                    parentTrigger.classList.add('open');
                }
            }
        }

        // 添加点击效果
        if (!item.classList.contains('has-submenu')) {
            item.addEventListener('click', () => {
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        }
    });
}