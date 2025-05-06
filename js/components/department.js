/**
 * 部门管理模块
 * @module department
 */

/**
 * 部门数据结构
 */
const departmentData = [
    {
        id: 1,
        name: '若依科技',
        sort: 0,
        status: '正常',
        createTime: '2024-12-20 18:21:33',
        children: [
            {
                id: 2,
                name: '深圳总公司',
                sort: 1,
                status: '正常',
                createTime: '2024-12-20 18:21:33',
                children: [
                    {
                        id: 3,
                        name: '研发部门',
                        sort: 1,
                        status: '正常',
                        createTime: '2024-12-20 18:21:33'
                    },
                    {
                        id: 4,
                        name: '市场部门',
                        sort: 2,
                        status: '正常',
                        createTime: '2024-12-20 18:21:33'
                    },
                    {
                        id: 5,
                        name: '测试部门',
                        sort: 3,
                        status: '正常',
                        createTime: '2024-12-20 18:21:33'
                    },
                    {
                        id: 6,
                        name: '财务部门',
                        sort: 4,
                        status: '正常',
                        createTime: '2024-12-20 18:21:33'
                    },
                    {
                        id: 7,
                        name: '运维部门',
                        sort: 5,
                        status: '正常',
                        createTime: '2024-12-20 18:21:33'
                    }
                ]
            },
            {
                id: 8,
                name: '长沙分公司',
                sort: 2,
                status: '正常',
                createTime: '2024-12-20 18:21:33',
                children: [
                    {
                        id: 9,
                        name: '市场部门',
                        sort: 1,
                        status: '正常',
                        createTime: '2024-12-20 18:21:34'
                    },
                    {
                        id: 10,
                        name: '财务部门',
                        sort: 2,
                        status: '正常',
                        createTime: '2024-12-20 18:21:34'
                    }
                ]
            }
        ]
    }
];

/**
 * 部门管理类
 */
export class DepartmentManager {
    constructor() {
        this.data = departmentData;
        this.expandedDepartments = new Set();
        this.isAllExpanded = false;
        this.currentDepartment = null;
        this.isEdit = false;
    }

    /**
     * 初始化部门管理模块
     */
    init() {
        if (document.getElementById('departmentTableBody')) {
            this.renderDepartmentList();
            this.initEventListeners();
            this.initExpandAllButton();
            this.initTopButtons();
        }
    }

    /**
     * 初始化顶部按钮事件
     */
    initTopButtons() {
        const addBtn = document.querySelector('.btn-green');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                // 顶部新增按钮点击时，使用第一个部门作为父部门
                const rootDepartment = this.data[0];
                this.showDepartmentModal('add', rootDepartment);
            });
        }
    }

    /**
     * 初始化展开/折叠所有按钮
     */
    initExpandAllButton() {
        const expandAllBtn = document.querySelector('.btn-orange');
        if (expandAllBtn) {
            expandAllBtn.addEventListener('click', () => {
                this.toggleAllDepartments();
            });
        }
    }

    /**
     * 切换所有部门的展开/折叠状态
     */
    toggleAllDepartments() {
        const allDepartmentIds = this.getAllDepartmentIds(this.data);
        if (this.isAllExpanded) {
            this.expandedDepartments.clear();
        } else {
            allDepartmentIds.forEach(id => this.expandedDepartments.add(id));
        }
        this.isAllExpanded = !this.isAllExpanded;
        this.renderDepartmentList();
    }

    /**
     * 获取所有部门ID
     * @param {Array} departments 部门数据
     * @returns {Array} 部门ID数组
     */
    getAllDepartmentIds(departments) {
        let ids = [];
        departments.forEach(dept => {
            ids.push(dept.id);
            if (dept.children && dept.children.length > 0) {
                ids = ids.concat(this.getAllDepartmentIds(dept.children));
            }
        });
        return ids;
    }

    /**
     * 生成部门行HTML
     * @param {Object} department 部门数据
     * @param {number} level 层级
     * @returns {string} HTML字符串
     */
    generateDepartmentRow(department, level = 0) {
        const hasChildren = department.children && department.children.length > 0;
        const isExpanded = this.expandedDepartments.has(department.id);
        const padding = level * 20;
        
        let html = `
            <tr data-id="${department.id}">
                <td>
                    <div class="tree-node" style="padding-left: ${padding}px">
                        <span class="expand-handler ${hasChildren ? 'has-children' : ''}" data-id="${department.id}">
                            ${hasChildren ? (isExpanded ? '∨' : '>') : ''}
                        </span>
                        ${department.name}
                    </div>
                </td>
                <td>${department.sort}</td>
                <td><span class="status-tag">${department.status}</span></td>
                <td>${department.createTime}</td>
                <td>
                    <div class="operation-btns">
                        <a class="btn-link edit">修改</a>
                        <a class="btn-link add">新增</a>
                        <a class="btn-link delete">删除</a>
                    </div>
                </td>
            </tr>
        `;

        if (hasChildren && isExpanded) {
            department.children.forEach(child => {
                html += this.generateDepartmentRow(child, level + 1);
            });
        }

        return html;
    }

    /**
     * 渲染部门列表
     */
    renderDepartmentList() {
        const tableBody = document.getElementById('departmentTableBody');
        if (!tableBody) return;
        
        let html = '';
        this.data.forEach(department => {
            html += this.generateDepartmentRow(department);
        });
        
        tableBody.innerHTML = html;
    }

    /**
     * 切换部门展开/折叠状态
     * @param {number} departmentId 部门ID
     */
    toggleDepartment(departmentId) {
        if (this.expandedDepartments.has(departmentId)) {
            this.expandedDepartments.delete(departmentId);
        } else {
            this.expandedDepartments.add(departmentId);
        }
        this.renderDepartmentList();
    }

    /**
     * 显示部门编辑弹窗
     * @param {string} type 操作类型：'add' 或 'edit'
     * @param {Object} department 当前操作的部门数据
     */
    showDepartmentModal(type, department) {
        const modal = document.getElementById('departmentModal');
        const title = document.querySelector('.modal-title');
        const parentInput = document.getElementById('parentDepartment');
        const nameInput = document.getElementById('departmentName');
        const sortInput = document.getElementById('departmentSort');
        const statusSelect = document.getElementById('departmentStatus');

        this.isEdit = type === 'edit';
        this.currentDepartment = department;

        // 设置标题
        title.textContent = this.isEdit ? '修改部门' : '新增部门';

        // 设置表单数据
        if (this.isEdit) {
            parentInput.value = this.getParentDepartmentName(department.id);
            nameInput.value = department.name;
            sortInput.value = department.sort;
            statusSelect.value = department.status;
        } else {
            // 如果是从顶部新增按钮点击，显示选中的父部门
            parentInput.value = department ? department.name : '';
            nameInput.value = '';
            // 设置默认排序号为当前父部门下最大排序号 + 1
            sortInput.value = this.getNextSort(department);
            statusSelect.value = '正常';
        }

        modal.classList.add('show');
    }

    /**
     * 获取下一个排序号
     * @param {Object} parentDepartment 父部门
     * @returns {number} 下一个排序号
     */
    getNextSort(parentDepartment) {
        if (!parentDepartment || !parentDepartment.children) {
            return 1;
        }
        const maxSort = Math.max(...parentDepartment.children.map(dept => dept.sort), 0);
        return maxSort + 1;
    }

    /**
     * 隐藏部门编辑弹窗
     */
    hideDepartmentModal() {
        const modal = document.getElementById('departmentModal');
        modal.classList.remove('show');
        this.currentDepartment = null;
        this.isEdit = false;
    }

    /**
     * 获取父部门名称
     * @param {number} departmentId 部门ID
     * @returns {string} 父部门名称
     */
    getParentDepartmentName(departmentId) {
        const findParent = (data) => {
            for (const dept of data) {
                if (dept.children) {
                    for (const child of dept.children) {
                        if (child.id === departmentId) {
                            return dept.name;
                        }
                        if (child.children) {
                            const result = findParent(child.children);
                            if (result) return result;
                        }
                    }
                }
            }
            return '';
        };
        return findParent(this.data);
    }

    /**
     * 保存部门数据
     */
    saveDepartment() {
        const nameInput = document.getElementById('departmentName');
        const sortInput = document.getElementById('departmentSort');
        const statusSelect = document.getElementById('departmentStatus');

        const name = nameInput.value.trim();
        const sort = parseInt(sortInput.value);
        const status = statusSelect.value;

        if (!name) {
            alert('请输入部门名称');
            return;
        }

        if (isNaN(sort) || sort < 0) {
            alert('请输入有效的排序号');
            return;
        }

        const newDepartment = {
            id: this.isEdit ? this.currentDepartment.id : Date.now(),
            name,
            sort,
            status,
            createTime: this.isEdit ? this.currentDepartment.createTime : new Date().toLocaleString()
        };

        if (this.isEdit) {
            this.updateDepartment(newDepartment);
        } else {
            this.addDepartment(newDepartment);
        }

        this.hideDepartmentModal();
        this.renderDepartmentList();
    }

    /**
     * 更新部门数据
     * @param {Object} newDepartment 新的部门数据
     */
    updateDepartment(newDepartment) {
        const updateInTree = (data) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].id === newDepartment.id) {
                    data[i] = { ...data[i], ...newDepartment };
                    return true;
                }
                if (data[i].children) {
                    if (updateInTree(data[i].children)) return true;
                }
            }
            return false;
        };
        updateInTree(this.data);
    }

    /**
     * 添加部门数据
     * @param {Object} newDepartment 新的部门数据
     */
    addDepartment(newDepartment) {
        const addToParent = (data) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].id === this.currentDepartment.id) {
                    if (!data[i].children) {
                        data[i].children = [];
                    }
                    data[i].children.push(newDepartment);
                    return true;
                }
                if (data[i].children) {
                    if (addToParent(data[i].children)) return true;
                }
            }
            return false;
        };
        addToParent(this.data);
    }

    /**
     * 初始化事件监听
     */
    initEventListeners() {
        const tableBody = document.getElementById('departmentTableBody');
        const modal = document.getElementById('departmentModal');
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.btn-cancel');
        const confirmBtn = modal.querySelector('.btn-confirm');

        if (!tableBody) return;

        // 表格点击事件委托
        tableBody.addEventListener('click', (e) => {
            const target = e.target;
            
            // 展开/折叠图标点击
            if (target.classList.contains('expand-handler')) {
                const departmentId = parseInt(target.dataset.id);
                if (target.classList.contains('has-children')) {
                    this.toggleDepartment(departmentId);
                    this.renderDepartmentList();
                }
            }
            
            // 操作按钮点击
            if (target.classList.contains('btn-link')) {
                const row = target.closest('tr');
                const departmentId = parseInt(row.dataset.id);
                const department = this.findDepartmentById(departmentId);
                
                if (target.classList.contains('edit')) {
                    this.showDepartmentModal('edit', department);
                } else if (target.classList.contains('add')) {
                    this.showDepartmentModal('add', department);
                } else if (target.classList.contains('delete')) {
                    if (confirm('确认要删除该部门吗？')) {
                        this.deleteDepartment(departmentId);
                        this.renderDepartmentList();
                    }
                }
            }
        });

        // 弹窗关闭按钮点击
        closeBtn.addEventListener('click', () => this.hideDepartmentModal());
        cancelBtn.addEventListener('click', () => this.hideDepartmentModal());
        confirmBtn.addEventListener('click', () => this.saveDepartment());
    }

    /**
     * 根据ID查找部门
     * @param {number} id 部门ID
     * @returns {Object|null} 部门数据
     */
    findDepartmentById(id) {
        const find = (data) => {
            for (const dept of data) {
                if (dept.id === id) return dept;
                if (dept.children) {
                    const result = find(dept.children);
                    if (result) return result;
                }
            }
            return null;
        };
        return find(this.data);
    }

    /**
     * 删除部门
     * @param {number} id 部门ID
     */
    deleteDepartment(id) {
        const deleteFromTree = (data) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].id === id) {
                    data.splice(i, 1);
                    return true;
                }
                if (data[i].children) {
                    if (deleteFromTree(data[i].children)) return true;
                }
            }
            return false;
        };
        deleteFromTree(this.data);
    }
} 