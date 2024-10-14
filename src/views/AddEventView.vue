<template>
    <div>
        <h1>Add New Event</h1>
        <form @submit.prevent="addEvent">
            <div>
                <label for="eventName">Event Name:</label>
                <input type="text" id="eventName" v-model="eventName" required>
            </div>
            <div>
                <label for="eventDate">Event Date:</label>
                <input type="date" id="eventDate" v-model="eventDate" required>
            </div>
            <button type="submit">Add Event</button>
        </form>
    </div>
</template>

<script>
import { ref } from 'vue'
import { db } from '@/firebase/init'
import { collection, addDoc } from 'firebase/firestore'

export default {
    setup() {
        const eventName = ref('')
        const eventDate = ref('')

        const addEvent = async () => {
            try {
                await addDoc(collection(db, "events"), {
                    name: eventName.value,
                    date: eventDate.value
                })
                console.log("Event added successfully")
                eventName.value = ''
                eventDate.value = ''
            } catch (error) {
                console.error("Error adding event: ", error)
            }
        }

        return {
            eventName,
            eventDate,
            addEvent
        }
    }
}
</script>