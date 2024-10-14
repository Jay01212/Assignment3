<template>
    <div class="send-email-view">
        <h1 class="text-center mb-4">Send Email</h1>

        <form @submit.prevent="sendEmail" class="email-form">
            <div class="mb-3">
                <label for="to" class="form-label">Recipient Email:</label>
                <input type="email" id="to" v-model="to" required class="form-control">
            </div>
            <div class="mb-3">
                <label for="subject" class="form-label">Subject:</label>
                <input type="text" id="subject" v-model="subject" required class="form-control">
            </div>
            <div class="mb-3">
                <label for="text" class="form-label">Message:</label>
                <textarea id="text" v-model="text" required class="form-control" rows="5"></textarea>
            </div>
            <div class="mb-3">
                <label for="attachment" class="form-label">Attachment (PDF only):</label>
                <input type="file" id="attachment" @change="handleFileUpload" accept=".pdf" class="form-control">
            </div>
            <button type="submit" class="btn btn-primary" :disabled="sending">
                {{ sending ? 'Sending...' : 'Send Email' }}
            </button>
        </form>

        <div v-if="showSuccessMessage" class="alert alert-success mt-3" role="alert">
            Email sent successfully!
            <button type="button" class="btn-close" @click="showSuccessMessage = false" aria-label="Close"></button>
        </div>
        <div v-if="showErrorMessage" class="alert alert-danger mt-3" role="alert">
            Failed to send email: {{ errorMessage }}
            <button type="button" class="btn-close" @click="showErrorMessage = false" aria-label="Close"></button>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    name: 'SendEmailView',
    setup() {
        const to = ref('');
        const subject = ref('');
        const text = ref('');
        const attachment = ref(null);
        const sending = ref(false);
        const showSuccessMessage = ref(false);
        const showErrorMessage = ref(false);
        const errorMessage = ref('');

        const handleFileUpload = (event) => {
            const file = event.target.files[0];
            if (file && file.type === 'application/pdf') {
                attachment.value = file;
            } else {
                alert('Please select a PDF file.');
                event.target.value = '';
            }
        };

        const sendEmail = async () => {
            sending.value = true;
            showSuccessMessage.value = false;
            showErrorMessage.value = false;
            errorMessage.value = '';

            try {
                let attachmentData = null;
                if (attachment.value) {
                    attachmentData = await readFileAsBase64(attachment.value);
                }

                const response = await fetch(`https://sendemail-bv5pfxf6qa-uc.a.run.app`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        to: to.value,
                        subject: subject.value,
                        text: text.value,
                        attachment: attachmentData ? {
                            content: attachmentData,
                            filename: attachment.value.name,
                            type: 'application/pdf',
                            disposition: 'attachment'
                        } : null
                    }),
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || `HTTP error! status: ${response.status}`);
                }

                if (result.success) {
                    showSuccessMessage.value = true;
                    resetForm();
                } else {
                    throw new Error(result.error || 'Failed to send email');
                }
            } catch (error) {
                console.error('Error sending email:', error);
                showErrorMessage.value = true;
                errorMessage.value = error.message || 'An unexpected error occurred';
            } finally {
                sending.value = false;
            }
        };

        const readFileAsBase64 = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result.split(',')[1]);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        };

        const resetForm = () => {
            to.value = '';
            subject.value = '';
            text.value = '';
            attachment.value = null;
        };

        return {
            to,
            subject,
            text,
            attachment,
            sending,
            showSuccessMessage,
            showErrorMessage,
            errorMessage,
            handleFileUpload,
            sendEmail
        };
    }
};
</script>

<style scoped>
.send-email-view {
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    color: #4a90e2;
    font-size: 2.5rem;
}

.email-form {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-label {
    font-weight: bold;
}

.form-control {
    border-radius: 4px;
    border: 1px solid #ced4da;
}

.btn-primary {
    background-color: #4a90e2;
    border-color: #4a90e2;
    border-radius: 4px;
}

.btn-primary:hover {
    background-color: #3a7bc8;
    border-color: #3a7bc8;
}

.alert {
    border-radius: 4px;
}

.btn-close {
    font-size: 0.8rem;
}
</style>