<template>
    <div class="admin-dashboard d-flex">
        <!-- 侧边栏 -->
        <div class="sidebar bg-light p-3" style="width: 250px;">
            <h3 class="mb-4">管理功能</h3>
            <ul class="nav flex-column">
                <li class="nav-item">
                    <router-link to="/admin/send-email" class="nav-link">发送邮件</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/admin/add-event" class="nav-link">活动管理</router-link>
                </li>
            </ul>
        </div>

        <!-- 主内容区 -->
        <div class="main-content flex-grow-1 p-4">
            <h1 class="mb-4">仪表板</h1>

            <!-- 统计卡片 -->
            <div class="row">
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">总用户数</h5>
                            <p class="card-text display-4">{{ totalUsers }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">活跃治疗计划</h5>
                            <p class="card-text display-4">{{ activeTreatments }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">本月新用户</h5>
                            <p class="card-text display-4">{{ newUsers }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 最近活动 -->
            <h2>最近活动</h2>
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>活动名称</th>
                            <th>日期</th>
                            <th>参与人数</th>
                            <th>状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="activity in recentActivities" :key="activity.id">
                            <td>{{ activity.name }}</td>
                            <td>{{ activity.date }}</td>
                            <td>{{ activity.participants }}</td>
                            <td>
                                <span :class="['badge', activity.status === '进行中' ? 'bg-success' : 'bg-secondary']">
                                    {{ activity.status }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'

export default {
    name: 'AdminDashboard',
    setup() {
        const totalUsers = ref(1500)
        const activeTreatments = ref(15)
        const newUsers = ref(120)

        const recentActivities = ref([
            { id: 1, name: '心理健康讲座', date: '2023-10-15', participants: 50, status: '进行中' },
            { id: 2, name: '团体辅导session', date: '2023-10-10', participants: 15, status: '已完成' },
            { id: 3, name: '压力管理工作坊', date: '2023-10-20', participants: 30, status: '即将开始' },
        ])

        return {
            totalUsers,
            activeTreatments,
            newUsers,
            recentActivities
        }
    }
}
</script>

<style scoped>
.admin-dashboard {
    min-height: 100vh;
}

.sidebar {
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.nav-link {
    color: #333;
}

.nav-link:hover,
.nav-link.active {
    color: #007bff;
}

.card {
    box-shadow: 0 4px 6px rgba(0, 0, 0, .1);
    transition: all 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, .15);
}

.table {
    background-color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, .1);
}
</style>