
Vue.createApp ({
  data() {
    dogImage:''
  },

  mounted() {
    this.fetchDog();
  },

  methods() {
    fetchDog() {
      fetch('https://dog.ceo/api/breeds/image/random')
        .then
    }
  }
}).mount('#dogApp')