<template>
    <div class="container mt-5">
        <h1 class="text-center mb-4">Add New Event</h1>
        <form @submit.prevent="addEvent" class="max-w-md mx-auto">
            <div class="mb-3">
                <label for="eventName" class="form-label">Event Name:</label>
                <input type="text" id="eventName" v-model="eventName" required class="form-control">
            </div>
            <div class="mb-3">
                <label for="details" class="form-label">Details:</label>
                <textarea id="details" v-model="details" required class="form-control"></textarea>
            </div>
            <div class="mb-3">
                <label for="date" class="form-label">Date:</label>
                <input type="date" id="date" v-model="date" required class="form-control" max="9999-12-31">
            </div>
            <div class="mb-3">
                <label for="location" class="form-label">Location:</label>
                <input type="text" id="location" v-model="location" required class="form-control">
            </div>
            <div class="mb-3">
                <label for="status" class="form-label">Status:</label>
                <select id="status" v-model="status" required class="form-select">
                    <option value="Open">Open</option>
                    <option value="Full">Full</option>
                    <option value="Canceled">Canceled</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary w-100">Add Event</button>
        </form>

        <!-- Success Message -->
        <div v-if="showSuccessMessage" class="message success">
            Event added successfully!
            <button @click="showSuccessMessage = false" class="close-btn">&times;</button>
        </div>

        <!-- Error Message -->
        <div v-if="showErrorMessage" class="message error">
            Error adding event. Please try again.
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
        const eventName = ref('')
        const details = ref('')
        const date = ref('')
        const location = ref('')
        const status = ref('Open')
        const showSuccessMessage = ref(false)
        const showErrorMessage = ref(false)

        const addEvent = async () => {
            try {
                await addDoc(collection(db, "events"), {
                    eventName: eventName.value,
                    details: details.value,
                    date: date.value,
                    location: location.value,
                    status: status.value
                })
                console.log("Event added successfully")
                // Clear the form
                eventName.value = ''
                details.value = ''
                date.value = ''
                location.value = ''
                status.value = 'Open'
                // Show success message
                showSuccessMessage.value = true
                setTimeout(() => {
                    showSuccessMessage.value = false
                }, 3000) // Hide after 3 seconds
            } catch (error) {
                console.error("Error adding event: ", error)
                // Show error message
                showErrorMessage.value = true
                setTimeout(() => {
                    showErrorMessage.value = false
                }, 3000) // Hide after 3 seconds
            }
        }

        return {
            eventName,
            details,
            date,
            location,
            status,
            addEvent,
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