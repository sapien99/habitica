import mongoose from 'mongoose';
import baseModel from '../../../libs/baseModel';

export const TYPE_INTRO = "intro"

const defaultSchema = () => ({
  id: String, // message id
  timestamp: Date, // message sent
  type: String, // type of the message  
  text: String,    
  actorId: String, // sender uuid    
  actorType: String, // sender type (user, enemy etc)
  userStyles: { $type: mongoose.Schema.Types.Mixed },
  _meta: { $type: mongoose.Schema.Types.Mixed },
});

export const BattleLogSchema = new mongoose.Schema({
  ...defaultSchema(),  
  battleId: { $type: String, ref: 'Battle' },
}, {
  minimize: false, // Allow for empty flags to be saved
  typeKey: '$type', // So that we can use fields named `type`
});

BattleLogSchema.plugin(baseModel, {
  noSet: ['_id'],
});

export const BattleLogModel = mongoose.model('BattleLog', BattleLogSchema);