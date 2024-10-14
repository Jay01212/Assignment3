<template>
    <div class="admin-dashboard d-flex">
        <!-- Sidebar -->
        <div class="sidebar bg-light p-3" style="width: 250px;">
            <h3 class="mb-4">Admin Functions</h3>
            <ul class="nav flex-column">
                <li class="nav-item">
                    <router-link to="/admin/send-email" class="nav-link">Send Email</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/admin/add-resource" class="nav-link">Resource Management</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/admin/add-event" class="nav-link">Event Management</router-link>
                </li>
            </ul>
        </div>

        <!-- Main Content -->
        <div class="main-content flex-grow-1 p-4">
            <h1 class="mb-4">Dashboard</h1>

            <!-- Statistic Cards -->
            <div class="row">
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Total Users</h5>
                            <p class="card-text display-4">{{ totalUsers }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Active Treatment Plans</h5>
                            <p class="card-text display-4">{{ activeTreatments }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">New Users This Month</h5>
                            <p class="card-text display-4">{{ newUsers }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Activities -->
            <h2>Recent Activities</h2>
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Event Name</th>
                            <th>Date</th>
                            <th>Participants</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="activity in recentActivities" :key="activity.id">
                            <td>{{ activity.name }}</td>
                            <td>{{ activity.date }}</td>
                            <td>{{ activity.participants }}</td>
                            <td>
                                <span :class="['badge', activity.status === 'Ongoing' ? 'bg-success' : 'bg-secondary']">
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
            { id: 1, name: 'Mental Health Lecture', date: '2023-10-15', participants: 50, status: 'Ongoing' },
            { id: 2, name: 'Group Counseling Session', date: '2023-10-10', participants: 15, status: 'Completed' },
            { id: 3, name: 'Stress Management Workshop', date: '2023-10-20', participants: 30, status: 'Upcoming' },
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
