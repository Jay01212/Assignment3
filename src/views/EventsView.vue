<template>
    <div class="events-view">
        <h1 class="text-center mb-4">Mental Health Events</h1>

        <div class="filter-container mb-4">
            <input v-model="searchQuery" @input="handleSearch" class="form-control" placeholder="Search events...">
            <select v-model="statusFilter" @change="handleSearch" class="form-select">
                <option value="">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Full">Full</option>
                <option value="Canceled">Canceled</option>
            </select>
            <button @click="clearFilters" class="btn btn-secondary">Clear Filters</button>
        </div>

        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>
                            Event Name
                            <div class="filter-buttons">
                                <button @click="sortAlphabetically('eventName', 'asc')"
                                    class="btn btn-sm btn-outline-primary">A-Z</button>
                                <button @click="sortAlphabetically('eventName', 'desc')"
                                    class="btn btn-sm btn-outline-primary">Z-A</button>
                            </div>
                        </th>
                        <th>
                            Details
                            <div class="filter-buttons">
                                <button @click="sortAlphabetically('details', 'asc')"
                                    class="btn btn-sm btn-outline-primary">A-Z</button>
                                <button @click="sortAlphabetically('details', 'desc')"
                                    class="btn btn-sm btn-outline-primary">Z-A</button>
                            </div>
                        </th>
                        <th>
                            Date
                            <div class="filter-buttons">
                                <button @click="sort('date', 'asc')" class="btn btn-sm btn-outline-primary">↑</button>
                                <button @click="sort('date', 'desc')" class="btn btn-sm btn-outline-primary">↓</button>
                            </div>
                        </th>
                        <th>
                            Location
                            <div class="filter-buttons">
                                <button @click="sortAlphabetically('location', 'asc')"
                                    class="btn btn-sm btn-outline-primary">A-Z</button>
                                <button @click="sortAlphabetically('location', 'desc')"
                                    class="btn btn-sm btn-outline-primary">Z-A</button>
                            </div>
                        </th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="event in paginatedEvents" :key="event.id">
                        <td>
                            {{ event.eventName }}
                            <a href="#" class="link-icon" @click.prevent="showEventDetails(event)">
                                <i class="fas fa-link"></i>
                            </a>
                        </td>
                        <td>{{ event.details }}</td>
                        <td>{{ formatDate(event.date) }}</td>
                        <td>{{ event.location }}</td>
                        <td>
                            <span :class="getStatusClass(event.status)">{{ event.status }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <nav aria-label="Events pagination" class="mt-4">
            <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
                </li>
                <li v-for="page in totalPages" :key="page" class="page-item">
                    <a class="page-link" href="#" @click.prevent="changePage(page)"
                        :class="{ 'active': currentPage === page }">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
    name: 'EventsView',
    setup() {
        const events = ref([
            { id: 1, eventName: 'Stress Relief Yoga', details: 'Guided yoga session for stress relief', date: '2024-10-18', location: 'Park Pavilion', status: 'Canceled' },
            { id: 2, eventName: 'Anxiety Support Group', details: 'Weekly support group for managing anxiety', date: '2024-10-20', location: 'Therapy Center', status: 'Open' },
            { id: 3, eventName: 'Mental Health Webinar', details: 'An online webinar discussing mental wellness', date: '2024-10-25', location: 'Online (Zoom)', status: 'Open' },
            { id: 4, eventName: 'Wellness Workshop', details: 'A hands-on workshop on mindfulness practices', date: '2024-11-10', location: 'Community Center', status: 'Open' },
            { id: 5, eventName: 'Depression Awareness', details: 'Seminar focusing on recognizing depression', date: '2024-11-15', location: 'City Hall', status: 'Full' },
            { id: 6, eventName: 'Art Therapy Session', details: 'Expressive art therapy for emotional healing', date: '2024-11-22', location: 'Art Studio', status: 'Open' },
            { id: 7, eventName: 'Mindfulness Meditation', details: 'Guided meditation for mental clarity', date: '2024-11-30', location: 'Wellness Center', status: 'Open' },
            { id: 8, eventName: 'Cognitive Behavioral Therapy Workshop', details: 'Introduction to CBT techniques', date: '2024-12-05', location: 'Psychology Institute', status: 'Open' },
            { id: 9, eventName: 'Family Mental Health Day', details: 'Activities promoting family mental wellness', date: '2024-12-12', location: 'Community Park', status: 'Open' },
            { id: 10, eventName: 'Stress Management Seminar', details: 'Techniques for managing daily stress', date: '2024-12-18', location: 'Conference Hall', status: 'Open' },
            { id: 11, eventName: 'Grief Counseling Group', details: 'Support group for those dealing with loss', date: '2025-01-05', location: 'Counseling Center', status: 'Open' },
            { id: 12, eventName: 'Positive Psychology Lecture', details: 'Exploring the science of happiness', date: '2025-01-15', location: 'University Auditorium', status: 'Open' },
            { id: 13, eventName: 'Teen Mental Health Awareness', details: 'Workshop for teenagers and parents', date: '2025-01-22', location: 'High School Gym', status: 'Open' },
            { id: 14, eventName: 'Workplace Mental Health Seminar', details: 'Promoting mental health at work', date: '2025-02-01', location: 'Business Center', status: 'Open' },
            { id: 15, eventName: 'Holistic Health Expo', details: 'Exploring mind-body connections', date: '2025-02-10', location: 'Convention Center', status: 'Open' },
        ]);

        const searchQuery = ref('');
        const statusFilter = ref('');
        const sortKey = ref('date');
        const sortOrder = ref('asc');
        const currentPage = ref(1);
        const itemsPerPage = 10;

        const filteredEvents = computed(() => {
            return events.value.filter(event => {
                const matchesSearch = event.eventName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                    event.details.toLowerCase().includes(searchQuery.value.toLowerCase());
                const matchesStatus = !statusFilter.value || event.status === statusFilter.value;
                return matchesSearch && matchesStatus;
            });
        });

        const sortedEvents = computed(() => {
            return [...filteredEvents.value].sort((a, b) => {
                let aValue = a[sortKey.value];
                let bValue = b[sortKey.value];

                if (sortKey.value === 'date') {
                    aValue = new Date(aValue);
                    bValue = new Date(bValue);
                }

                if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1;
                return 0;
            });
        });

        const totalPages = computed(() => Math.ceil(sortedEvents.value.length / itemsPerPage));

        const paginatedEvents = computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            return sortedEvents.value.slice(start, end);
        });

        const handleSearch = () => {
            currentPage.value = 1;
        };

        const clearFilters = () => {
            searchQuery.value = '';
            statusFilter.value = '';
            sortKey.value = 'date';
            sortOrder.value = 'asc';
            currentPage.value = 1;
        };

        const sort = (key, order) => {
            sortKey.value = key;
            sortOrder.value = order;
        };

        const sortAlphabetically = (key, order) => {
            sort(key, order);
        };

        const changePage = (page) => {
            if (page >= 1 && page <= totalPages.value) {
                currentPage.value = page;
            }
        };

        const formatDate = (dateString) => {
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            return new Date(dateString).toLocaleDateString('en-GB', options);
        };

        const getStatusClass = (status) => {
            switch (status) {
                case 'Open': return 'badge bg-success';
                case 'Full': return 'badge bg-warning';
                case 'Canceled': return 'badge bg-danger';
                default: return 'badge bg-secondary';
            }
        };

        return {
            searchQuery,
            statusFilter,
            currentPage,
            totalPages,
            paginatedEvents,
            handleSearch,
            clearFilters,
            sort,
            sortAlphabetically,
            changePage,
            formatDate,
            getStatusClass
        };
    }
};
</script>

<style scoped>
.events-view {
    font-family: Arial, sans-serif;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    color: #4a90e2;
    font-size: 2.5rem;
}

.filter-container {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.filter-container>* {
    flex: 1;
}

.table {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.table th {
    background-color: #f8f9fa;
    border-bottom: 2px solid #dee2e6;
}

.filter-buttons {
    display: flex;
    gap: 5px;
    margin-top: 5px;
}

.filter-buttons .btn {
    padding: 2px 5px;
    font-size: 0.75rem;
}

.badge {
    font-size: 0.8rem;
    padding: 5px 10px;
    border-radius: 20px;
}

.pagination {
    margin-top: 20px;
}

.page-link {
    color: #4a90e2;
    background-color: transparent;
    border: none;
}

.page-link.active {
    font-weight: bold;
    color: #4a90e2;
    text-decoration: underline;
}

.btn-primary,
.btn-secondary {
    border-radius: 20px;
}

.form-control,
.form-select {
    border-radius: 20px;
    border: 1px solid #ced4da;
}

.table td,
.table th {
    padding: 15px;
    vertical-align: middle;
}

.badge {
    text-transform: uppercase;
    font-weight: bold;
}

.bg-success {
    background-color: #28a745 !important;
}

.bg-warning {
    background-color: #ffc107 !important;
    color: #212529;
}

.bg-danger {
    background-color: #dc3545 !important;
}

.filter-buttons .btn {
    border: 1px solid #4a90e2;
    color: #4a90e2;
}

.filter-buttons .btn:hover {
    background-color: #4a90e2;
    color: white;
}

.link-icon {
    margin-left: 5px;
    color: #4a90e2;
}

.link-icon:hover {
    color: #2a6496;
}
</style>