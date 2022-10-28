<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col v-for="(column, index) in columns" :key="index" md="3" cols="12">
          <v-card elevation="0">
            <v-card-title>
              <v-row>
                {{ column.name }}
                <v-spacer></v-spacer>
                <v-btn v-if="index === 0" icon @click="addModal = true" width="24" height="24">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-row>
            </v-card-title>
            <v-col>
              <draggable
                v-model="column.tasks"
                class="drag_box col"
                :group="(activeDragIndex === index || activeDragIndex === index - 1) && 'tasks'"
                item-key="id"
                @change="taskChange($event, index + 1)"
                @start="activeDragIndex = index"
              >
                <template #item="{ element }">
                  <v-card color="#ebebb8" height="250" elevation="7">
                    <v-toolbar color="#ebebb8" height="40">
                      <v-chip>
                        {{ element.id }}
                      </v-chip>
                      <v-spacer></v-spacer>
                      <v-btn
                        icon="mdi-close"
                        color="primary"
                        @click="removeTask(column.value, element.id)"
                        width="32"
                        height="32"
                      ></v-btn>
                    </v-toolbar>
                    <v-card-title>
                      {{ element.title }}
                    </v-card-title>
                    <v-card-text>
                      {{ element.body }}
                    </v-card-text>
                  </v-card>
                </template>
              </draggable>
            </v-col>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="addModal" width="600">
      <v-card>
        <v-form @submit.prevent="addTask">
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="addModal = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Новый тикет</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark text @click="addModal = false" type="submit">Сохранить</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-container>
            <v-col>
              <v-text-field v-model="nameTask" label="Ваше имя"></v-text-field>
              <v-text-field v-model="contentTask" label="Задача"></v-text-field>
            </v-col>
          </v-container>
        </v-form>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  name: "App",

  components: {
    Draggable: defineAsyncComponent(() => import("vuedraggable")),
  },

  data: () => ({
    addModal: false,
    nameTask: "",
    contentTask: "",
    activeDragIndex: 0,
  }),

  mounted() {
    this.fetchTasks();
  },

  computed: {
    columns() {
      return this.$store.state.tasks.columns;
    },
  },

  methods: {
    closeModal() {
      this.addModal = false;
      this.nameTask = "";
      this.contentTask = "";
    },
    fetchTasks() {
      this.$store.dispatch("tasks/fetchAll").finally(this.initColumns);
    },
    addTask() {
      this.$store.dispatch("tasks/addTask", {
        title: this.nameTask,
        body: this.contentTask,
      });
    },
    removeTask(valueColumn, taskId) {
      this.$store.dispatch("tasks/removeTask", {
        valueColumn,
        taskId,
      });
    },
    taskChange(event, userId) {
      let data = null;
      if (event.moved) {
        data = {
          ...event.moved.element, // можно добавить вычисляемую очередность
        };
        this.$store.dispatch("tasks/changeTask", data);
      }
      if (event.added) {
        data = {
          ...event.added.element, // можно добавить вычисляемую очередность
          userId,
        };
        this.$store.dispatch("tasks/changeTask", data);
      }
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 20px 0 20px 0;
}
body {
  min-height: 100vh;
}
</style>
