<template>
  <footer class="footer mt-auto py-3 border-top">
    <div class="container text-center">
      <nav class="mb-3">
        <router-link to="/terms" class="text-muted text-decoration-none mx-2">Terms of Use</router-link> |
        <router-link to="/privacy" class="text-muted text-decoration-none mx-2">Privacy Policy</router-link> |
        <router-link to="/support" class="text-muted text-decoration-none mx-2">Support</router-link> |
        <router-link to="/contact" class="text-muted text-decoration-none mx-2">Contact Us</router-link>
      </nav>
      <p class="text-muted small mb-0">&copy; Copyright 2024 MindCare.com Group, Inc. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent'
}
</script>

<style scoped>
.footer {
  background-color: #f8f9fa;
  color: #666;
}

.footer a {
  color: #666;
}

.footer a:hover {
  text-decoration: underline !important;
}
</style>
