<template>
    <div class="admin-resource-management">
        <h1 class="text-center mb-4">Resource Management</h1>

        <div class="d-flex justify-content-between mb-4">
            <div class="filter-container d-flex gap-2">
                <input v-model="searchQuery" @input="handleSearch" class="form-control"
                    placeholder="Search resources...">
                <select v-model="categoryFilter" @change="handleSearch" class="form-select">
                    <option value="">All Categories</option>
                    <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
                </select>
                <button @click="clearFilters" class="btn btn-secondary">Clear Filters</button>
            </div>
            <router-link to="/admin/add-resource" class="btn btn-primary">Add Resource</router-link>
        </div>

        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>Resource Name</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Access Link</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="resource in paginatedResources" :key="resource.id">
                        <td>
                            <input v-model="resource.resourceName" class="form-control"
                                @change="updateResource(resource)">
                        </td>
                        <td>
                            <textarea v-model="resource.description" class="form-control"
                                @change="updateResource(resource)"></textarea>
                        </td>
                        <td>
                            <select v-model="resource.category" class="form-select" @change="updateResource(resource)">
                                <option v-for="category in categories" :key="category" :value="category">{{ category }}
                                </option>
                            </select>
                        </td>
                        <td>
                            <input v-model="resource.accessLink" class="form-control"
                                @change="updateResource(resource)">
                        </td>
                        <td>
                            <button @click="deleteResource(resource)" class="btn btn-danger btn-sm">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <nav aria-label="Resources pagination" class="mt-4">
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
    name: 'AdminResourceManagement',
    setup() {
        const resources = ref([]);
        const searchQuery = ref('');
        const categoryFilter = ref('');
        const currentPage = ref(1);
        const itemsPerPage = 10;

        const categories = ['Self-help', 'Professional Support', 'Crisis Intervention', 'Community Resources'];

        const fetchResources = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'resources'));
                resources.value = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            } catch (error) {
                console.error("Error fetching resources: ", error);
            }
        };

        onMounted(fetchResources);

        const filteredResources = computed(() => {
            return resources.value.filter(resource => {
                const matchesSearch = resource.resourceName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                    resource.description.toLowerCase().includes(searchQuery.value.toLowerCase());
                const matchesCategory = !categoryFilter.value || resource.category === categoryFilter.value;
                return matchesSearch && matchesCategory;
            });
        });

        const totalPages = computed(() => Math.ceil(filteredResources.value.length / itemsPerPage));

        const paginatedResources = computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            return filteredResources.value.slice(start, end);
        });

        const handleSearch = () => {
            currentPage.value = 1;
        };

        const clearFilters = () => {
            searchQuery.value = '';
            categoryFilter.value = '';
            currentPage.value = 1;
        };

        const changePage = (page) => {
            if (page >= 1 && page <= totalPages.value) {
                currentPage.value = page;
            }
        };

        const updateResource = async (resource) => {
            try {
                const resourceRef = doc(db, 'resources', resource.id);
                await updateDoc(resourceRef, {
                    resourceName: resource.resourceName,
                    description: resource.description,
                    category: resource.category,
                    accessLink: resource.accessLink
                });
                console.log("Resource updated successfully");
            } catch (error) {
                console.error("Error updating resource: ", error);
            }
        };

        const deleteResource = async (resource) => {
            if (confirm('Are you sure you want to delete this resource?')) {
                try {
                    await deleteDoc(doc(db, 'resources', resource.id));
                    resources.value = resources.value.filter(r => r.id !== resource.id);
                    console.log("Resource deleted successfully");
                } catch (error) {
                    console.error("Error deleting resource: ", error);
                }
            }
        };

        return {
            resources,
            searchQuery,
            categoryFilter,
            categories,
            currentPage,
            totalPages,
            paginatedResources,
            handleSearch,
            clearFilters,
            changePage,
            updateResource,
            deleteResource
        };
    }
};
</script>

<style scoped>
.admin-resource-management {
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