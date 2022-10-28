import api from "@/services/api";

const getTasks = (tasks, index) => {
    return tasks.filter((item) => item.userId === index);
};

export default {
    namespaced: true,
    state: {
        columns: [],
    },
    mutations: {
        setColumns(state, tasks) {
            const columns = [
                {
                    name: "Очередь",
                    value: "queue",
                },
                {
                    name: "В работе",
                    value: "underway", 
                },
                {
                    name: "На проверке",
                    value: "review", 
                },
                {
                    name: "Выполнено",
                    value: "performed", 
                },
            ];

            columns.forEach((column, index) => {
                state.columns.push({
                    name: column.name,
                    value: column.value,
                    tasks: getTasks(tasks, index + 1),
                });
            });
        },
        addTask(state, task) {
            const columnQueue = state.columns.find((item) => item.value === 'queue');
            columnQueue.tasks.push(task);
        },
        removeTask(state, data) {
            const column = state.columns.find((item) => item.value === data.valueColumn);
            const taskIndex = column.tasks.find((item) => item.id === data.taskId);
            column.tasks.splice(taskIndex, 1);
        },
    },
    actions: {
        fetchAll({commit}){
            return new Promise ((resolve, reject) => {
                api.tasks.get().then((response) => {
                    commit('setColumns', response);
                    resolve(response);
                }).catch((err) => {
                    reject(err);
                })
            })
        },
        addTask({commit}, task){
            return new Promise ((resolve, reject) => {
                api.tasks.add(task).then((response) => {
                    commit('addTask', response);
                    resolve(response);
                }).catch((err) => {
                    reject(err);
                })
            })
        },
        removeTask({commit}, data){
            return new Promise ((resolve, reject) => {
                api.tasks.remove(data.taskId).then((response) => {
                    commit('removeTask', data);
                    resolve(response);
                }).catch((err) => {
                    reject(err);
                })
            })
        },
        changeTask(_, data){
            return new Promise ((resolve, reject) => {
                api.tasks.change(data.id).then((response) => {
                    resolve(response);
                }).catch((err) => {
                    reject(err);
                })
            })
        },
    },
}