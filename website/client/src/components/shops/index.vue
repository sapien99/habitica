<template>
  <div class="row">
    <secondary-menu class="col-12">
      <router-link
        v-if="toggles.shops.enabled.market"
        class="nav-link"
        :to="{ name: 'market' }"
        exact="exact"
      >
        {{ $t('market') }}
      </router-link>
      <router-link
        v-if="toggles.shops.enabled.quests"
        class="nav-link"
        :to="{ name: 'quests' }"
      >
        {{ $t('quests') }}
      </router-link>
      <router-link
        v-if="toggles.shops.enabled.customizations"
        class="nav-link"
        :to="{ name: 'customizations' }"
      >
        {{ $t('customizations') }}
      </router-link>
      <router-link
        v-if="toggles.shops.enabled.seasonal"
        class="nav-link"
        :to="{ name: 'seasonal' }"
      >
        {{ $t('titleSeasonalShop') }}
      </router-link>
      <router-link
        v-if="toggles.shops.enabled.time"
        class="nav-link"
        :to="{ name: 'time' }"
      >
        {{ $t('titleTimeTravelers') }}
      </router-link>
    </secondary-menu>
    <div class="col-12">
      <router-view />
    </div>
  </div>
</template>

<script>
import SecondaryMenu from '@/components/secondaryMenu';
import { userStateMixin } from '../../mixins/userState';
import toggles from '@/store/toggles';

export default {
  mixins: [userStateMixin],
  components: {
    SecondaryMenu,
  },
  methods: {},
  data() {    
    return {
      toggles: toggles(this.user)
    }
  },
};
</script>
