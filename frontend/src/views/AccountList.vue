<template>
  <v-data-table
    :loading="loading"
    loading-text="Kullanıcılar yükleniyor... Lütfen bekleyin"
    :headers="headers"
    :items="users"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Kullanıcılar</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn :class="uiGetThemeColor" class="mb-2" v-on="on">Kullanıcı Ekle</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ dialogTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      ref="name"
                      v-model="editedItem.name"
                      :rules="[
                        () => !!editedItem.name || 'Adı alanını doldurunuz.',
                        () => !!editedItem.name && editedItem.name.length >= 3 || 'Adı en az 3 karakter olmalıdır.',
                    ]"
                      label="Adı"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      ref="username"
                      v-model="editedItem.username"
                      :rules="[
                        () => !!editedItem.username || 'Kullanıcı adı alanını doldurunuz.',
                        () => !!editedItem.username && editedItem.username.length >= 3 || 'Kullanıcı adı en az 3 karakter olmalıdır.',
                      ]"
                      label="Kullanıcı adı"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      ref="password"
                      v-model="editedItem.password"
                      :hint="editedIndex !== -1 ? '* Şifre değiştirilmiyorsa boş bırakınız.' : ''"
                      persistent-hint
                      :rules="[
                        () => editedIndex !== -1 || !!editedItem.password || 'Şifre alanını doldurunuz.',
                        () => !editedItem.password || editedItem.password.length >= 8 || 'En az 8 karakter olmalıdır.',
                      ]"
                      :type="editedItem.passwordShow ? 'text' : 'password'"
                      :append-icon="editedItem.passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="editedItem.passwordShow = !editedItem.passwordShow"
                      counter
                      label="Şifre"
                      :required="editedIndex !== -1"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <h3>Yetkileri</h3>
                  </v-col>
                  <v-col cols="6">
                    <v-checkbox
                      v-model="editedItem.permissions.accountGetAll"
                      label="Kullanıcı Listeleme"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="6">
                    <v-checkbox
                      v-model="editedItem.permissions.accountAdd"
                      label="Kullanıcı Ekleme"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="6">
                    <v-checkbox
                      v-model="editedItem.permissions.accountUpdate"
                      label="Kullanıcı Güncelleme"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="6">
                    <v-checkbox
                      v-model="editedItem.permissions.accountDelete"
                      label="Kullanıcı Silme"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">İptal</v-btn>
              <v-btn color="blue darken-1" text @click="save">Kaydet</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon
        v-if="accountUserPermissions.accountUpdate"
        small
        class="mr-2"
        @click="editItem(item)"
      >mdi-pencil</v-icon>
      <v-icon v-if="accountUserPermissions.accountDelete" @click="deleteItem(item)" small>mdi-delete</v-icon>
    </template>
    <template v-slot:no-data>Kullanıcı bulunmuyor</template>
  </v-data-table>
</template>

<script>
import { mapGetters } from "vuex";
import { copyObject } from "../../bin/atom";
export default {
  mounted() {
    this.$store
      .dispatch("accountGetUsers")
      .then(data => {
        this.users = data;
        this.loading = false;
      })
      .catch(() => null);
    if (
      this.accountUserPermissions.accountUpdate ||
      this.accountUserPermissions.accountDelete
    ) {
      this.headers.push({
        text: "İşlemler",
        value: "action",
        sortable: false
      });
    }
  },
  name: "accountList",
  data: () => ({
    loading: true,
    dialog: false,
    headers: [
      { text: "Adı", align: "left", value: "name" },
      { text: "Kullanıcı Adı", value: "username" }
    ],
    users: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      username: "",
      password: "",
      passwordShow: false,
      permissions: {
        accountAdd: false,
        accountUpdate: false,
        accountDelete: false,
        accountGetAll: false
      }
    },
    defaultItem: {
      name: "",
      username: "",
      password: "",
      passwordShow: false,
      permissions: {
        accountAdd: false,
        accountUpdate: false,
        accountDelete: false,
        accountGetAll: false
      }
    },
    dialog: false
  }),
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = copyObject(item);
      this.dialog = true;
    },
    deleteItem(item) {
      if (
        confirm(
          "Kullanıcıyı siliyorsunuz, bu işlemi yapmak istediğinize emin misiniz?"
        )
      ) {
        this.$store
          .dispatch("accountDeleteUser", {
            userId: item._id
          })
          .then(() => {
            this.users.splice(this.users.indexOf(item), 1);
          })
          .catch(() => null)

      }
    },
    close() {
      this.dialog = false;
      this.editedIndex = -1;
      this.editedItem = copyObject(this.defaultItem);
    },
    save() {
      if (
        Object.keys(this.$refs).filter(key => !this.$refs[key].validate(true))
          .length === 0
      ) {
        // Kullanıcı ekleme
        if (this.editedIndex === -1) {
          this.$store
            .dispatch("accountAddUser", {
              name: this.editedItem.name,
              username: this.editedItem.username,
              password: this.editedItem.password,
              permissions: this.editedItem.permissions
            })
            .then(userResult => {
              this.users.push(userResult);
              this.close();
            })
            .catch(() => this.close());
          // Kullanıcı güncelleme
        } else {
          this.$store
            .dispatch("accountUpdateUser", {
              userId: this.editedItem._id,
              name: this.editedItem.name,
              username: this.editedItem.username,
              password: this.editedItem.password,
              permissions: this.editedItem.permissions
            })
            .then(() => {
              this.users[this.editedIndex].name = this.editedItem.name;
              this.users[this.editedIndex].username = this.editedItem.username;
              this.users[
                this.editedIndex
              ].permissions = this.editedItem.permissions;
              this.close();
            })
            .catch(() => this.close());
        }
      }
    }
  },
  computed: {
    ...mapGetters(["uiGetThemeColor", "accountUserPermissions"]),
    dialogTitle() {
      return this.editedIndex === -1 ? "Kullanıcı Ekle" : "Kullanıcı Düzenle";
    }
  }
};
</script>
