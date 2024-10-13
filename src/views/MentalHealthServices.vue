<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <h2 class="text-center mb-4">Mental health services for:</h2>
        <div class="accordion" id="servicesAccordion">
          <div v-for="(service, index) in services" :key="index" class="accordion-item">
            <h2 class="accordion-header" :id="'heading' + index">
              <button class="accordion-button" :class="{ collapsed: !service.isOpen }" type="button" 
                      @click="toggleService(index)" :aria-expanded="service.isOpen" 
                      :aria-controls="'collapse' + index">
                {{ service.name }}
              </button>
            </h2>
            <div :id="'collapse' + index" class="accordion-collapse collapse" :class="{ show: service.isOpen }"
                 :aria-labelledby="'heading' + index" data-bs-parent="#servicesAccordion">
              <div class="accordion-body">
                <div v-for="(item, itemIndex) in service.content" :key="itemIndex">
                  <h4 class="text-primary">{{ item.title }}</h4>
                  <p>{{ item.description }}</p>
                  <p v-if="item.phone">Call: <a :href="`tel:${item.phone}`">{{ item.phone }}</a></p>
                  <p v-if="item.website">
                    <a :href="item.website" target="_blank" rel="noopener noreferrer">
                      {{ item.websiteText || item.website }}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const services = ref([
  {
    name: 'Everyone',
    isOpen: false,
    content: [
      {
        title: 'General Services',
        description: 'Mental health services available to all members of the community.',
      }
    ]
  },
  {
    name: 'Families',
    isOpen: false,
    content: [
      {
        title: 'Family Support',
        description: 'Counseling and support services for families dealing with mental health challenges.',
      }
    ]
  },
  {
    name: 'Young people',
    isOpen: false,
    content: [
      {
        title: 'Kids Helpline',
        description: 'Free confidential 24-hour telephone and online counselling service for young people aged 5 to 25 years.',
        phone: '1800 55 1800',
        website: 'https://kidshelpline.com.au/teens',
        websiteText: 'kidshelpline.com.au/teens'
      },
      {
        title: 'headspace services',
        description: 'Providing mental health services for young people aged 12-25. Chat at a centre, online, by email, or speak on the phone with a qualified professional.',
        phone: '1800 650 890',
        website: 'https://headspace.org.au/eheadspace',
        websiteText: 'headspace.org.au/eheadspace'
      }
    ]
  },
])

const toggleService = (index) => {
  services.value[index].isOpen = !services.value[index].isOpen
}

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.accordion-button:not(.collapsed) {
  background-color: #e7f1ff;
  color: #0c63e4;
}

.accordion-button:focus {
  box-shadow: none;
}

h4 {
  color: #005595;
}

a {
  color: #005595;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>