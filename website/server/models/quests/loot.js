import mongoose, { Schema } from 'mongoose';

/*
 This represents loot one can receive from a quest or a kill
*/
export const LootDropSchema = new mongoose.Schema({
  gold: Number, // gold to earn 
  exp: Number, // xp to earn
  items: [{
    type: String,
    key: String,
    text: String
  }]
});

export function createEmptyLootDrop () {
  return {
    gold: 0,
    exp: 0,
    items: []
  }
}

export function createLootDropItem (type, key, text) {
  return {
    type: "",
    key: "",
    text: ""
  }
}