<template>
  <div id="app">
    <!--NAVBAR-->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4" style="font-size: 1em;">
      <span class="navbar-brand ml-5 mb-0 h1">RegGen</span>
      <button
        class="navbar-toggler mr-3"
        type="button"
        data-toggle="collapse"
        data-target="#navbarColor01"
        aria-controls="navbarColor01"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarColor01">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link class="nav-link ml-1" :to="{name: 'home'}">
              Home
              <span class="sr-only">(current)</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link ml-1" :to="{name: 'generator'}">Generator</router-link>
          </li>
        </ul>
        <ul class="navbar-nav ml-auto mr-3">
          <li v-if="!$store.state.isUserLoggedIn" class="nav-item ml-1">
            <router-link class="nav-link" :to="{name: 'login'}">Login</router-link>
          </li>
          <li v-if="!$store.state.isUserLoggedIn" class="nav-item ml-1">
            <router-link class="nav-link" :to="{name: 'signup'}">Signup</router-link>
          </li>
          <li v-if="$store.state.isUserLoggedIn" class="nav-item ml-1">
            <router-link class="nav-link" :to="{name: 'registers'}">Registers</router-link>
          </li>
          <li v-if="$store.state.isUserLoggedIn && this.$store.state.role == 'admin'" class="nav-item ml-1">
            <router-link class="nav-link" :to="{name: 'admin'}">Admin</router-link>
          </li>
          <li v-if="$store.state.isUserLoggedIn" class="nav-item dropdown ml-1">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >{{this.$store.state.user}}</a>
            <div class="dropdown-menu dropdown-menu-right" style="margin-top: 0.20em" aria-labelledby="navbarDropdown">
              <router-link class="dropdown-item" :to="{name: 'profile'}">
                <i class="fas fa-user-alt"></i> Profile
              </router-link>
              <div class="dropdown-divider"></div>
              <a @click="logout" class="dropdown-item" href="#">
                <i class="fas fa-sign-out-alt"></i> Logout
              </a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
    <!--/NAVBAR-->
    <!--FOOTER-->
    <nav class="navbar fixed-bottom navbar-expand-lg navbar-dark bg-dark" style="font-size: 0.9em;">
      <span class="navbar-text m-auto">
        App web created by
        <a href="mailto:david.mr@usal.es">David MR</a>.
      </span>
    </nav>
    <!--/FOOTER-->
    <router-view/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      role: ""
    };
  },
  mounted() {
    this.username = this.$store.state.user;
  },
  methods: {
    logout() {
      this.$store.dispatch("setUser", "");
      this.$store.dispatch("setRole", "");
      this.$store.dispatch("setToken", false);
      localStorage.removeItem("token");
      this.$router.push("/login");
    }
  }
};
</script>

<style>
.dropdown-menu {
  background-color: #df691a !important;
  border-top: 1px solid #be5916 !important;
  border-right: 0px !important;
  border-bottom: 0px !important;
  border-left: 0px !important;
}
.dropdown-item {
  background-color: #df691a !important;
  font-size: 1em !important;
}
.dropdown-item:hover {
  background-color: #df691a !important;
  font-size: 1em !important;
  color: white !important;
}
</style>
