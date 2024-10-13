<template>
    <div class="d-flex flex-column min-vh-100">
        <div class="container flex-grow-1 d-flex align-items-center">
            <div class="row justify-content-center w-100">
                <div class="col-md-6 col-lg-4">
                    <h1 class="text-center mb-4">Log Into Your Account</h1>
                    <form @submit.prevent="signin" class="needs-validation" novalidate>
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control" id="email" v-model="email" required
                                placeholder="Email*">
                            <div class="invalid-feedback">Please enter a valid email address.</div>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" class="form-control" id="password" v-model="password" required
                                placeholder="Password*">
                            <div class="invalid-feedback">Please enter your password.</div>
                        </div>
                        <div class="d-grid gap-2">
                            <button type="submit" class="btn btn-primary">Sign In</button>
                            <button type="button" class="btn btn-outline-secondary" disabled>Continue with
                                Google</button>
                            <button type="button" class="btn btn-outline-primary" disabled>Continue with
                                Facebook</button>
                        </div>
                    </form>
                    <p class="text-center mt-3">
                        Don't have an account? <router-link to="/FireRegister">Get started now!</router-link>
                    </p>
                </div>
            </div>
        </div>
        <FooterComponent />
    </div>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";
import FooterComponent from '@/components/FooterComponent.vue';
import { useAuthentication } from '@/router/authentication';

const email = ref("");
const password = ref("");
const router = useRouter();
const auth = getAuth();
const { setAuthStatus } = useAuthentication();

const signin = () => {
    signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            console.log("Firebase Login Successful!");
            const isAdmin = email.value === "admin@gmail.com";
            setAuthStatus(true, isAdmin);
            if (isAdmin) {
                router.push("/admin-dashboard");
            } else {
                router.push("/");
            }
        }).catch((error) => {
            console.error(error.code, error.message);
            alert("Login failed: " + error.message);
        });
};
</script>

<style scoped>
.form-control {
    border-radius: 20px;
}

.btn {
    border-radius: 20px;
    padding: 10px 20px;
}

.btn-primary {
    background-color: #4a90e2;
    border-color: #4a90e2;
}

a {
    color: #4a90e2;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}
</style>