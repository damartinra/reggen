<template>
  <div class="container mb-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="jumbotron pt-4 pb-4 mt-4 mb-4">
          <h1 class="display-3">RegGen</h1>
          <p class="lead">Register Generator</p>
          <hr class="my-4">
          <p>RegGen is a web application designed to generate temporary email accounts and random passwords.</p>
          <p class="lead">
            <router-link
              v-if="!$store.state.isUserLoggedIn"
              class="btn btn-primary btn-lg"
              :to="{name: 'signup'}"
              role="button"
            >Signup</router-link>
            <router-link
              v-if="$store.state.isUserLoggedIn"
              class="btn btn-primary btn-lg"
              :to="{name: 'generator'}"
              role="button"
            >Let's go to generator</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "home"
};
</script>
