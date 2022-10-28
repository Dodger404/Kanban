import { createStore } from 'vuex';
import storeModuleTasks from './modules/tasks';

export default createStore({
  modules: {
    tasks: storeModuleTasks,
  },
});
