/**
 * 角色管理模块的JavaScript逻辑
 */

// 角色数据管理类
export class RoleManager {
    constructor() {
        this.init();
    }

    /**
     * 初始化
     */
    init() {
        this.initElements();
        this.bindEvents();
        this.loadRoleList();
    }

    /**
     * 初始化元素
     */
    initElements() {
        this.tableBody = document.getElementById('roleTableBody');
        // ... 其他元素初始化
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 表格操作事件委托
        this.tableBody.addEventListener('click', (e) => {
            const target = e.target;
            const roleId = target.dataset.id;

            if (target.classList.contains('btn-edit')) {
                this.handleEdit(roleId);
            } else if (target.classList.contains('btn-delete')) {
                this.handleDelete(roleId);
            } else if (target.classList.contains('btn-more')) {
                this.toggleDropdownMenu(target);
            }
        });

        // 点击其他地方关闭下拉菜单
        document.addEventListener('click', (e) => {
            if (!e.target.classList.contains('btn-more')) {
                this.closeAllDropdownMenus();
            }
        });
    }

    /**
     * 加载角色列表
     */
    loadRoleList() {
        // 模拟数据，实际项目中应该从后端获取
        const roles = [
            {
                id: 100,
                name: '业务管理员',
                auth: '业务管理员',
                order: 0,
                status: true,
                createTime: '2024-12-21 10:23:29'
            },
            {
                id: 1,
                name: '超级管理员',
                auth: 'admin',
                order: 1,
                status: true,
                createTime: '2024-12-20 18:21:35'
            },
            {
                id: 2,
                name: '普通角色',
                auth: 'common',
                order: 2,
                status: true,
                createTime: '2024-12-20 18:21:36'
            }
        ];

        this.renderTable(roles);
    }

    /**
     * 渲染表格
     */
    renderTable(roles) {
        this.tableBody.innerHTML = roles.map(role => `
            <tr>
                <td>${role.id}</td>
                <td>${role.name}</td>
                <td>${role.auth}</td>
                <td>${role.order}</td>
                <td>
                    <label class="status-switch">
                        <input type="checkbox" ${role.status ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </td>
                <td>${role.createTime}</td>
                <td class="operation-cell">
                    <button class="btn-edit" data-id="${role.id}">修改</button>
                    <button class="btn-delete" data-id="${role.id}">删除</button>
                    <div class="dropdown">
                        <button class="btn-more" data-id="${role.id}">更多</button>
                        <div class="dropdown-menu" id="dropdown-${role.id}">
                            <button class="menu-item" data-action="permission" data-id="${role.id}">数据权限</button>
                            <button class="menu-item" data-action="users" data-id="${role.id}">分配用户</button>
                        </div>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    /**
     * 处理编辑
     */
    handleEdit(roleId) {
        console.log('编辑角色:', roleId);
        // TODO: 实现编辑功能
    }

    /**
     * 处理删除
     */
    handleDelete(roleId) {
        if (confirm('确认要删除该角色吗？')) {
            console.log('删除角色:', roleId);
            // TODO: 实现删除功能
        }
    }

    /**
     * 切换下拉菜单
     */
    toggleDropdownMenu(target) {
        const roleId = target.dataset.id;
        const menu = document.getElementById(`dropdown-${roleId}`);
        
        // 先关闭所有其他的下拉菜单
        this.closeAllDropdownMenus();
        
        // 切换当前下拉菜单
        if (menu) {
            menu.classList.toggle('show');
        }
    }

    /**
     * 关闭所有下拉菜单
     */
    closeAllDropdownMenus() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    }
} 