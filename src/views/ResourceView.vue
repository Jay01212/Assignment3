<template>
    <div class="resources-view">
        <h1 class="text-center mb-4">Mental Health Resources</h1>

        <div class="filter-container mb-4">
            <input v-model="searchQuery" @input="handleSearch" class="form-control" placeholder="Search resources...">
            <select v-model="categoryFilter" @change="handleSearch" class="form-select">
                <option value="">All Categories</option>
                <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
            </select>
            <button @click="clearFilters" class="btn btn-secondary">Clear Filters</button>
        </div>

        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>
                            Resource Name
                            <div class="filter-buttons">
                                <button @click="sortAlphabetically('resourceName', 'asc')"
                                    class="btn btn-sm btn-outline-primary">A-Z</button>
                                <button @click="sortAlphabetically('resourceName', 'desc')"
                                    class="btn btn-sm btn-outline-primary">Z-A</button>
                            </div>
                        </th>
                        <th>Description</th>
                        <th>
                            Category
                            <div class="filter-buttons">
                                <button @click="sortAlphabetically('category', 'asc')"
                                    class="btn btn-sm btn-outline-primary">A-Z</button>
                                <button @click="sortAlphabetically('category', 'desc')"
                                    class="btn btn-sm btn-outline-primary">Z-A</button>
                            </div>
                        </th>
                        <th>Access Link</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="resource in paginatedResources" :key="resource.id">
                        <td>{{ resource.resourceName }}</td>
                        <td>{{ resource.description }}</td>
                        <td>{{ resource.category }}</td>
                        <td><a :href="resource.accessLink" target="_blank">Access Resource</a></td>
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

        <div class="export-container mt-4">
            <select v-model="exportFormat" class="form-select me-2" style="width: auto; display: inline-block;">
                <option value="csv">CSV</option>
                <option value="pdf">PDF</option>
            </select>
            <button @click="exportResources" class="btn btn-primary">Export Resources</button>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { db } from '@/firebase/init';
import { collection, getDocs } from 'firebase/firestore';

export default {
    name: 'ResourcesView',
    setup() {
        const resources = ref([]);
        const searchQuery = ref('');
        const categoryFilter = ref('');
        const sortKey = ref('resourceName');
        const sortOrder = ref('asc');
        const currentPage = ref(1);
        const itemsPerPage = 10;
        const exportFormat = ref('csv');

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

        const sortedResources = computed(() => {
            return [...filteredResources.value].sort((a, b) => {
                if (a[sortKey.value] < b[sortKey.value]) return sortOrder.value === 'asc' ? -1 : 1;
                if (a[sortKey.value] > b[sortKey.value]) return sortOrder.value === 'asc' ? 1 : -1;
                return 0;
            });
        });

        const totalPages = computed(() => Math.ceil(sortedResources.value.length / itemsPerPage));

        const paginatedResources = computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            return sortedResources.value.slice(start, end);
        });

        const handleSearch = () => {
            currentPage.value = 1;
        };

        const clearFilters = () => {
            searchQuery.value = '';
            categoryFilter.value = '';
            sortKey.value = 'resourceName';
            sortOrder.value = 'asc';
            currentPage.value = 1;
        };

        const sortAlphabetically = (key, order) => {
            sortKey.value = key;
            sortOrder.value = order;
        };

        const changePage = (page) => {
            if (page >= 1 && page <= totalPages.value) {
                currentPage.value = page;
            }
        };

        const exportResources = async () => {
            try {
                const response = await fetch(`https://exportresources-bv5pfxf6qa-uc.a.run.app?format=${exportFormat.value}`, {
                    method: 'GET',
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `resources.${exportFormat.value}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error("Error exporting resources: ", error);
            }
        };

        return {
            searchQuery,
            categoryFilter,
            categories,
            currentPage,
            totalPages,
            paginatedResources,
            handleSearch,
            clearFilters,
            sortAlphabetically,
            changePage,
            exportFormat,
            exportResources
        };
    }
};
</script>

<style scoped>
.resources-view {
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

.filter-buttons .btn {
    border: 1px solid #4a90e2;
    color: #4a90e2;
}

.filter-buttons .btn:hover {
    background-color: #4a90e2;
    color: white;
}

.export-container {
    text-align: center;
}
</style>