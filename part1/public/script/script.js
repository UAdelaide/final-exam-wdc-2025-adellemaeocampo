
Vue.createApp ({
  data() {
    dogImage:''
  },

  mounted() {

  },

  methods() {
    fetchDog() {
      fetch('https://dog.ceo/api/breeds/image/random')
    }
  }
}).mount('#dogApp')