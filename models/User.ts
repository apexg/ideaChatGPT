import { Schema, model ,models} from 'mongoose';
import type {UserType} from '@/app/store/type.d'

export const userCollectionName = 'users';

/* UserSchema will correspond to a collection in your MongoDB database. */
const UserSchema =new Schema({
  corpid: {
    type: String,  
    
  },
  username: {
    type: String,  
    
  },
  alias_name: {    
    type: String,  
  },  
  mobile: {
     type: String,
  },
  email: {
       type: String,
  },  
  loginTime: {
    type: Date,
    default: () => new Date()
  },
  userCode:{
    type:String,
  },
});

try {
  UserSchema.index({ username: -1 });
  UserSchema.index({ corpid: -1 });
  UserSchema.index({ userCode: -1 });
} catch (error) {
  console.log(error);
}
// 3. Create a Model.
export const MongoUser = models[userCollectionName] || model<UserType>(userCollectionName, UserSchema);
MongoUser.syncIndexes();
