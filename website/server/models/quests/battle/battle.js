import mongoose from 'mongoose';
import baseModel from '../../../libs/baseModel';
import { battleLogSchema, BattleLogModel } from './log';
import { LootDropSchema, createEmptyLootDrop } from '../loot';

/*
This represents an ongoing battle as a part of a quest
*/

export const EnemySchema = new mongoose.Schema({
  id: String, // enemy id  
  name: String, // name of the enemy
  notes: String, // enemy notes
  hp: Number,
  mp: Number,
  str: Number,
  dex: Number,
  int: Number,
  loot: LootDropSchema,  
  // mf: TODO abilities as function  
})

const defaultSchema = () => ({
  id: String, // message id
  timestamp: Date, // message sent
  text: String,  
  type: String, // type of the message  
  uuid: String, // sender uuid    
  userStyles: { $type: mongoose.Schema.Types.Mixed },
  _meta: { $type: mongoose.Schema.Types.Mixed },
});

export const BattleSchema = new mongoose.Schema({
  ...defaultSchema(),
  groupId: { $type: String, ref: 'Group' },
  questId: { $type: String, ref: 'Quest' },
  enemies: [EnemySchema]
}, {
  minimize: false, // Allow for empty flags to be saved
  typeKey: '$type', // So that we can use fields named `type`
});

BattleSchema.plugin(baseModel, {
  noSet: ['_id'],
});

BattleSchema.statics.rollDice = function (dice, times = 1) {
  const match = dice.match(/^d(\d+)$/);
  if (!match) {
    throw new Error("Ungültige Würfelnotation. Verwende d6, d10 oder d20.");
  }

  const sides = parseInt(match[1], 10);
  if (![6, 10, 20].includes(sides)) {
    throw new Error("Nur d6, d10 und d20 sind erlaubt.");
  }

  const results = [];
  for (let i = 0; i < times; i++) {
    results.push(Math.floor(Math.random() * sides) + 1);
  }
  return results;
}

BattleSchema.methods.getLog = function () {  
  return BattleLogModel.find({ battleId: this._id }).lean();
}

BattleSchema.methods.writeLog = function (type, obj) {  
  const log = new BattleLogModel({
    battleId: this._id,
    type: type,
    actorId: obj.actor && obj.actor._id || null,
    actorType: obj.actor && obj.actor.type || null,
    text: obj.text
  })
  return log.save()
}

EnemySchema.createEmptyEnemy = function () {
  return {
    id: "enemy",
    name: "enemy", 
    notes: "",
    hp: 1,
    mp: 0,
    str: 0,
    dex: 0,
    int: 0,
    loot: createEmptyLootDrop()    
  }
}

export const BattleModel = mongoose.model('Battle', BattleSchema);