<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <h1 class="text-center mb-4">W7. Create an Account</h1>
                <form @submit.prevent="register" class="narrow-form">
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control bg-white" id="email" v-model="email" required
                            placeholder="Enter your email">
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" class="form-control bg-white" id="password" v-model="password" required
                            placeholder="Enter your password">
                    </div>
                    <div class="d-flex justify-content-center gap-2">
                        <button type="submit" class="btn btn-primary">Save to Firebase</button>
                        <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const router = useRouter();
const auth = getAuth();

const register = () => {
    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((data) => {
            console.log("Firebase Register Successful!");
            alert("Registration successful!")
            router.push("/FireLogin");
        }).catch((error) => {
            console.log(error.code)
            alert("Registration failed!")
        });
};

const clearForm = () => {
    email.value = "";
    password.value = "";
};
</script>

<style scoped>
.narrow-form {
    max-width: 300px;
    margin: 0 auto;
}

.form-control {
    border: 1px solid #ced4da;
}

.btn-primary {
    background-color: #275fda;
    border-color: #4285f4;
}

.btn-primary:hover {
    background-color: #1c4cb3;
    border-color: #1c4cb3;
}

.btn-secondary {
    background-color: #6c757d;
    border-color: #6c757d;
}

.btn-secondary:hover {
    background-color: #5a6268;
    border-color: #5a6268;
}
</style>