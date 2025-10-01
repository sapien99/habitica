<template>
  <div
    class="card"
    :class="{
      'system-message': isSystemMessage      
    }"
  >
    <div
      v-b-tooltip.hover="messageDateForSystemMessage"
      class="message-card"

      :class="{        
        'system-message': isSystemMessage
      }"
    >            
      <div
        class="card-body"
      >        
        <p class="time">          
          <span v-b-tooltip.hover="messageDate">{{ msg.timestamp | timeAgo }}&nbsp;</span>          
        </p>
        <!--<pre>{{ msg }}</pre>-->
        <p v-if="isIntroMessage" class="initial">
          <span>{{ msg.text }}</span>
        </p>        
        <div v-else
          ref="markdownContainer"
          class="text markdown"
          dir="auto"
          v-html="parseMarkdown(msg.text)"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
// initial buchstabe
p.initial::first-letter {
  font-family: 'Uncial Antiqua', serif;
  font-size: 5rem;
  line-height: 1;
  float: left;
  margin-right: 0.5rem;
  margin-top: 0.25rem;

  /* Verzierte Initiale im Kasten */
  background: darkred;
  color: gold;
  padding: 0.25em 0.3em;
  border: 3px solid black;
  border-radius: 6px;
  box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

p.initial {
  font-family: Georgia, serif;
  font-size: 1.1rem;
  text-align: justify;
}  

.message-card {
  .at-highlight {
    background-color: rgba(213, 200, 255, 0.32);
    padding: 0.1rem;
  }

  .at-text {
    color: #6133b4;
  }

  .card-menu button {
    justify-content: center;
    margin: 0;
    padding: 0;
    height: 1rem;
    width: 1rem;
  }

  .markdown p:last-of-type {
    margin-bottom: 0;
  }
}

</style>

<style lang="scss" scoped>
@import '@/assets/scss/colors.scss';
@import '@/assets/scss/tiers.scss';

.card {
  background: transparent !important;
  margin-bottom: 0 !important;
}

.message-card:not(.system-message) {
  background: white;
}

.mentioned-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: $purple-500;
  box-shadow: 0 1px 1px 0 rgba(26, 24, 29, 0.12);
  position: absolute;
  right: -.5em;
  top: -.5em;
}

.message-hidden {
  margin-left: 1.5em;
  margin-top: 1em;
  color: red;
}

.active {
  color: $purple-300;

  .svg-icon {
    color: $purple-400;
  }
}

.message-card {
  border-radius: 7px;
  margin: 0;
  padding: 1rem 0.75rem 0.5rem 1rem;

  &.system-message {
    padding-top: 0.5rem;
  }

  .card-body {
    position: relative;
    padding: 0;

    .time {
      font-size: 12px;
      color: $gray-100;
      margin-bottom: 0.5rem;
    }

    .text {
      font-size: 14px;
      color: $gray-50;
      text-align: initial;
      min-height: 0rem;
    }
  }
}

.card-menu {
  position: absolute;
  top: 0;
  right: 0;

  &:not(.show) {
    display: none;
  }
}

.card-body:hover {
  .card-menu {
    display: block;
  }
}

hr {
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
}

.reported {
  margin-top: 18px;
  color: $red-50;
}

.selectListItem:not(:hover) .svg-icon.icon-16.color {
  color: #{$gray-100}
}

.custom-hover--red {
  --hover-color: #{$maroon-50};
  --hover-background: #{rgba($red-500, 0.25)};
}

.user-sent-message {
  border: 1px solid $purple-400;
}

.system-message {
  border: 1px solid $purple-400;
}

.user-received-message {
  border: 1px solid $gray-500;
}

.card-menu {
  // icon-color is the menu icon itself
  --icon-color: #{$gray-100};

  --dropdown-item-hover-icon-color: #{$gray-100};

  &:hover {
    --icon-color: #{$purple-300};
  }
}

.menuIcon {
  width: 4px;
  height: 1rem;
  object-fit: contain;
}

.system-message-body {
  line-height: 1.71;
  text-align: center;
  color: $purple-300;
}

</style>

<script>
import axios from 'axios';
import moment from 'moment';

import cloneDeep from 'lodash/cloneDeep';
import escapeRegExp from 'lodash/escapeRegExp';
import { CHAT_FLAG_FROM_SHADOW_MUTE, CHAT_FLAG_LIMIT_FOR_HIDING } from '@/../../common/script/constants';
import externalLinks from '../../mixins/externalLinks';

import { CopyToClipboardMixin } from '@/mixins/copyToClipboard';

import renderWithMentions from '@/libs/renderWithMentions';
import { mapState } from '@/libs/store';
import userLink from '../userLink';

import deleteIcon from '@/assets/svg/delete.svg?raw';
import reportIcon from '@/assets/svg/report.svg?raw';
import menuIcon from '@/assets/svg/menu.svg?raw';
import { userStateMixin } from '@/mixins/userState';
import copyIcon from '@/assets/svg/copy.svg?raw';
import LikeButton from '@/components/messages/likeButton.vue';

const LikeLogicMixin = {
  computed: {    
  },
  methods: {
  },
};

export default {
  components: {
    LikeButton,
    userLink,
  },
  filters: {
    timeAgo (value) {
      return moment(value).fromNow();
    },
    date (value) {
      // @TODO: Vue doesn't support this so we cant user preference
      return moment(value).toDate().toString();
    },
  },
  mixins: [
    externalLinks, userStateMixin, LikeLogicMixin,
    CopyToClipboardMixin,
  ],
  props: {
    msg: {
      type: Object,
    },
    groupId: {
      type: String,
    },
    privateMessageMode: {
      type: Boolean,
    },
    userSentMessage: {
      type: Boolean,
    },
  },
  data () {
    return {
      icons: Object.freeze({
        delete: deleteIcon,
        report: reportIcon,
        copy: copyIcon,
        menuIcon,
      }),
      reported: false,
    };
  },
  computed: {
    ...mapState({ user: 'user.data' }),    
    messageDateForSystemMessage () {
      return this.isSystemMessage ? this.messageDate : '';
    },
    messageDate () {
      const date = moment(this.msg.timestamp).toDate();
      return date.toString();
    },    
    isSystemMessage () {
      return this.msg.type === 'system';
    },
    isIntroMessage () {      
      return this.msg.type == 'intro';
    },
  },
  mounted () {
    this.$emit('message-card-mounted');
    this.handleExternalLinks();
    this.mapProfileLinksToModal();
  },
  updated () {
    this.handleExternalLinks();
    this.mapProfileLinksToModal();
  },
  methods: {
    mapProfileLinksToModal () {
      const links = this.$refs.markdownContainer && this.$refs.markdownContainer.getElementsByTagName('a') || [];
      for (let i = 0; i < links.length; i += 1) {
        let link = links[i].pathname;

        // Internet Explorer does not provide the leading slash character in the pathname
        link = link.charAt(0) === '/' ? link : `/${link}`;

        if (link.startsWith('/profile/')) {
          links[i].onclick = ev => {
            ev.preventDefault();
            this.$router.push({ path: link });
          };
        }
      }
    },

    report () {
      this.$root.$on('habitica:report-result', data => {
        if (data.ok) {
          this.reported = true;
        }

        this.$root.$off('habitica:report-result');
      });

      this.$root.$emit('habitica::report-chat', {
        message: this.msg,
        groupId: this.groupId,
      });
    },
    async remove () {
      // eslint-disable-next-line no-alert
      if (!window.confirm(this.$t('areYouSureDeleteMessage'))) {
        return;
      }

      const message = this.msg;
      this.$emit('message-removed', message);

      if (this.privateMessageMode) {
        await axios.delete(`/api/v4/inbox/messages/${message.id}`);
      } else {
        await this.$store.dispatch('chat:deleteChat', {
          groupId: this.groupId,
          chatId: message.id,
        });
      }
    },
    copy (message) {
      this.mixinCopyToClipboard(message.text, this.$t('messageCopiedToClipboard'));
    },
    parseMarkdown (text) {
      return renderWithMentions(text, this.user);
    },
  },
};
</script>
