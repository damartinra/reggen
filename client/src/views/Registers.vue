<template>
  <div class="registers">
    <div class="container mb-5 pb-5">
      <div class="row justify-content-center">
        <div class="col-md-9 mt-4">
          <h2>Registers</h2>
          <div v-if="infoMessage">
            <div
              style="text-align: center;"
              class="alert alert-info mt-3 mb-0"
              role="alert"
            >{{infoMessage}}</div>
            <div class="text-center mt-5">
              <button
                @click="generateRegister()"
                type="button"
                class="btn btn-primary btn-lg"
                data-toggle="modal"
                data-target="#addModal"
              >
                <i class="fas fa-plus"></i> Add register
              </button>
            </div>
          </div>
          <div v-if="!infoMessage">
            <!--SEARCH AND ADD-->
            <form class="form-inline mt-4">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i class="fas fa-search"></i>
                  </span>
                  <input
                    v-model="search"
                    type="text"
                    class="form-control"
                    name
                    id="search"
                    aria-describedby="helpId"
                    placeholder="search registers"
                  >
                </div>
              </div>
              <button
                @click="generateRegister()"
                type="button"
                class="btn btn-primary ml-auto"
                data-toggle="modal"
                data-target="#addModal"
              >
                <i class="fas fa-plus"></i> Add register
              </button>
            </form>
            <!--/SEARCH AND ADD-->
            <!--REGISTERS TABLE-->
            <table class="table table-dark table-responsive-md table-borderless mt-2" style="background-color: #4E5D6C">
              <thead style="background-color: #43505D">
                <tr>
                  <th>Register</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="register of filteredRegisters" :key="register._id">
                  <td class="align-middle">{{register.registerName}}</td>
                  <td class="align-middle">
                    <form @submit.prevent="inbox(register)">
                      <input
                        v-model="register.binUrl"
                        type="hidden"
                        class="form-control"
                        name
                        v-bind:id="register._binUrl"
                        aria-describedby="helpId"
                        placeholder
                      >
                      <button
                        @click="inboxModal(register)"
                        type="submit"
                        class="btn btn-outline-info p-1 m-0"
                      >
                        <i class="fas fa-inbox"></i>
                        {{register.emailGenerated}}
                      </button>
                    </form>
                  </td>
                  <td class="align-middle">
                    <div class="input-group" id="show_hide_password">
                      <input
                        v-model="register.passwordGenerated"
                        type="password"
                        class="form-control pass"
                        name
                        v-bind:id="register._id"
                        placeholder
                        readonly
                      >
                      <div class="input-group-append">
                        <button
                          v-on:click="showPassword(register._id, register.passwordGenerated)"
                          class="btn btn-light"
                          type="button"
                        >
                          <i v-bind:id="register.passwordGenerated" class="fas fa-eye-slash fa-sm"></i>
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="btn-group-md" role="group">
                      <button
                        @click="updateModal(register)"
                        type="button"
                        class="btn btn-info pr-2"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button
                        @click="deleteModal(register)"
                        type="button"
                        class="btn btn-danger mb-1 mt-1"
                      >
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <!--/REGISTERS TABLE-->
          </div>

          <!------------------MODALS------------------>

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
                <div
                  v-if="errorMessage"
                  style="text-align: center;"
                  class="alert alert-danger mt-3 mb-0 mr-3 ml-3"
                  role="alert"
                >{{errorMessage}}</div>
                <form @submit.prevent="addRegister()">
                  <div class="pt-3 pr-3 pl-3">
                    <div class="form-group">
                      <label for="registerName">Register</label>
                      <input
                        v-model="register.registerName"
                        type="text"
                        name="registerName"
                        id="registerName"
                        class="form-control"
                        placeholder
                        aria-describedby="registerNameId"
                        required
                      >
                      <small id="registerNameId" class="text-muted">Enter a name for your register.</small>
                    </div>
                    <div class="form-group">
                      <label for="emailGenerated">Email</label>
                      <input
                        style="background-color: #2B3E50"
                        v-model="register.emailGenerated"
                        type="email"
                        class="form-control"
                        name="emailGenerated"
                        id="emailGenerated"
                        placeholder
                        readonly
                      >
                    </div>
                    <div class="form-group">
                      <input
                        v-model="register.binUrl"
                        type="hidden"
                        name="binUrl"
                        id="binUrl"
                        class="form-control"
                        placeholder
                        readonly
                      >
                    </div>
                    <div class="form-group">
                      <label for="passwordGenerated">Password</label>
                      <input
                        style="background-color: #2B3E50"
                        v-model="register.passwordGenerated"
                        type="text"
                        class="form-control"
                        name="passwordGenerated"
                        id="passwordGenerated"
                        placeholder
                        readonly
                      >
                    </div>
                  </div>
                  <div
                    class="mt-4 p-3 text-right"
                    style="background-color: #5B6977; border-top: 1px solid #49545F"
                  >
                    <button type="button" class="btn btn-secondary mr-2" data-dismiss="modal">Cancel</button>
                    <button
                      @click="generateRegister()"
                      type="button"
                      class="btn btn-info mr-2"
                    >Generate</button>
                    <button type="submit" class="btn btn-primary">
                      <i class="fas fa-save"></i> Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <!--/ADD REGISTER MODAL-->

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
                      {{modalEmailRegister}}
                      <button
                        @click="refresh(binUrl)"
                        type="button"
                        class="btn btn-primary btn-sm ml-3"
                      >
                        <i class="fas fa-sync-alt"></i> Refresh
                      </button>
                    </h5>
                    <div
                      v-if="errorMessage"
                      style="text-align: center;"
                      class="alert alert-danger mt-3 mb-1 ml-3 p-1"
                      role="alert"
                    >
                      <router-link
                        class="nav-link"
                        :to="{name: 'profile'}"
                        data-dismiss="modal"
                      >{{errorMessage}} Click here to go to the profile.</router-link>
                    </div>
                    <div
                      v-if="successMessage"
                      style="text-align: center;"
                      class="alert alert-success mt-3 mb-1 ml-3 p-1"
                      role="alert"
                    >{{successMessage}}</div>
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
                          <button
                            @click="sendEmail(inbox.subject, inbox.text, inbox.html)"
                            type="button"
                            class="btn btn-primary btn-md mt-3 mb-3"
                          >
                            <i class="fas fa-paper-plane"></i> Send email to main mail
                          </button>
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

          <!--UPDATE REGISTER MODAL-->
          <div
            class="modal fade"
            id="updateModal"
            tabindex="-1"
            role="dialog"
            aria-labelledby="updateModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="updateModalLabel">Update register</h5>
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
                  <p>Are you sure you want to update this register?</p>
                  <input
                    v-model="modalNameRegister"
                    type="text"
                    class="form-control"
                    name
                    id
                    aria-describedby="helpId"
                    placeholder
                  >
                  <small
                    id="helpId"
                    class="form-text text-muted"
                  >Enter a name for your new register.</small>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                  <button
                    @click="updateRegister(modalIdRegister, modalNameRegister)"
                    type="button"
                    class="btn btn-primary"
                  >Update</button>
                </div>
              </div>
            </div>
          </div>
          <!--/UPDATE REGISTER MODAL-->

          <!--DELETE REGISTER MODAL-->
          <div
            class="modal fade"
            id="deleteModal"
            tabindex="-1"
            role="dialog"
            aria-labelledby="deleteModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="deleteModalLabel">Delete register</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <p>Are you sure you want to delete this register?</p>
                  {{modalNameRegister}}
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                  <button
                    @click="deleteRegister(modalIdRegister)"
                    type="button"
                    class="btn btn-primary"
                  >Delete</button>
                </div>
              </div>
            </div>
          </div>
          <!--/DELETE REGISTER MODAL-->

          <!------------------END MODALS------------------>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
class Register {
  constructor(registerName, emailGenerated, binUrl, passwordGenerated) {
    this.registerName = registerName;
    this.emailGenerated = emailGenerated;
    this.binUrl = binUrl;
    this.passwordGenerated = passwordGenerated;
  }
}

class Email {
  constructor(subject, text, html) {
    this.subject = subject;
    this.text = text;
    this.html = html;
  }
}

export default {
  data() {
    return {
      register: new Register(),
      email: [],
      binUrl: "",
      registers: [],
      inboxes: [],
      infoMessage: "",
      errorMessage: "",
      successMessage: "",
      modalIdRegister: "",
      modalNameRegister: "",
      modalEmailRegister: "",
      search: ""
    };
  },
  computed: {
    filteredRegisters() {
      return this.registers.filter(register => {
        return register.registerName
          .toLowerCase()
          .match(this.search.toLowerCase());
      });
    }
  },
  mounted() {
    this.getRegisters();
  },
  methods: {
    refresh(binUrl) {
      this.inbox({ binUrl });
    },
    showPassword(id, password) {
      if (
        document.getElementById(id).type === "password" &&
        document.getElementById(password).className === "fas fa-eye-slash fa-sm"
      ) {
        document.getElementById(id).type = "text";
        document.getElementById(password).className = "fas fa-eye fa-sm";
      } else {
        document.getElementById(id).type = "password";
        document.getElementById(password).className = "fas fa-eye-slash fa-sm";
      }
    },
    sendEmail(subject, text, html) {
      this.successMessage = "";
      const email = new Email(subject, text, html);
      fetch("http://localhost:3000/registers/sendEmail", {
        method: "POST",
        body: JSON.stringify(email),
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
            this.errorMessage = error.message;
            throw new Error(error.message);
          });
        })
        .then(result => {
          this.successMessage = result.message;
        })
        .catch(error => {
          this.errorMessage = error.message;
        });
    },
    updateModal(register) {
      this.errorMessage = "";
      this.modalIdRegister = register._id;
      this.modalNameRegister = register.registerName;
      $("#updateModal").modal("toggle");
    },
    deleteModal(register) {
      this.modalIdRegister = register._id;
      this.modalNameRegister = register.registerName;
      $("#deleteModal").modal("toggle");
    },
    inboxModal(register) {
      this.modalEmailRegister = register.emailGenerated;
      $("#inboxModal").modal("toggle");
    },
    inbox(register) {
      this.binUrl = register.binUrl;
      fetch("http://localhost:3000/registers/inbox", {
        method: "POST",
        body: JSON.stringify({ binUrl: this.binUrl }),
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
            this.successMessage = "";
            throw new Error(error.message);
          });
        })
        .then(inbox => {
          this.inboxes = inbox;
        })
        .catch(error => {
          this.errorMessage = error.message;
        });
    },
    generateRegister() {
      this.errorMessage = "";
      fetch("http://localhost:3000/registers/generateRegister", {
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
        })
        .then(data => {
          this.register.emailGenerated = data.emailGenerated;
          this.register.binUrl = data.binUrl;
          this.register.passwordGenerated = data.passwordGenerated;
        });
    },
    addRegister() {
      fetch("http://localhost:3000/registers/addRegister", {
        method: "POST",
        body: JSON.stringify(this.register),
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
            this.successMessage = "";
            throw new Error(error.message);
          });
        })
        .then(register => {
          $("#addModal").modal("toggle");
          this.getRegisters();
        })
        .catch(error => {
          this.errorMessage = error.message;
        });
      this.register = new Register();
    },
    getRegisters() {
      fetch("http://localhost:3000/registers/getRegisters", {
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
          if (!data[0]) {
            this.infoMessage = "Oh! You still do not have registers :(";
            this.registers = [];
          } else {
            this.registers = data;
            this.infoMessage = "";
          }
        });
    },
    updateRegister(modalIdRegister, modalNameRegister) {
      fetch(
        "http://localhost:3000/registers/updateRegister/" + modalIdRegister,
        {
          method: "PUT",
          body: JSON.stringify({ registerName: this.modalNameRegister }),
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${localStorage.token}`
          }
        }
      )
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          return response.json().then(error => {
            throw new Error(error.message);
          });
        })
        .then(register => {
          this.errorMessage = "";
          $("#updateModal").modal("toggle");
          this.getRegisters();
        })
        .catch(error => {
          this.errorMessage = error.message;
        });
    },
    deleteRegister(modalIdRegister) {
      fetch(
        "http://localhost:3000/registers/deleteRegister/" + modalIdRegister,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${localStorage.token}`
          }
        }
      )
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          return response.json().then(error => {
            throw new Error(error.message);
          });
        })
        .then(register => {
          $("#deleteModal").modal("toggle");
          this.getRegisters();
        });
    }
  }
};
</script>

<style>
th {
  font-weight: normal;
  font-size: 1.1em;
}
input.pass:read-only {
  text-align: left;
  border: 1px solid #abb6c2;
}
#search {
  border: 0;
}
</style>