<template>
  <div class="generator">
    <div class="container mb-5">
      <div v-if="$store.state.isUserLoggedIn && emailGenerated && passwordGenerated" class="row">
        <div class="col-md-10 offset-md-1 mt-4">
          <div class="alert alert-info alert-dismissible fade show" role="alert" id="alertSave">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
              <span class="sr-only">Close</span>
            </button>
            Do you want to save the email account and password as a register?
            <a
              class="alert-link"
              href="#"
              data-toggle="modal"
              data-target="#addModal"
            >Save register</a>
          </div>
        </div>
      </div>
      <!--ADD REGISTER MODAL-->
      <div
        class="modal fade"
        id="addModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="addModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="addModalLabel">Add register</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div
                v-if="errorMessage"
                style="text-align: center;"
                class="alert alert-danger"
                role="alert"
              >{{errorMessage}}</div>
              <div class="form-group">
                <label for>Register name</label>
                <input
                  v-model="registerName"
                  type="text"
                  class="form-control"
                  name
                  id
                  aria-describedby="helpId"
                  placeholder
                >
                <small id="helpId" class="form-text text-muted">Enter a name for your register.</small>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button
                @click="addRegister(registerName, emailGenerated, binUrl, passwordGenerated)"
                type="button"
                class="btn btn-primary"
              ><i class="fas fa-save"></i> Save</button>
            </div>
          </div>
        </div>
      </div>
      <!--/ADD REGISTER MODAL-->

      <div class="row">
        <div class="col-md-8 offset-md-1">
          <!--ALERT-->
          <div
            v-if="!$store.state.isUserLoggedIn"
            class="mt-4 alert alert-info alert-dismissible fade show"
            role="alert"
          >
            Do you want to save mail accounts and passwords for some registers?
            <router-link class="alert-link" :to="{name: 'login'}">Login</router-link> or
            <router-link class="alert-link" :to="{name: 'signup'}">Signup</router-link>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <!--/ALERT-->
        </div>
      </div>
      <div class="row">
        <!--
                    EMAIL GENERATOR
        -->
        <div class="col-md-4 offset-md-1 mt-4">
          <h1 class="pb-2">Email Generator</h1>
          <form @submit.prevent="generateEmail">
            <div v-if="emailGenerated">
              <label style="font-size: 1.1em" for="emailGenerated">Your generated email</label>
              <div class="input-group mb-4">
                <div class="input-group-prepend">
                  <button @click="copyEmail" class="btn btn-primary" type="button">
                    <i class="fas fa-copy"></i> Copy
                  </button>
                </div>
                <input
                  v-model="emailGenerated"
                  ref="email"
                  type="email"
                  name="emailGenerated"
                  id="emailGenerated"
                  class="form-control some-class"
                  placeholder
                  readonly
                >
              </div>
            </div>
            <a
              v-if="emailGenerated"
              @click="inbox"
              type="button"
              class="btn btn-success btn-md mr-4"
              data-toggle="modal"
              data-target="#inboxModal"
            >
              <i class="fas fa-inbox"></i> Inbox
            </a>
            <button type="submit" class="btn btn-primary btn-md">
              <i class="fas fa-envelope"></i> Generate
            </button>
          </form>
        </div>

        <!--INBOX MODAL-->
        <div
          class="modal fade"
          id="inboxModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="inboxModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
              <div class="modal-header" style="background-color: #4E5D6C">
                <div>
                  <h5 class="modal-title" id="inboxModal">
                    <span class="text-primary ml-3">Inbox:</span>
                    {{emailGenerated}}
                  </h5>
                </div>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div v-if="inboxes[0]">
                <div v-for="inbox of inboxes" :key="inbox._id">
                  <div class="container-fluid">
                    <div class="row">
                      <div class="col-md-4 p-3" style="border-top: 2px solid darkgray">
                        <p class="mb-3">
                          <span class="text-primary">From:</span>
                          {{inbox.from}}
                        </p>
                        <p>
                          <span class="text-primary">Subject:</span>
                          {{inbox.subject}}
                        </p>
                      </div>
                      <div class="col-md-8 p-4" style="background-color: #5B6977">
                        <div
                          class="card p-0 m-0"
                          style="background-color: transparent; border: 0px;"
                          v-if="inbox.text"
                        >
                          <div v-html="inbox.text"></div>
                        </div>
                        <div v-else>
                          <div v-html="inbox.html"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <h5 class="p-3 ml-3 text-center">Oh! You do not have emails yet.</h5>
              </div>
            </div>
          </div>
        </div>
        <!--/INBOX MODAL-->

        <!--
                    PASSWORD GENERATOR
        -->
        <div class="col-md-5 offset-md-1 mt-4 mb-5">
          <h1 class="pb-2">Password Generator</h1>
          <form @submit.prevent="generatePassword">
            <div v-if="passwordGenerated">
              <label style="font-size: 1.1em" for="passwordGenerated">Your generated password</label>
              <div class="input-group mb-4">
                <div class="input-group-prepend">
                  <button @click="copyPassword" class="btn btn-primary" type="button">
                    <i class="fas fa-copy"></i> Copy
                  </button>
                </div>
                <input
                  v-model="passwordGenerated"
                  ref="password"
                  type="text"
                  name="passwordGenerated"
                  id="passwordGenerated"
                  class="form-control some-class"
                  placeholder
                  readonly
                >
              </div>
            </div>
            <div class="form-group row">
              <div class="input-group-prepend">
                <label for="legth" class="col-md-3 col-form-label" style="font-size: 1.1em">Length</label>
                <div class="col-md-9">
                  <input
                    style="width: 40%"
                    v-model="password.length"
                    type="text"
                    class="form-control length"
                    name
                    id
                    aria-describedby="helpId"
                    placeholder
                    readonly
                  >
                </div>
              </div>
            </div>
            <div class="form-group">
              <input
                v-model="password.length"
                type="range"
                min="8"
                class="custom-range"
                style="width: 85%"
                id="legth"
              >
            </div>
            <div class="checkbox">
              <label style="font-size: 1.1em">
                <input v-model="password.numbers" type="checkbox" value>
                <span class="cr">
                  <i class="cr-icon fa fa-check"></i>
                </span>
                Numbers [0-9]
              </label>
            </div>
            <div class="checkbox">
              <label style="font-size: 1.1em">
                <input v-model="password.uppercase" type="checkbox" value>
                <span class="cr">
                  <i class="cr-icon fa fa-check"></i>
                </span>
                Uppercases [A-Z]
              </label>
            </div>
            <div class="checkbox mb-2">
              <label style="font-size: 1.1em">
                <input v-model="password.symbols" type="checkbox" value>
                <span class="cr">
                  <i class="cr-icon fa fa-check"></i>
                </span>
                Special characters [!#$%...]
              </label>
            </div>
            <button type="submit" class="btn btn-primary btn-md">
              <i class="fas fa-key"></i> Generate
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
class Password {
  constructor(length, numbers, uppercase, symbols) {
    this.length = 30;
    this.numbers = numbers;
    this.uppercase = uppercase;
    this.symbols = symbols;
  }
}

class Register {
  constructor(registerName, emailGenerated, binUrl, passwordGenerated) {
    this.registerName = registerName;
    this.emailGenerated = emailGenerated;
    this.binUrl = binUrl;
    this.passwordGenerated = passwordGenerated;
  }
}

export default {
  data() {
    return {
      password: new Password(),
      passwordGenerated: "",
      copiedPassword: false,
      emailGenerated: "",
      copiedEmail: false,
      binUrl: "",
      inboxes: [],
      registerName: "",
      errorMessage: ""
    };
  },
  methods: {
    generatePassword() {
      this.copiedPassword = false;
      fetch("http://localhost:3000/user/passwordGenerator", {
        method: "POST",
        body: JSON.stringify(this.password),
        headers: {
          Accept: "application/json",
          "content-type": "application/json"
        }
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
        })
        .then(result => {
          this.passwordGenerated = result;
        });
    },
    copyPassword() {
      this.copiedPassword = true;
      this.$refs.password.select();
      document.execCommand("copy");
    },
    generateEmail() {
      this.copiedEmail = false;
      fetch("http://localhost:3000/user/emailGenerator", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json"
        }
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
        })
        .then(result => {
          this.emailGenerated = result.emailTemp;
          this.binUrl = result.binUrl;
        });
    },
    copyEmail() {
      this.copiedEmail = true;
      this.$refs.email.select();
      document.execCommand("copy");
    },
    inbox() {
      fetch("http://localhost:3000/user/inbox", {
        method: "POST",
        body: JSON.stringify({ binUrl: this.binUrl }),
        headers: {
          Accept: "application/json",
          "Content-type": "application/json"
        }
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
        })
        .then(inbox => {
          this.inboxes = inbox;
          console.log(this.inboxes);
        });
    },
    addRegister(name, email, url, password) {
      const register = new Register(
        (this.registerName = name),
        (this.emailGenerated = email),
        (this.binUrl = url),
        (this.passwordGenerated = password)
      );
      fetch("http://localhost:3000/registers/addRegister", {
        method: "POST",
        body: JSON.stringify(register),
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
        .then(register => {
          $("#addModal").modal("toggle");
          $("#alertSave").alert("close");
          this.$router.push("/registers");
          this.registerName = "";
          this.emailGenerated = "";
          this.passwordGenerated = "";
          this.errorMessage = "";
        })
        .catch(error => {
          this.errorMessage = error.message;
        });
    }
  }
};
</script>

<style>
input.some-class:read-only {
  border: 1px solid #df691a;
  color: #df691a;
  outline: none;
}
input.some-class:read-only:focus {
  border: 1px solid #df691a;
  color: #df691a;
  -webkit-box-shadow: none;
  box-shadow: none;
}

input:read-only {
  text-align: center;
  color: white;
  outline: none;
}
input:read-only:focus {
  text-align: center;
  color: white;
  -webkit-box-shadow: none;
  box-shadow: none;
}

.checkbox label:after,
.radio label:after {
  content: "";
  display: table;
  clear: both;
}

.checkbox .cr,
.radio .cr {
  color: #df691a;
  position: relative;
  display: inline-flex;
  border: 1px solid #a9a9a9;
  border-radius: 0.25em;
  width: 1.3em;
  height: 1.3em;
  float: left;
  margin-right: 0.5em;
  margin-bottom: 0.8em;
}

.radio .cr {
  border-radius: 50%;
}

.checkbox .cr .cr-icon,
.radio .cr .cr-icon {
  position: absolute;
  font-size: 0.8em;
  line-height: 0;
  top: 50%;
  left: 20%;
}

.radio .cr .cr-icon {
  margin-left: 0.04em;
}

.checkbox label input[type="checkbox"],
.radio label input[type="radio"] {
  display: none;
}

.checkbox label input[type="checkbox"] + .cr > .cr-icon,
.radio label input[type="radio"] + .cr > .cr-icon {
  transform: scale(3);
  opacity: 0;
  transition: all 0.3s ease-in;
}

.checkbox label input[type="checkbox"]:checked + .cr > .cr-icon,
.radio label input[type="radio"]:checked + .cr > .cr-icon {
  transform: scale(1);
  opacity: 1;
}

.checkbox label input[type="checkbox"]:disabled + .cr,
.radio label input[type="radio"]:disabled + .cr {
  opacity: 0.5;
}
</style>
