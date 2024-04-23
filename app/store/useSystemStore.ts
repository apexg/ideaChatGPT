import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type{UserType} from './type'

type LoginStoreType =  Omit<UserType, 'loginTime'> ;

type State = {
  loginStore?: LoginStoreType;
  setLoginStore: (e: LoginStoreType) => void;  
};

export const useSystemStore = create<State>()(
  devtools(
    persist(
      immer((set, get) => ({        
        loginStore: undefined,
        setLoginStore(e) {
          set((state) => {
            state.loginStore = e;
          });
        },        
      })),
      {
        name: 'globalStore',
        partialize: (state) => ({
          loginStore: state.loginStore
        })
      }
    )
  )
);
