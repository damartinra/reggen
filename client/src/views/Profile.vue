<template>
  <div class="signup">
    <div class="container pb-5">
      <div class="row">
        <div class="col-md-6 offset-md-3 mt-4 mb-4">
          <h1>
            <i class="fas fa-user fa-lg"></i> Profile
          </h1>
          <div class="alert alert-warning alert-dismissible fade show mt-4" role="alert">
            Warning! If you change any data, the session will be closed.
            <button
              type="button"
              class="close"
              data-dismiss="alert"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <hr class="mt-4 mb-4">
          <!--ACCOUNT FORM-->
          <h3 class="mb-3">Account</h3>

          <div
            v-if="infoAccount"
            class="alert alert-success alert-dismissible fade show"
            role="alert"
          >
            {{infoAccount}}
            <button
              type="button"
              class="close"
              data-dismiss="alert"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div
            v-if="errorAccount"
            class="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {{errorAccount}}
            <button
              type="button"
              class="close"
              data-dismiss="alert"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <form @submit.prevent="changeAccount">
            <div class="form-group row">
              <label for="username" class="col-sm-2 col-form-label col-form-label-md">Username</label>
              <div class="col-sm-7">
                <input
                  v-model="user.username"
                  type="text"
                  class="form-control form-control-md"
                  id="username"
                  placeholder
                >
              </div>
            </div>
            <div class="form-group row mb-4">
              <label for="email" class="col-sm-2 col-form-label col-form-label-md">Email</label>
              <div class="col-sm-7">
                <input
                  v-model="user.email"
                  type="email"
                  class="form-control form-control-md"
                  id="email"
                  placeholder
                >
              </div>
            </div>
            <button type="submit" class="btn btn-primary btn-md">
              <i class="fas fa-save"></i> Save changes
            </button>
          </form>
          <!--/ACCOUNT FORM-->
          <hr class="mt-4 mb-4">
          <!--PASSWORD FORM-->
          <h3>Password</h3>
          <h6 class="mb-3" style="color: #AAA">Change your current password.</h6>
          <div
            v-if="infoPassword"
            class="alert alert-success alert-dismissible fade show"
            role="alert"
          >
            {{infoPassword}}
            <button
              type="button"
              class="close"
              data-dismiss="alert"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div
            v-if="errorPassword"
            class="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {{errorPassword}}
            <button
              type="button"
              class="close"
              data-dismiss="alert"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <form @submit.prevent="changePassword">
            <div class="form-group row mb-4">
              <label
                for="currentPassword"
                class="col-sm-4 col-form-label col-form-label-md"
              >Current password</label>
              <div class="col-sm-5">
                <input
                  v-model="password.currentPassword"
                  type="password"
                  class="form-control form-control-md"
                  id="currentPassword"
                  required
                >
              </div>
            </div>
            <div class="form-group row">
              <label
                for="newPassword"
                class="col-sm-4 col-form-label col-form-label-md"
              >New password</label>
              <div class="col-sm-5">
                <input
                  v-model="password.newPassword"
                  type="password"
                  class="form-control form-control-md"
                  id="newPassword"
                  required
                >
              </div>
            </div>
            <div class="form-group row mb-4">
              <label
                for="confirmPassword"
                class="col-sm-4 col-form-label col-form-label-md"
              >Confirm password</label>
              <div class="col-sm-5">
                <input
                  v-model="password.confirmPassword"
                  type="password"
                  class="form-control form-control-md"
                  id="confirmPassword"
                  required
                >
              </div>
            </div>
            <button type="submit" class="btn btn-primary btn-md">
              <i class="fas fa-save"></i> Save changes
            </button>
          </form>
          <!--/PASSWORD FORM-->
          <hr class="mt-4">
          <div class="mb-4">
            <h6>
              If you want to delete the account click here
              <button
                type="button"
                class="btn btn-danger btn-sm"
                data-toggle="modal"
                data-target="#deleteUserModal"
              >
                <i class="fas fa-user-slash"></i> Delete account
              </button>
            </h6>
          </div>
          <!--DELETE USER MODAL-->
          <div
            class="modal fade"
            id="deleteUserModal"
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
            data-toggle="modal"
            data-target="#deleteUserModal"
          >
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">Delete account</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div
                  class="modal-body"
                >Are you sure? Your account will be deleted and you will lose all stored registers.</div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button @click="deleteAccount" type="button" class="btn btn-primary">Delete</button>
                </div>
              </div>
            </div>
          </div>
          <!--/DELETE USER MODAL-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
class Password {
  constructor(currentPassword, newPassword, confirmPassword) {
    this.currentPassword = currentPassword;
    this.newPassword = newPassword;
    this.confirmPassword = confirmPassword;
  }
}

class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }
}

export default {
  data() {
    return {
      password: new Password(),
      user: new User(),
      infoPassword: "",
      errorPassword: "",
      infoAccount: "",
      errorAccount: ""
    };
  },
  mounted() {
    this.infoPassword = "";
    fetch("http://localhost:3000/users/profile", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.token}`
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        return response.json().then(error => {
          throw new Error(error.message);
        });
      })
      .then(data => {
        this.$store.dispatch("setUser", data.username);
        this.$store.dispatch("setRole", data.role);
        this.user.username = data.username;
        this.user.email = data.email;
      });
  },
  methods: {
    changePassword() {
      fetch("http://localhost:3000/users/editPassword", {
        method: "PUT",
        body: JSON.stringify(this.password),
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.token}`
        }
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          return response.json().then(error => {
            throw new Error(error.message);
          });
        })
        .then(() => {
          this.errorPassword = "";
          this.infoPassword =
            "Password changed successfully, closing session...";
          setTimeout(() => {
            this.$store.dispatch("setToken", false);
            localStorage.removeItem("token");
            this.$router.push("/login");
          }, 1500);
        })
        .catch(error => {
          this.errorPassword = error.message;
        });
      this.password = new Password();
    },
    changeAccount() {
      fetch("http://localhost:3000/users/editAccount", {
        method: "PUT",
        body: JSON.stringify(this.user),
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.token}`
        }
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          return response.json().then(error => {
            throw new Error(error.message);
          });
        })
        .then(() => {
          this.errorAccount = "";
          this.infoAccount = "Account changed successfully, closing session...";
          setTimeout(() => {
            this.$store.dispatch("setToken", false);
            localStorage.removeItem("token");
            this.$router.push("/login");
          }, 1500);
        })
        .catch(error => {
          this.errorAccount = error.message;
        });
    },
    deleteAccount() {
      fetch("http://localhost:3000/users/deleteAccount", {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.token}`
        }
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          return response.json().then(error => {
            throw new Error(error.message);
          });
        })
        .then(user => {
          this.infoAccount =
            "User account eliminated successfully, closing session... See you soon!";
          setTimeout(() => {
            this.$store.dispatch("setToken", false);
            localStorage.removeItem("token");
            this.$router.push("/login");
          }, 1500);
        });
    }
  }
};
</script>

<style>
hr {
  background-color: #999;
  height: 0.3%;
}
</style>
