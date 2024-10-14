<template>
    <div class="container mt-5">
        <h1 class="text-center mb-4">Add New Resource</h1>
        <form @submit.prevent="addResource" class="max-w-md mx-auto">
            <div class="mb-3">
                <label for="resourceName" class="form-label">Resource Name:</label>
                <input type="text" id="resourceName" v-model="resourceName" required class="form-control">
            </div>
            <div class="mb-3">
                <label for="description" class="form-label">Description:</label>
                <textarea id="description" v-model="description" required class="form-control"></textarea>
            </div>
            <div class="mb-3">
                <label for="category" class="form-label">Category:</label>
                <select id="category" v-model="category" required class="form-select">
                    <option value="Self-help">Self-help</option>
                    <option value="Professional Support">Professional Support</option>
                    <option value="Crisis Intervention">Crisis Intervention</option>
                    <option value="Community Resources">Community Resources</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="accessLink" class="form-label">Access Link:</label>
                <input type="url" id="accessLink" v-model="accessLink" required class="form-control">
            </div>
            <button type="submit" class="btn btn-primary w-100">Add Resource</button>
        </form>

        <!-- Success Message -->
        <div v-if="showSuccessMessage" class="message success">
            Resource added successfully!
            <button @click="showSuccessMessage = false" class="close-btn">&times;</button>
        </div>

        <!-- Error Message -->
        <div v-if="showErrorMessage" class="message error">
            Error adding resource. Please try again.
            <button @click="showErrorMessage = false" class="close-btn">&times;</button>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { db } from '@/firebase/init'
import { collection, addDoc } from 'firebase/firestore'

export default {
    setup() {
        const resourceName = ref('')
        const description = ref('')
        const category = ref('Self-help')
        const accessLink = ref('')
        const showSuccessMessage = ref(false)
        const showErrorMessage = ref(false)

        const addResource = async () => {
            try {
                await addDoc(collection(db, "resources"), {
                    resourceName: resourceName.value,
                    description: description.value,
                    category: category.value,
                    accessLink: accessLink.value
                })
                console.log("Resource added successfully")
                // Clear the form
                resourceName.value = ''
                description.value = ''
                category.value = 'Self-help'
                accessLink.value = ''
                // Show success message
                showSuccessMessage.value = true
                setTimeout(() => {
                    showSuccessMessage.value = false
                }, 3000) // Hide after 3 seconds
            } catch (error) {
                console.error("Error adding resource: ", error)
                // Show error message
                showErrorMessage.value = true
                setTimeout(() => {
                    showErrorMessage.value = false
                }, 3000) // Hide after 3 seconds
            }
        }

        return {
            resourceName,
            description,
            category,
            accessLink,
            addResource,
            showSuccessMessage,
            showErrorMessage
        }
    }
}
</script>

<style scoped>
.message {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    border-radius: 4px;
    color: white;
    font-weight: bold;
    z-index: 1000;
}

.success {
    background-color: #28a745;
}

.error {
    background-color: #dc3545;
}

.close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    float: right;
    margin-left: 10px;
}
</style>