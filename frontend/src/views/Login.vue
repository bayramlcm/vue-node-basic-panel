<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-form v-on:submit.prevent>
              <v-card class="elevation-12">
                <v-toolbar :class='uiGetThemeColor' flat>
                  <v-toolbar-title>Giriş Yap</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-text-field
                    label="Kullanıcı adı"
                    prepend-icon="mdi-account"
                    type="username"
                    required
                    v-model="username"
                  ></v-text-field>
                  <v-text-field
                    label="Şifre"
                    prepend-icon="mdi-lock"
                    type="password"
                    required
                    v-model="password"
                  ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    :class='uiGetThemeColor'
                    @click="login()"
                    type="submit"
                  >Giriş Yap</v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data: () => ({
    username: "bayramlcm",
    password: "12345678",
  }),
  computed: {
      ...mapGetters([
          'uiGetThemeColor',
          'accountLoginGet',
      ]),
  },
  watch: {
    accountLoginGet(newValue, oldValue) {
      // Giriş başarılı
      if (newValue === true) {
        this.$router.push('/'); 
      }
    }
  },
  methods: {
    login() {
      this.$store.dispatch('accountLogin', {
        username: this.username,
        password: this.password,
      });
    }
  }
};
</script>