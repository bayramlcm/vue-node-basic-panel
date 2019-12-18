<template>
  <nav>
    <v-toolbar :class="uiGetThemeBackgroundColor">
      <v-app-bar-nav-icon :class="uiGetThemeFontColor" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <span :class="`font-weight-light ${uiGetThemeFontColor}`">{{serverGetName}}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn text :class="`text--lowercase ${uiGetThemeFontColor}`" router to="/logout">
        <span class="text-capitalize">Çıkış</span>
        <v-icon right>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-toolbar>
    <v-navigation-drawer v-model="drawer" app :class="uiGetThemeBackgroundColor">
      <v-layout row class="my-5">
        <v-flex xs12 class="text-center pt-3">
          <span :class="`body-1 ${uiGetThemeFontColor}`">{{accountUser.name}}</span>
        </v-flex>
      </v-layout>
      <v-divider color="lightgray"></v-divider>
      <v-list>
        <div v-for="item in links" :key="item.title">
          <v-list-item v-if="item.route" link router :to="item.route" :class="uiGetThemeFontColor">
            <v-list-item-icon>
              <v-icon :class="uiGetThemeFontColor">{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content :class="uiGetThemeFontColor">
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group v-if="!item.route" no-action value="true" :class="uiGetThemeFontColor">
            <template v-slot:activator>
              <v-list-item-icon>
                <v-icon :class="uiGetThemeFontColor">{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content :class="uiGetThemeFontColor">
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="subItem in item.sub"
              :key="subItem.title"
              link
              router
              :to="subItem.route"
            >
              <v-list-item-title v-text="subItem.text" :class="uiGetThemeFontColor"></v-list-item-title>
              <v-list-item-action>
                <v-icon v-text="subItem.icon" :class="uiGetThemeFontColor"></v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list-group>
        </div>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  components: {},
  name: "Navbar",
  data: () => ({
    drawer: false,
    links: [
      {
        id: 1,
        icon: "mdi-home-outline",
        text: "Anasayfa",
        route: "/"
      },
      {
        id: 2,
        icon: "mdi-account",
        text: "Kullanıcılar",
        route: '/accountList',
      },
      {
        id: 3,
        icon: "mdi-logout",
        text: "Çıkış Yap",
        route: "/logout"
      }
    ]
  }),
  computed: {
    ...mapGetters(["serverGetName", "accountUser", "uiGetThemeFontColor", "uiGetThemeBackgroundColor"])
  }
};
</script>
