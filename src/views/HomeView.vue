<template>
  <div class="home">
    <main>
      <!-- Main Content Section -->
      <section class="container-fluid p-0" aria-label="Hero section">
        <div class="position-relative">
          <div class="image-container">
            <img src="../images/homepage1.png" alt="A serene landscape representing mental health and well-being"
              class="img-fluid w-100">
          </div>
          <div class="position-absolute top-50 start-50 translate-middle text-center text-white">
            <h1 class="display-4 fw-bold">Your Mental Health Matters</h1>
            <div class="mt-4">
              <div class="input-group">
                <label for="search-input" class="visually-hidden">Search</label>
                <input type="text" id="search-input" class="form-control" placeholder="Search..."
                  aria-label="Search input">
                <button class="btn btn-primary" type="button" aria-label="Perform search">Search</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- News Section -->
      <section class="container my-5" aria-labelledby="latest-news-heading">
        <h2 id="latest-news-heading" class="text-center mb-4">LATEST NEWS</h2>
        <div class="row">
          <article class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <h3 class="card-title h4">Global Mental Health Report: Surge in Mental Health Issues Post-Pandemic</h3>
                <p class="card-text">September 2, 2024 — The United Nations Mental Health Commission has released a
                  report indicating a significant increase in mental health issues globally following the COVID-19
                  pandemic. The report highlights a notable rise in anxiety, depression, and stress symptoms across many
                  countries. It calls on governments to invest more in mental health resources and improve the
                  accessibility and quality of mental health services.</p>
                <router-link to="/Resources" class="btn btn-primary mt-auto"
                  aria-label="Read more about Global Mental Health Report">Read More</router-link>
              </div>
            </div>
          </article>
          <article class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <h3 class="card-title h4">Breakthrough in Youth Mental Health Program</h3>
                <p class="card-text">September 2, 2024 — Recent research shows that the youth mental health program
                  "Teen Voices" has successfully reduced anxiety and depression symptoms by 60%. The program offers
                  online counseling and support groups for individuals aged 12 to 25.</p>
                <router-link to="/Resources" class="btn btn-primary mt-auto"
                  aria-label="Read more about Youth Mental Health Program">Read More</router-link>
              </div>
            </div>
          </article>
          <article class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <h3 class="card-title h4">New Support Program for Senior Mental Health</h3>
                <p class="card-text">September 1, 2024 — A new support program targeting senior citizens has been
                  launched to address mental health issues such as loneliness and depression. The program includes
                  regular check-ins, online counseling, and community activities designed to enhance social connections
                  and mental well-being.</p>
                <router-link to="/Resources" class="btn btn-primary mt-auto"
                  aria-label="Read more about Senior Mental Health Program">Read More</router-link>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- Mental Health Library Section -->
      <section class="bg-light py-5" aria-labelledby="library-heading">
        <div class="container">
          <h2 id="library-heading" class="text-center mb-4">MENTAL HEALTH LIBRARY</h2>
          <div class="row align-items-center">
            <div class="col-md-6 mb-4 mb-md-0">
              <img src="../images/library1.jpg" alt="Illustration of a digital library with mental health resources"
                class="img-fluid rounded">
            </div>
            <div class="col-md-6">
              <h3 class="h4 mb-3">Comprehensive Resources at Your Fingertips</h3>
              <p>Explore our extensive collection of articles, research papers, and self-help guides. Our mental health
                library is designed to provide you with reliable information on various mental health topics.</p>
              <router-link to="/library" class="btn btn-primary" aria-label="Explore our Mental Health Library">Explore
                Library</router-link>
            </div>
          </div>
        </div>
      </section>

      <!-- List of Psychotherapists -->
      <section class="bg-secondary py-5" aria-labelledby="psychotherapist-heading">
        <div class="container">
          <h2 id="psychotherapist-heading" class="text-center mb-4">FIND A PSYCHOTHERAPIST</h2>
          <div class="row align-items-center">
            <div class="col-md-6 order-md-2 mb-4 mb-md-0">
              <img src="../images/therapists1.jpg" alt="Group of diverse psychotherapists ready to help"
                class="img-fluid rounded">
            </div>
            <div class="col-md-6 order-md-1">
              <h3 class="h4 mb-3">Expert Support for Your Mental Health Journey</h3>
              <p>Connect with our network of qualified psychotherapists specializing in various areas of mental health.
                Our professionals are here to provide personalized care and support to help you on your path to
                wellbeing.</p>
              <router-link to="/all-therapists" class="btn btn-primary" aria-label="View list of all therapists">View
                All Therapists</router-link>
            </div>
          </div>
        </div>
      </section>

      <!-- Mental Health Services -->
      <MentalHealthServices />

      <!-- Footer Section -->
      <FooterComponent />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthentication } from '../router/authentication'
import MentalHealthServices from '../views/MentalHealthServices.vue'
import FooterComponent from '../components/FooterComponent.vue'

const router = useRouter()
const { isAuthenticated } = useAuthentication()
</script>

<style scoped>
.home {
  font-family: Arial, sans-serif;
}

h2 {
  color: #5E93DB;
  font-weight: bold;
  text-shadow: 0.125rem 0.125rem 0.25rem rgba(0, 0, 0, 0.5);
}

.image-container {
  height: 400px;
  overflow: hidden;
}

.image-container img {
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: 100%;
}

.card-title {
  color: #5E93DB;
  font-weight: bold;
  text-shadow: 0.125rem 0.125rem 0.25rem rgba(115, 169, 227, 0.5);
}

.btn-primary {
  background-color: #005595;
  border-color: #005595;
}

.btn-primary:hover {
  background-color: #004080;
  border-color: #004080;
}

/* Add focus styles to improve visibility of keyboard navigation */
a:focus,
button:focus,
input:focus {
  outline: 2px solid #005595;
  outline-offset: 2px;
}

/* Ensure that the text has sufficient contrast against different backgrounds */
.bg-secondary {
  background-color: #6c757d !important;
  color: #ffffff;
}

.bg-secondary h2,
.bg-secondary h3,
.bg-secondary p {
  color: #ffffff;
}

/* Add visualization hidden classes */
.visually-hidden {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .image-container {
    height: 300px;
  }

  h1.display-4 {
    font-size: 2rem;
  }
}
</style>