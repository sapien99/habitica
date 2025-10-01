import mongoose, { Schema } from 'mongoose';
import baseModel from '../../libs/baseModel';
import { EnemySchema, BattleSchema } from './battle/battle';
import { LootDropSchema } from './loot';
/*
 This represents a quest, either collection or battle
*/

const defaultSchema = () => ({
  id: String, // quest id
  type: String, // quest type (collection, battle, etc)
  name: String, // name of the quest
  notes: String, // quest notes (in short Summary)
  intro: String, // quest intro
  outro: String, // quest fulfilled/outro
  category: String, 
  difficulty: Number, // difficulty of quest - TODO: maybe calculate this 
  battle: BattleSchema, // empty/undefined if no battle
  loot: [LootDropSchema],
  enemies: [EnemySchema], 
  _meta: { $type: mongoose.Schema.Types.Mixed },
});

const QuestSchema = new mongoose.Schema({
  ...defaultSchema(),  
}, {
  minimize: false, // Allow for empty flags to be saved
  typeKey: '$type', // So that we can use fields named `type`
});

QuestSchema.plugin(baseModel, {
  noSet: ['_id'],
});

export const QuestModel = mongoose.model('Quest', QuestSchema);