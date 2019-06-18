<template>
  <div class="container mb-5">
    <div class="row">
      <div class="col-md-8 offset-md-2 mt-4">
        <h2>Users</h2>
        <div
          v-if="successMessage"
          class="alert alert-success fade show"
          role="alert"
        >{{successMessage}}</div>
        <div v-if="errorMessage" class="alert alert-success fade show" role="alert">{{errorMessage}}</div>
        <table class="table table-dark table-responsive-md table-borderless mt-4">
          <thead style="background-color: #43505D">
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Login</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user of users" :key="user._id">
              <td class="align-middle">{{user.username}}</td>
              <td class="align-middle">{{user.email || '-'}}</td>
              <td class="align-middle">{{user.lastLoginDate}}</td>
              <td>
                <div class="btn-group-md" role="group">
                  <button
                    v-if="user.email"
                    :disabled="false"
                    @click="sendWarning(user.email)"
                    class="btn btn-info"
                    style="padding-right: 0.6em"
                  >
                    <i class="fas fa-paper-plane"></i>
                  </button>
                  <button
                    v-if="!user.email"
                    :disabled="true"
                    @click="sendWarning(user.email)"
                    class="btn btn-info"
                    style="padding-right: 0.6em"
                  >
                    <i class="fas fa-paper-plane"></i>
                  </button>
                  <button @click="deleteModal(user)" type="button" class="btn btn-danger mb-1 mt-1">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <!--DELETE USER MODAL-->
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
                <h5 class="modal-title" id="deleteModalLabel">Delete user</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <p>Are you sure you want to delete this user?</p>
                {{modalNameUser}}
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button
                  @click="deleteUser(modalIdUser)"
                  type="button"
                  class="btn btn-primary"
                >Delete</button>
              </div>
            </div>
          </div>
        </div>
        <!--/DELETE USER MODAL-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      email: "",
      successMessage: "",
      errorMessage: "",
      modalIdUser: "",
      modalNameUser: ""
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    deleteModal(user) {
      this.modalIdUser = user._id;
      this.modalNameUser = user.username;
      $("#deleteModal").modal("toggle");
    },
    getUsers() {
      fetch("http://localhost:3000/admin/getUsers", {
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
        .then(users => {
          if (!users[0]) {
            this.users = [];
          } else {
            this.users = users;
          }
        });
    },
    sendWarning(email) {
      this.successMessage = "";
      this.email = email;
      fetch("http://localhost:3000/admin/sendWarning", {
        method: "POST",
        body: JSON.stringify({ email: this.email }),
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
    deleteUser(modalIdUser) {
      fetch("http://localhost:3000/admin/deleteUser/" + modalIdUser, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${localStorage.token}`
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
          $("#deleteModal").modal("toggle");
          this.getUsers();
        });
    }
  }
};
</script>
