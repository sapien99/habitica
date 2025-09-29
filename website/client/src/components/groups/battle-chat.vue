<template>
  <div class="row chat-row">      
      <slot name="additionRow"></slot>
      <div class="row">
        <chat-messages
          :chat.sync="group.chat"
          :group-type="group.type"
          :group-id="group._id"
          :group-name="group.name"
        />
      </div>    
  </div>
</template>

<script>
import { MAX_MESSAGE_LENGTH } from '@/../../common/script/constants';
//import externalLinks from '../../mixins/externalLinks';

import chatMessages from '../chat/chatMessages';
import { mapState } from '@/libs/store';

export default {
  directives: {    
  },
  components: {    
    chatMessages,
  },
  //mixins: [externalLinks],
  props: ['label', 'group', 'placeholder'],
  data () {
    return {
      newMessage: '',
      sending: false,
      chat: {
        submitDisable: false,
        submitTimeout: null,
      },
      textbox: null,
      MAX_MESSAGE_LENGTH: MAX_MESSAGE_LENGTH.toString(),
    };
  },
  computed: {
    ...mapState({ user: 'user.data' }),
    currentLength () {
      return this.newMessage.length;
    },
    communityGuidelinesAccepted () {
      return this.user.flags.communityGuidelinesAccepted;
    },
  },
  mounted () {    
  },
  updated () {    
  },
  methods: {
    async sendMessageShortcut () {
      // If the user recently pasted in the text field, don't submit
      if (!this.chat.submitDisable) {
        this.sendMessage();
      }
    },
    async sendMessage () {
      if (this.sending) return;
      this.sending = true;
      let response;

      try {
        response = await this.$store.dispatch('chat:postChat', {
          group: this.group,
          message: this.newMessage,
        });
      } catch (e) {
        // catch exception to allow function to continue
      }

      if (response) {
        this.group.chat.unshift(response.message);
        this.newMessage = '';
      }

      this.sending = false;

      // @TODO: I would like to not reload everytime we send. Why are we reloading?
      // The response has all the necessary data...
      const chat = await this.$store.dispatch('chat:getChat', { groupId: this.group._id });
      this.group.chat = chat;
    },
    
    fetchRecentMessages () {
      this.$emit('fetchRecentMessages');
    },
    reverseChat () {
      this.group.chat.reverse();
    },
  },
  beforeRouteUpdate (to, from, next) {
    // Reset chat
    this.newMessage = '';
    this.autoCompleteMixinResetCoordsPosition();

    next();
  },
};
</script>

<style scoped lang="scss">
  @import '@/assets/scss/colors.scss';
  @import '@/assets/scss/variables.scss';

  .chat-actions {
    margin-top: 1em;

    .chat-receive-actions {
      padding-left: 0;

      button {
        margin-bottom: 1em;

        &:not(:last-child) {
          margin-right: 1em;
        }
      }
    }

    .chat-send-actions {
      padding-right: 0;
    }
  }

  .chat-row {
    position: relative;

    .label:not(.accepted) {
      color: #a5a1ac;
    }

    .row {
      margin-left: 0;
      margin-right: 0;
      clear: both;
    }

    textarea {
      min-height: 150px;
      width: 100%;
      background-color: $white;
      border: solid 1px $gray-400;
      font-style: italic;
      line-height: 1.43;
      color: $gray-300;
      padding: 10px 12px;
    }

    .user-entry {
      font-style: normal;
      color: $black;
    }

    .hr {
      width: 100%;
      height: 20px;
      border-bottom: 1px solid $gray-500;
      text-align: center;
      margin: 2em 0;
    }

    .hr-middle {
      font-size: 16px;
      font-weight: bold;
      font-family: 'Roboto Condensed';
      line-height: 1.5;
      text-align: center;
      color: $gray-200;
      background-color: $gray-700;
      padding: .2em;
      margin-top: .2em;
      display: inline-block;
      width: 100px;
    }
  }

</style>
