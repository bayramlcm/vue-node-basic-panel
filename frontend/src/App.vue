<template>
  <v-app>
    <Navbar v-if="hideNavbar" />
    <v-content class="mx-4 mb-4 mt-4">
      <router-view></router-view>
      <Notification />
    </v-content>

  </v-app>
</template>

<script>
import Navbar from './components/Navbar.vue';
import Notification from './components/Notification.vue';

export default {
  name: 'App',
  components: {
    Navbar,
    Notification
  },
  data: () => ({
    
  }),
  computed: {
    hideNavbar() {
      return !['/login', '/logout']
        .includes(this.$route.path.toLowerCase());
    },
  },
};
</script>
