import { Schema, model ,models} from 'mongoose';
import type {RequestLog} from '@/app/store/type.d'

export const requestCollectionName = 'requestLog';

/* RequestSchema will correspond to a collection in your MongoDB database. */
const RequestSchema =new Schema({
  corpid: {
    type: String,  
  
  },
  username: {
    type: String,  
    
  },
  request_time: {
    type: Date,
    default: () => new Date()
  },
});

try {  
  RequestSchema.index({ username: -1 }, { background: true });
  RequestSchema.index({ request_time: -1 }, { background: true });
  RequestSchema.index({ corpid: -1 }, { background: true });
} catch (error) {
  console.log(error);
}
// 3. Create a Model.
export const MongoRequest = models[requestCollectionName] || model<RequestLog>(requestCollectionName, RequestSchema);
MongoRequest.syncIndexes();
