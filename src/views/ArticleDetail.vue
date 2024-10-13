<template>
  <div class="container my-5">
    <div class="row">
      <div class="col-md-8">
        <!-- Article Image -->
        <img :src="article.image" alt="Article Image" class="img-fluid mb-4">

        <!-- Article Content -->
        <h1 class="display-4">{{ article.title }}</h1>
        <p class="lead">{{ article.content }}</p>
  
        <!-- Rating System -->
        <div class="rating-section mt-4">
          <h3>Rate this Article</h3>
          <div class="d-flex">
            <button
              v-for="star in maxRating"
              :key="star"
              class="btn"
              :class="{'btn-primary': rating >= star, 'btn-outline-primary': rating < star}"
              @click="setRating(star)"
            >
              <i class="fas fa-star"></i>
            </button>
          </div>
          <p class="mt-2">Your Rating: {{ rating }} / {{ maxRating }}</p>
          <p class="mt-2">Average Rating: {{ averageRating }} / {{ maxRating }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
  import { ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  const articleId = route.params.id
  
  const articles = [
    { id: '1', title: 'Global Mental Health Report', content: 'Details about the global mental health report.', image: '../images/article1.png' },
    { id: '2', title: 'The Rise of Online Therapy', content: 'Details about online therapy.', image: '../images/article2.png' },
    { id: '3', title: 'Building Mental Resilience', content: 'Details about building mental resilience.', image: '../images/article3.png' }
  ]
  
  const article = ref(articles.find(a => a.id === articleId) || { title: '', content: '', image: '' })
  
  const rating = ref(0)
  const maxRating = 5
  
  // Get average rating from localStorage, or set a default value
  const getAverageRating = () => {
    const storedRatings = JSON.parse(localStorage.getItem(`article-${articleId}-ratings`) || '[]')
    if (storedRatings.length === 0) return 4.2 // Default value
    const total = storedRatings.reduce((sum, rating) => sum + rating, 0)
    return (total / storedRatings.length).toFixed(1)
  }
  
  const averageRating = computed(() => getAverageRating())
  
  const setRating = (star) => {
    rating.value = star
    // Save the rating to localStorage
    let ratings = JSON.parse(localStorage.getItem(`article-${articleId}-ratings`) || '[]')
    ratings.push(star)
    localStorage.setItem(`article-${articleId}-ratings`, JSON.stringify(ratings))
  }
</script>
  
<style scoped>
  .rating-section {
    border-top: 1px solid #ddd;
    padding-top: 10px;
  }
  
  .rating-section .btn {
    font-size: 1.5rem;
    cursor: pointer;
  }
  
  .rating-section .btn-primary {
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
  }
  
  .rating-section .btn-outline-primary {
    color: #007bff;
    border-color: #007bff;
  }
  
  .rating-section .btn-primary:hover {
    background-color: #0056b3;
    border-color: #004085;
  }
  
  .rating-section .btn-outline-primary:hover {
    background-color: #e2e6ea;
    border-color: #dae0e5;
  }
</style>
