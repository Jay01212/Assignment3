<template>
    <div class="admin-event-management">
        <h1 class="text-center mb-4">Event Management</h1>

        <div class="d-flex justify-content-between mb-4">
            <div class="filter-container d-flex gap-2">
                <input v-model="searchQuery" @input="handleSearch" class="form-control" placeholder="Search events...">
                <select v-model="statusFilter" @change="handleSearch" class="form-select">
                    <option value="">All Statuses</option>
                    <option value="Open">Open</option>
                    <option value="Full">Full</option>
                    <option value="Canceled">Canceled</option>
                </select>
                <button @click="clearFilters" class="btn btn-secondary">Clear Filters</button>
            </div>
            <router-link to="/admin/add-event" class="btn btn-primary">Add Event</router-link>
        </div>

        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>Event Name</th>
                        <th>Details</th>
                        <th>Date</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="event in paginatedEvents" :key="event.id">
                        <td>
                            <input v-model="event.eventName" class="form-control" @change="updateEvent(event)">
                        </td>
                        <td>
                            <textarea v-model="event.details" class="form-control"
                                @change="updateEvent(event)"></textarea>
                        </td>
                        <td>
                            <input type="date" v-model="event.date" class="form-control" @change="updateEvent(event)">
                        </td>
                        <td>
                            <input v-model="event.location" class="form-control" @change="updateEvent(event)">
                        </td>
                        <td>
                            <select v-model="event.status" class="form-select" @change="updateEvent(event)">
                                <option value="Open">Open</option>
                                <option value="Full">Full</option>
                                <option value="Canceled">Canceled</option>
                            </select>
                        </td>
                        <td>
                            <button @click="deleteEvent(event)" class="btn btn-danger btn-sm">Delete</button>
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
import { ref, computed, onMounted } from 'vue';
import { db } from '@/firebase/init';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default {
    name: 'AdminEventManagement',
    setup() {
        const events = ref([]);
        const searchQuery = ref('');
        const statusFilter = ref('');
        const currentPage = ref(1);
        const itemsPerPage = 10;

        const fetchEvents = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'events'));
                events.value = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            } catch (error) {
                console.error("Error fetching events: ", error);
            }
        };

        onMounted(fetchEvents);

        const filteredEvents = computed(() => {
            return events.value.filter(event => {
                const matchesSearch = event.eventName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                    event.details.toLowerCase().includes(searchQuery.value.toLowerCase());
                const matchesStatus = !statusFilter.value || event.status === statusFilter.value;
                return matchesSearch && matchesStatus;
            });
        });

        const totalPages = computed(() => Math.ceil(filteredEvents.value.length / itemsPerPage));

        const paginatedEvents = computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            return filteredEvents.value.slice(start, end);
        });

        const handleSearch = () => {
            currentPage.value = 1;
        };

        const clearFilters = () => {
            searchQuery.value = '';
            statusFilter.value = '';
            currentPage.value = 1;
        };

        const changePage = (page) => {
            if (page >= 1 && page <= totalPages.value) {
                currentPage.value = page;
            }
        };

        const updateEvent = async (event) => {
            try {
                const eventRef = doc(db, 'events', event.id);
                await updateDoc(eventRef, {
                    eventName: event.eventName,
                    details: event.details,
                    date: event.date,
                    location: event.location,
                    status: event.status
                });
                console.log("Event updated successfully");
            } catch (error) {
                console.error("Error updating event: ", error);
            }
        };

        const deleteEvent = async (event) => {
            if (confirm('Are you sure you want to delete this event?')) {
                try {
                    await deleteDoc(doc(db, 'events', event.id));
                    events.value = events.value.filter(e => e.id !== event.id);
                    console.log("Event deleted successfully");
                } catch (error) {
                    console.error("Error deleting event: ", error);
                }
            }
        };

        return {
            events,
            searchQuery,
            statusFilter,
            currentPage,
            totalPages,
            paginatedEvents,
            handleSearch,
            clearFilters,
            changePage,
            updateEvent,
            deleteEvent
        };
    }
};
</script>

<style scoped>
.admin-event-management {
    font-family: Arial, sans-serif;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    color: #4a90e2;
    font-size: 2.5rem;
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
    border-radius: 4px;
    border: 1px solid #ced4da;
}

.table td,
.table th {
    padding: 15px;
    vertical-align: middle;
}
</style>