<template>
  <div class="signup">
    <div class="container pb-5">
      <div class="row">
        <div class="col-md-6 offset-md-3 mt-4 mb-4">
          <div v-if="signupOk" class="text-center mb-5">
            <img src="../assets/loading.svg" alt="loading">
          </div>
          <div class="card border-primary mb-3">
            <div class="card-header">
              <h1>Signup</h1>
            </div>
            <div class="card-body">
              <div v-if="errorMessage" class="alert alert-danger mt-1" role="alert">{{errorMessage}}</div>
              <div
                v-if="successMessage"
                class="alert alert-success mt-1"
                role="alert"
              >{{successMessage}}</div>
              <form @submit.prevent="signup">
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
                  >Username must have between 3-30 characters and can only contain letters and numbers.</small>
                </div>
                <div class="form-group">
                  <label for="email">Email (optional, but it is recommended!)</label>
                  <input
                    v-model="user.email"
                    type="email"
                    class="form-control"
                    id="email"
                    aria-describedby="emailHelpId"
                    placeholder="Email"
                  >
                  <small
                    id="emailHelpId"
                    class="form-text text-muted"
                  >Email must have an email format (e.g. address@domain.com).</small>
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
                  >Password must have at least 8 characters, and must contain at least one lowercase, one uppercase and one number, and can't contain whitespaces.</small>
                </div>
                <div class="form-group">
                  <label for="confirmPassword">Confirm password</label>
                  <input
                    v-model="user.confirmPassword"
                    type="password"
                    class="form-control"
                    id="confirmPassword"
                    aria-describedby="confirmPasswordHelp"
                    placeholder="Password"
                    required
                  >
                  <small
                    id="confirmPasswordHelp"
                    class="form-text text-muted"
                  >Confirm your password.</small>
                </div>
                <button type="submit" class="btn btn-primary btn-block">Signup</button>
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
  constructor(username, email, password, confirmPassword) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.confirmPassword = confirmPassword;
  }
}

const signupSchema = Joi.object().keys({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  email: Joi.string()
    .email()
    .allow("")
    .optional(),
  password: Joi.string()
    .regex(/(^(?!.*[\s])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]))/)
    .min(8)
    .required(),
  confirmPassword: Joi.string()
    .regex(/(^(?!.*[\s])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]))/)
    .min(8)
    .required()
});

export default {
  data() {
    return {
      errorMessage: "",
      successMessage: "",
      signupOk: false,
      user: new User()
    };
  },
  methods: {
    signup() {
      this.errorMessage = "";
      this.successMessage = "";
      if (this.validUser()) {
        fetch("http://localhost:3000/user/signup", {
          method: "POST",
          body: JSON.stringify(this.user),
          headers: {
            Accept: "application/json",
            "content-type": "application/json"
          }
        })
          .then(response => {
            if (response.ok) {
              this.successMessage = "Registered successfully!";
              this.signupOk = true;
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
      if (this.user.password !== this.user.confirmPassword) {
        this.errorMessage = "Passwords must match!";
        return false;
      }
      const result = Joi.validate(this.user, signupSchema);
      if (result.error === null) {
        return true;
      }
      if (result.error.message.includes("username")) {
        this.errorMessage = "Username is invalid!";
      }
      if (result.error.message.includes("email")) {
        this.errorMessage = "Email is invalid!";
      }
      if (result.error.message.includes("password")) {
        this.errorMessage = "Password is invalid!";
      }
    }
  }
};
</script>