<template>
    <div class="admin-dashboard">
        <div class="container-fluid">
            <div class="row">
                <!-- 侧边栏 -->
                <nav class="col-md-3 col-lg-2 d-md-block bg-light sidebar">
                    <div class="position-sticky pt-3">
                        <ul class="nav flex-column">
                            <li class="nav-item">
                                <router-link class="nav-link active" to="/admin/dashboard">
                                    <i class="fas fa-home me-2"></i>
                                    首页
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" to="/admin/users">
                                    <i class="fas fa-users me-2"></i>
                                    用户管理
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" to="/admin/activities">
                                    <i class="fas fa-calendar-alt me-2"></i>
                                    活动管理
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" to="/admin/treatments">
                                    <i class="fas fa-clipboard-list me-2"></i>
                                    治疗计划
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" to="/admin/emails">
                                    <i class="fas fa-envelope me-2"></i>
                                    邮件管理
                                </router-link>
                            </li>
                        </ul>
                        <button @click="logout" class="btn btn-danger mt-3 w-100">登出</button>
                    </div>
                </nav>

                <!-- 主内容区 -->
                <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                    <div
                        class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                        <h1 class="h2">仪表板</h1>
                    </div>

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
                        <table class="table table-striped table-sm">
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
                                        <span
                                            :class="['badge', activity.status === '进行中' ? 'bg-success' : 'bg-secondary']">
                                            {{ activity.status }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
    name: 'AdminDashboard',
    setup() {
        const router = useRouter()

        const totalUsers = ref(1500)
        const activeTreatments = ref(15)
        const newUsers = ref(120)

        const recentActivities = ref([
            { id: 1, name: '心理健康讲座', date: '2023-10-15', participants: 50, status: '进行中' },
            { id: 2, name: '团体辅导session', date: '2023-10-10', participants: 15, status: '已完成' },
            { id: 3, name: '压力管理工作坊', date: '2023-10-20', participants: 30, status: '即将开始' },
        ])

        const logout = () => {
            // 这里添加登出逻辑
            router.push('/login')
        }

        return {
            totalUsers,
            activeTreatments,
            newUsers,
            recentActivities,
            logout
        }
    }
}
</script>

<style scoped>
.sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    padding: 48px 0 0;
    box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
}

.sidebar-sticky {
    position: relative;
    top: 0;
    height: calc(100vh - 48px);
    padding-top: .5rem;
    overflow-x: hidden;
    overflow-y: auto;
}

.navbar-brand {
    padding-top: .75rem;
    padding-bottom: .75rem;
    font-size: 1rem;
    background-color: rgba(0, 0, 0, .25);
    box-shadow: inset -1px 0 0 rgba(0, 0, 0, .25);
}

.navbar .navbar-toggler {
    top: .25rem;
    right: 1rem;
}

.navbar .form-control {
    padding: .75rem 1rem;
    border-width: 0;
    border-radius: 0;
}
</style>