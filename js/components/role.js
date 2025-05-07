/**
 * 角色管理模块的JavaScript逻辑
 */

// 角色数据管理类
class RoleManager {
    constructor() {
        this.initEventListeners();
        this.loadRoleData();
    }

    /**
     * 初始化事件监听器
     */
    initEventListeners() {
        // 搜索按钮事件
        document.getElementById('searchBtn').addEventListener('click', () => this.handleSearch());
        
        // 重置按钮事件
        document.getElementById('resetBtn').addEventListener('click', () => this.handleReset());
        
        // 新增按钮事件
        document.getElementById('addRole').addEventListener('click', () => this.handleAdd());
        
        // 导出按钮事件
        document.getElementById('exportRole').addEventListener('click', () => this.handleExport());
    }

    /**
     * 加载角色数据
     */
    async loadRoleData() {
        try {
            // 模拟API调用
            const mockData = [
                {
                    id: '100',
                    name: '业务管理员',
                    auth: '业务管理员',
                    order: 0,
                    status: 1,
                    createTime: '2024-12-21 10:23:29'
                },
                {
                    id: '1',
                    name: '超级管理员',
                    auth: 'admin',
                    order: 1,
                    status: 1,
                    createTime: '2024-12-20 18:21:35'
                },
                {
                    id: '2',
                    name: '普通角色',
                    auth: 'common',
                    order: 2,
                    status: 1,
                    createTime: '2024-12-20 18:21:36'
                }
            ];
            
            this.renderTable(mockData);
        } catch (error) {
            console.error('加载角色数据失败:', error);
            this.showMessage('加载角色数据失败', 'error');
        }
    }

    /**
     * 渲染表格数据
     * @param {Array} data - 角色数据数组
     */
    renderTable(data) {
        const tbody = document.getElementById('roleTableBody');
        tbody.innerHTML = data.map(role => `
            <tr>
                <td>${role.id}</td>
                <td>${role.name}</td>
                <td>${role.auth}</td>
                <td>${role.order}</td>
                <td>
                    <span class="status-badge ${role.status ? 'active' : 'inactive'}">
                        ${role.status ? '正常' : '停用'}
                    </span>
                </td>
                <td>${role.createTime}</td>
            </tr>
        `).join('');
    }

    /**
     * 处理搜索事件
     */
    handleSearch() {
        const searchParams = {
            roleName: document.getElementById('roleName').value,
            roleAuth: document.getElementById('roleAuth').value,
            status: document.getElementById('roleStatus').value,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value
        };
        
        console.log('搜索参数:', searchParams);
        // TODO: 实现搜索逻辑
        this.loadRoleData(); // 临时重新加载数据
    }

    /**
     * 处理重置事件
     */
    handleReset() {
        document.getElementById('roleName').value = '';
        document.getElementById('roleAuth').value = '';
        document.getElementById('roleStatus').value = '';
        document.getElementById('startDate').value = '';
        document.getElementById('endDate').value = '';
        
        this.loadRoleData();
    }

    /**
     * 处理新增角色事件
     */
    handleAdd() {
        // TODO: 实现新增角色逻辑
        console.log('新增角色');
    }

    /**
     * 处理导出事件
     */
    handleExport() {
        // TODO: 实现导出逻辑
        console.log('导出角色数据');
    }

    /**
     * 显示消息提示
     * @param {string} message - 消息内容
     * @param {string} type - 消息类型（success/error/warning/info）
     */
    showMessage(message, type = 'info') {
        // TODO: 实现消息提示逻辑
        console.log(`${type}: ${message}`);
    }
}

// 初始化角色管理器
const roleManager = new RoleManager(); 