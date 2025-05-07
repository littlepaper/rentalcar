/**
 * 用户管理模块
 */
export class UserManager {
    constructor() {
        this.pageSize = 10;
        this.currentPage = 1;
        this.totalCount = 0;
        this.userList = [];
        this.departmentList = [];
        this.modal = null;
        this.form = null;
    }

    /**
     * 初始化用户管理模块
     */
    init() {
        this.initElements();
        this.bindEvents();
        this.loadDepartments();
        this.loadUserList();
    }

    /**
     * 初始化DOM元素
     */
    initElements() {
        // 搜索区域元素
        this.searchInput = document.querySelector('input[placeholder="请输入用户名称"]');
        this.phoneInput = document.querySelector('input[placeholder="请输入手机号码"]');
        this.statusSelect = document.querySelector('.status-select');
        this.searchBtn = document.querySelector('.btn-search');
        this.resetBtn = document.querySelector('.btn-reset');

        // 操作区域元素
        this.addBtn = document.querySelector('.btn-add');
        this.exportBtn = document.querySelector('.btn-export');

        // 表格元素
        this.tableBody = document.getElementById('userTableBody');

        // 分页元素
        this.pageSizeSelect = document.querySelector('.page-size');
        this.pageNumbers = document.querySelector('.page-numbers');
        this.prevBtn = document.querySelector('.btn-prev');
        this.nextBtn = document.querySelector('.btn-next');
        this.totalCountSpan = document.querySelector('.total-count');
        this.pageJumpInput = document.querySelector('.page-jump');
        this.jumpBtn = document.querySelector('.btn-jump');

        // 弹窗元素
        this.modal = document.querySelector('.user-modal');
        this.form = document.getElementById('userForm');
        this.modalTitle = document.querySelector('.modal-title');
        this.closeBtn = document.querySelector('.modal-close');
        this.cancelBtn = document.querySelector('.btn-cancel');
        this.confirmBtn = document.querySelector('.btn-confirm');
    }

    /**
     * 绑定事件处理函数
     */
    bindEvents() {
        // 搜索相关事件
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.resetBtn.addEventListener('click', () => this.handleReset());

        // 操作按钮事件
        this.addBtn.addEventListener('click', () => this.handleAdd());
        this.exportBtn.addEventListener('click', () => this.handleExport());

        // 表格相关事件
        this.tableBody.addEventListener('click', (e) => this.handleTableClick(e));

        // 分页相关事件
        this.pageSizeSelect.addEventListener('change', () => this.handlePageSizeChange());
        this.prevBtn.addEventListener('click', () => this.handlePrevPage());
        this.nextBtn.addEventListener('click', () => this.handleNextPage());
        this.jumpBtn.addEventListener('click', () => this.handlePageJump());

        // 弹窗相关事件
        this.closeBtn.addEventListener('click', () => this.closeModal());
        this.cancelBtn.addEventListener('click', () => this.closeModal());
        this.confirmBtn.addEventListener('click', () => this.handleSubmit());
    }

    /**
     * 加载部门列表
     */
    async loadDepartments() {
        try {
            // TODO: 调用后端API获取部门列表
            this.departmentList = [
                { id: 1, name: '研发部门' },
                { id: 2, name: '市场部门' },
                { id: 3, name: '财务部门' }
            ];
            this.updateDepartmentSelect();
        } catch (error) {
            console.error('加载部门列表失败:', error);
        }
    }

    /**
     * 更新部门下拉选择框
     */
    updateDepartmentSelect() {
        const departmentSelect = document.getElementById('department');
        departmentSelect.innerHTML = '<option value="">请选择部门</option>' +
            this.departmentList.map(dept => 
                `<option value="${dept.id}">${dept.name}</option>`
            ).join('');
    }

    /**
     * 加载用户列表
     */
    async loadUserList() {
        try {
            // TODO: 调用后端API获取用户列表
            this.userList = [
                {
                    id: 1,
                    username: 'admin',
                    nickname: '管理员',
                    department: '研发部门',
                    phone: '13800138000',
                    status: 'normal',
                    createTime: '2024-01-01 12:00:00'
                }
            ];
            this.totalCount = this.userList.length;
            this.renderTable();
            this.renderPagination();
        } catch (error) {
            console.error('加载用户列表失败:', error);
        }
    }

    /**
     * 渲染用户表格
     */
    renderTable() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        const pageData = this.userList.slice(start, end);

        this.tableBody.innerHTML = pageData.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.nickname}</td>
                <td>${user.department}</td>
                <td>${user.phone}</td>
                <td>
                    <span class="status-badge ${user.status}">
                        ${user.status === 'normal' ? '正常' : '禁用'}
                    </span>
                </td>
                <td>${user.createTime}</td>
                <td class="operation-cell">
                    <button class="btn-edit" data-id="${user.id}">修改</button>
                    <button class="btn-reset-pwd" data-id="${user.id}">新增</button>
                    <button class="btn-delete" data-id="${user.id}">删除</button>
                </td>
            </tr>
        `).join('');
    }

    /**
     * 渲染分页
     */
    renderPagination() {
        const totalPages = Math.ceil(this.totalCount / this.pageSize);
        this.totalCountSpan.textContent = `共 ${this.totalCount} 条`;
        
        // 更新分页按钮状态
        this.prevBtn.disabled = this.currentPage === 1;
        this.nextBtn.disabled = this.currentPage === totalPages;

        // 生成页码
        let pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || 
                (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }

        this.pageNumbers.innerHTML = pages.map(page => 
            page === '...' 
                ? '<span>...</span>'
                : `<button class="page-number ${page === this.currentPage ? 'active' : ''}">${page}</button>`
        ).join('');

        // 绑定页码点击事件
        this.pageNumbers.querySelectorAll('.page-number').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentPage = parseInt(btn.textContent);
                this.loadUserList();
            });
        });
    }

    /**
     * 处理搜索
     */
    handleSearch() {
        const searchParams = {
            username: this.searchInput.value.trim(),
            phone: this.phoneInput.value.trim(),
            status: this.statusSelect.value
        };
        
        // TODO: 根据搜索参数重新加载用户列表
        this.currentPage = 1;
        this.loadUserList();
    }

    /**
     * 处理重置
     */
    handleReset() {
        this.searchInput.value = '';
        this.phoneInput.value = '';
        this.statusSelect.value = '';
        this.handleSearch();
    }

    /**
     * 处理新增用户
     */
    handleAdd() {
        this.modalTitle.textContent = '新增用户';
        this.form.reset();
        this.openModal();
    }

    /**
     * 处理导出
     */
    handleExport() {
        // TODO: 实现用户导出功能
        console.log('导出用户');
    }

    /**
     * 处理表格点击事件
     */
    handleTableClick(e) {
        const target = e.target;
        const userId = target.dataset.id;

        if (target.classList.contains('btn-edit')) {
            this.handleEdit(userId);
        } else if (target.classList.contains('btn-delete')) {
            this.handleDelete(userId);
        } else if (target.classList.contains('btn-reset-pwd')) {
            this.handleResetPassword(userId);
        }
    }

    /**
     * 处理编辑用户
     */
    handleEdit(userId) {
        const user = this.userList.find(u => u.id === parseInt(userId));
        if (user) {
            this.modalTitle.textContent = '编辑用户';
            // 填充表单数据
            document.getElementById('userName').value = user.username;
            document.getElementById('nickName').value = user.nickname;
            document.getElementById('department').value = user.departmentId;
            document.getElementById('phoneNumber').value = user.phone;
            document.getElementById('userStatus').value = user.status;
            this.openModal();
        }
    }

    /**
     * 处理删除用户
     */
    handleDelete(userId) {
        if (confirm('确认删除该用户？')) {
            // TODO: 调用后端API删除用户
            console.log('删除用户:', userId);
            this.loadUserList();
        }
    }

    /**
     * 处理重置密码
     */
    handleResetPassword(userId) {
        if (confirm('确认重置该用户的密码？')) {
            // TODO: 调用后端API重置用户密码
            console.log('重置密码:', userId);
        }
    }

    /**
     * 处理分页大小变化
     */
    handlePageSizeChange() {
        this.pageSize = parseInt(this.pageSizeSelect.value);
        this.currentPage = 1;
        this.loadUserList();
    }

    /**
     * 处理上一页
     */
    handlePrevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadUserList();
        }
    }

    /**
     * 处理下一页
     */
    handleNextPage() {
        const totalPages = Math.ceil(this.totalCount / this.pageSize);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.loadUserList();
        }
    }

    /**
     * 处理页面跳转
     */
    handlePageJump() {
        const page = parseInt(this.pageJumpInput.value);
        const totalPages = Math.ceil(this.totalCount / this.pageSize);
        
        if (page && page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.loadUserList();
        } else {
            alert('请输入有效的页码！');
        }
    }

    /**
     * 打开模态框
     */
    openModal() {
        this.modal.style.display = 'block';
    }

    /**
     * 关闭模态框
     */
    closeModal() {
        this.modal.style.display = 'none';
        this.form.reset();
    }

    /**
     * 处理表单提交
     */
    async handleSubmit() {
        const formData = {
            username: document.getElementById('userName').value,
            nickname: document.getElementById('nickName').value,
            departmentId: document.getElementById('department').value,
            phone: document.getElementById('phoneNumber').value,
            status: document.getElementById('userStatus').value
        };

        try {
            // TODO: 调用后端API保存用户数据
            console.log('保存用户数据:', formData);
            this.closeModal();
            this.loadUserList();
        } catch (error) {
            console.error('保存用户数据失败:', error);
            alert('保存失败，请重试！');
        }
    }
} 