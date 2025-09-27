<template>            
  <div class="unit" :class="'col-' + this.unit.size" 
      @mouseover="hover = true" 
      @mouseleave="hover = false"
      @click="onClick"
  >        
    
    <!-- mf: pending damage is shown as overlay -->    
    <!--<div v-if="hover" class="hp-overlay" :style="{height: unitHpPercent - pendingDmgPercent + '%'}"></div>-->    

    <Sprite
      class="quest-unit" :class="unitCssClass"
      :image-name="unit.image"      
    />    

    <div class="quest-box">
      <!--<div
        v-if="questData.collect"
        class="collect-info"
      >
        <div
          v-for="(value, key) in questData.collect"
          :key="key"
          class="quest-item-row"
        >
          <div class="quest-item-icon">
            <Sprite :image-name="'quest_' + questData.key + '_' + key" />
          </div>
          <div class="quest-item-info">
            <span class="label quest-label">{{ value.text() }}</span>
            <div class="grey-progress-bar">
              <div
                class="collect-progress-bar"
                :style="{width: (group.quest.progress.collect[key] / value.count) * 100 + '%'}"
              ></div>
            </div>
            <div class="item-progress-row">
              <span
                class="label item-progress"
                :class="{'no-items': group.quest.progress.collect[key] === 0}"
              >
                {{ group.quest.progress.collect[key] }} / {{ value.count }}
              </span>
            </div>
          </div>
        </div>
        <div
          v-if="hasPendingQuestItems"
          class="item-progress-pending mb-2"
        >
          <div class="pending-amount pt-2 pb-2">
            {{ $t('questItemsPending', { amount: user.party.quest.progress.collectedItems }) }}
          </div>
        </div>
      </div>-->
      <div        
        class="unit-info"
      >
        <!-- mf: show hp/mp values only on mouseover -->        
        <div class="row">
          <!-- health -->
          <div class="col-12">
            <div class="grey-progress-bar">
              <div
                class="unit-health-bar"
                :style="{width: unitHpPercent + '%'}"
              >
                <div
                  class="pending-health-bar"
                  :style="{width: pendingDmgPercent + '%'}"
                ></div>
              </div>
            </div>
          </div>
          <!-- mana -->
          <div v-if="unit.maxMp > 0" class="col-12">
            <div class="grey-progress-bar">
              <div
                class="unit-mana-bar"
                :style="{width: unitMpPercent + '%'}"
              >
                <!--<div
                  class="pending-mana-bar"
                  :style="{width: pendingMpInunitMpPercent + '%'}"
                ></div>-->
              </div>
            </div>
          </div>
        </div>
        <!--<div class="row unit-details">
          <div class="col-6">
            <span class="float-left hp-value">
              <div
                v-once
                class="svg-icon health-icon"
                v-html="icons.healthNoPaddingIcon"
              ></div>
              {{
                (Math.ceil(parseFloat(unit.hp) * 100) / 100)
                  | localizeNumber(user.preferences.language, { toFixed:2 })
              }} / {{
                parseFloat(unit.maxHp)
                  | localizeNumber(user.preferences.language, { toFixed:2 })
              }}
              <strong>HP</strong>
            </span>
          </div>
          <div
            v-if="user.party.quest.progress.up"
            class="col-6"
          >            
            <span class="float-right pending-value">
              <div
                v-once
                class="svg-icon sword-icon"
                v-html="icons.swordIcon"
              ></div>
              {{
                (user.party.quest.progress.up || 0)
                  | floor(10)
                  | localizeNumber(user.preferences.language, { toFixed:1 })
              }}
              {{ $t('pendingDamageLabel') }}
            </span>
          </div>
        </div>-->
      </div>
    </div>

    <div v-if="hover == true" class="info-overlay">
      <span><b>{{ unit.name }}</b></span><p/>
      <span><b>HP:</b> {{ unit.hp }}</span>
      <span><i> {{ unit.pendingDmg > 0 ? '(-'+ unit.pendingDmg +')' : ''  }}</i></span>
      <span> / {{ unit.maxHp }}</span><br/>      
      <span><b>MP:</b> {{ unit.mp }} / {{ unit.maxMp }}</span><br/>
      <!-- mf: TODO: status effects/buffs7debuffs  -->
    </div>

  </div>
</template>

<style lang="scss" scoped>
  @import '@/assets/scss/colors.scss';

  .unit {
    padding: 1px;
  }

  .targeted {
    border: darkred;
    border-style: dashed;
    border-width: medium;
  }
  
  .hp-overlay {
    position: absolute; 
    width: 100%; 
    height: 100%;     
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.2); 
  }

  .info-overlay {
    padding: 5px;
    position: absolute; 
    min-width: 200px;
    min-height: 80px;
    width: 100%; 
    height: 100%;     
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255,255,255,0.8); 
    z-index: 1000;
  }

  .svg-icon {
    height: 25px;
    width: 25px;
  }

  .quest-unit {
    margin: 0 auto 0.2rem;
    max-width: 100%;
  }

  .unit-health-bar {
    background-color: $red-50;
    height: 0.5rem;

    display: inline-block;
    position: relative;
  }

  .unit-mana-bar {
    background-color: $blue-50;
    height: 0.5rem;

    display: inline-block;
    position: relative;
  }

  .pending-health-bar {
    height: 0.5rem;
    background-color: $yellow-50;
    display: inline-block;

    position: absolute;
    right: 0;
  }

  .grey-progress-bar {
    width: 100%;
    height: 0.5rem;
    background-color: #e1e0e3;
    border-radius: 2px;
    overflow: hidden;
    display: flex;
  }  
  
</style>

<script>

import percent from '@/../../common/script/libs/percent';
import { mapState } from '@/libs/store';
import Sprite from '../ui/sprite';

import questIcon from '@/assets/svg/quest.svg?raw';
import swordIcon from '@/assets/svg/sword.svg?raw';
import rageIcon from '@/assets/svg/rage.svg?raw';
import healthNoPaddingIcon from '@/assets/svg/health_no_padding.svg?raw';
import questActionsMixin from '@/components/groups/questActions.mixin';

export default {
  components: {
    Sprite,
  },
  mixins: [questActionsMixin],
  props: ['unit', 'user', 'click'],
  data () {    
    return {
      hover: false,
      icons: Object.freeze({
        questIcon,
        healthNoPaddingIcon,
        swordIcon,
        rageIcon,
      }),
    };
  },
  computed: {  
    unitCssClass() {
      //TODO: somehow discover if the user targets this unit user.quest.target ?      
      return [, this.unit.targeted ? 'targeted' : ''];
    },    
    unitHpPercent () {
      return percent(this.unit.hp, this.unit.maxHp);
    },
    pendingDmgPercent () {
      if (this.unit.pendingDmg > this.unit.hp) {
        return 100;
      }
      return percent(this.unit.pendingDmg, this.unit.maxHp);            
    },    

    unitMpPercent () {
      return percent(this.unit.mp, this.unit.maxMp);
    },    
  },
  methods: {
    onClick() {
      //mf: thieves, assasins, ppl affected by invisibility etc can choose which target to attack, we use a callback prop here            
      this.unit.targeted = !this.unit.targeted;
      if (this.click) 
        this.click(this.unit)
    }
  },
};
</script>
