<template>
  <div class="rating">
    <div class="stars">
      <i 
        v-for="star in 5" 
        :key="star" 
        :class="['fa-star', { 'fas': star <= userRating, 'far': star > userRating }]" 
        @click="rate(star)"
      ></i>
    </div>
    <p class="rating-feedback">Average Rating: {{ averageRating.toFixed(1) }} / 5</p>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'

export default {
  name: 'RatingComponent',
  props: {
    initialRating: {
      type: Number,
      default: 0
    },
    userId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const userRating = ref(0)
    const ratings = ref([])

    // Initialize ratings from local storage
    onMounted(() => {
      const storedRatings = JSON.parse(localStorage.getItem('ratings') || '{}')
      ratings.value = storedRatings[props.userId] || []
      userRating.value = ratings.value.length ? ratings.value[ratings.value.length - 1] : props.initialRating
    })

    // Compute average rating
    const averageRating = computed(() => {
      if (ratings.value.length === 0) return 0
      const total = ratings.value.reduce((sum, rating) => sum + rating, 0)
      return total / ratings.value.length
    })

    // Rate the item
    const rate = (star) => {
      userRating.value = star
      ratings.value.push(star)
      updateLocalStorage()
    }

    // Update local storage with the current user's ratings
    const updateLocalStorage = () => {
      const storedRatings = JSON.parse(localStorage.getItem('ratings') || '{}')
      storedRatings[props.userId] = ratings.value
      localStorage.setItem('ratings', JSON.stringify(storedRatings))
    }

    // Watch for changes and update local storage
    watch(userRating, (newRating) => {
      updateLocalStorage()
    })

    return {
      userRating,
      averageRating,
      rate
    }
  }
}
</script>

<style scoped>
.rating {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stars {
  font-size: 2rem;
}

.fas {
  color: gold;
  cursor: pointer;
}

.far {
  color: lightgray;
}

.rating-feedback {
  margin-top: 0.5rem;
}
</style>
