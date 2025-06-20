
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
        .then(res=>res.json())
        .then(data=> {

        });
    }
  }
}).mount('#dogApp')