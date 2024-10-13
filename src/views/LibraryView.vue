<template>
  <div class="container my-5">
    <h1 class="display-4 text-center mb-4">Mental Health Library</h1>
    <div class="row">
      <!-- Article Card 1 -->
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <img src="../images/article1.png" class="card-img-top" alt="Article 1">
          <div class="card-body">
            <h5 class="card-title">Global Mental Health Report</h5>
            <p class="card-text">
              The United Nations Mental Health Commission has released a report indicating a significant increase in mental health issues globally following the COVID-19 pandemic. The report highlights a notable rise in anxiety, depression, and stress symptoms across many countries.
            </p>
            <router-link :to="{ name: 'ArticleDetail', params: { id: '1' } }" class="btn btn-primary">Read More</router-link>
          </div>
        </div>
      </div>

      <!-- Article Card 2 -->
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <img src="../images/article2.png" class="card-img-top" alt="Article 2">
          <div class="card-body">
            <h5 class="card-title">The Rise of Online Therapy</h5>
            <p class="card-text">
              Online therapy has become increasingly popular as it offers flexibility and accessibility for individuals seeking mental health support. This article explores the benefits and challenges of online therapy.
            </p>
            <router-link :to="{ name: 'ArticleDetail', params: { id: '2' } }" class="btn btn-primary">Read More</router-link>
          </div>
        </div>
      </div>

      <!-- Article Card 3 -->
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <img src="../images/article3.png" class="card-img-top" alt="Article 3">
          <div class="card-body">
            <h5 class="card-title">Building Mental Resilience</h5>
            <p class="card-text">
              Developing mental resilience is essential for coping with stress and adversity. This article provides practical tips and strategies for building and maintaining mental resilience.
            </p>
            <router-link :to="{ name: 'ArticleDetail', params: { id: '3' } }" class="btn btn-primary">Read More</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>
.card-img-top {
  height: 180px;
  object-fit: cover;
}
</style>
