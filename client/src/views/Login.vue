<template>
  <div class="login">
    <div class="container pb-5">
      <div class="row">
        <div class="col-md-6 offset-md-3 mt-4 mb-4">
          <div v-if="loginOk" class="text-center mb-5">
            <img src="../assets/loading.svg" alt="loading">
          </div>
          <div class="card border-primary mb-3">
            <div class="card-header">
              <h1>Login</h1>
            </div>
            <div class="card-body">
              <div v-if="errorMessage" class="alert alert-danger mt-1" role="alert">{{errorMessage}}</div>
              <div
                v-if="successMessage"
                class="alert alert-success mt-1"
                role="alert"
              >{{successMessage}}</div>
              <form v-if="!loginOk" @submit.prevent="login">
                <div class="form-group">
                  <label for="username">Username</label>
                  <input
                    v-model="user.username"
                    type="text"
                    class="form-control"
                    id="username"
                    aria-describedby="usernameHelp"
                    placeholder="Username"
                    required
                  >
                  <small
                    id="usernameHelp"
                    class="form-text text-muted"
                  >Enter your username to login.</small>
                </div>
                <div class="form-group">
                  <label for="password">Password</label>
                  <input
                    v-model="user.password"
                    type="password"
                    class="form-control"
                    id="password"
                    aria-describedby="passwordHelp"
                    placeholder="Password"
                    required
                  >
                  <small
                    id="passwordHelp"
                    class="form-text text-muted"
                  >Enter your password to login.</small>
                </div>
                <button type="submit" class="btn btn-primary btn-block mt-3">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Joi from "joi";

class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }
}

const joiSchema = Joi.object().keys({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  password: Joi.string()
    .regex(/(^(?!.*[\s])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]))/)
    .min(8)
    .required()
});

export default {
  data() {
    return {
      errorMessage: "",
      successMessage: "",
      loginOk: false,
      user: new User()
    };
  },
  methods: {
    login() {
      this.errorMessage = "";
      if (this.validUser()) {
        fetch("http://localhost:3000/user/login", {
          method: "POST",
          body: JSON.stringify(this.user),
          headers: {
            Accept: "application/json",
            "content-type": "application/json"
          }
        })
          .then(response => {
            if (response.ok) {
              this.successMessage = "Logged successfully!";
              this.loginOk = true;
              return response.json();
            }
            return response.json().then(error => {
              throw new Error(error.message);
            });
          })
          .then(result => {
            localStorage.token = result.token;
            setTimeout(() => {
              this.$store.dispatch("setToken", result.token);
              this.$router.push("/profile");
            }, 1000);
          })
          .catch(error => {
            this.errorMessage = error.message;
          });
      }
    },
    validUser() {
      const result = Joi.validate(this.user, joiSchema);
      if (result.error === null) {
        return true;
      }
      if (result.error.message.includes("username")) {
        this.errorMessage = "Username is invalid!";
      } else {
        this.errorMessage = "Password is invalid!";
      }
    }
  }
};
</script>