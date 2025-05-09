<script setup>
import {ref,computed,watchEffect} from 'vue';
import TaskForm from "./components/TaskForm.vue";
import TaskList from "./components/TaskList.vue";


export default {
  components: { TaskForm, TaskList},
  data() {
    return{
      tasks: JSON.parse(localStorage.getItem("tasks")) || [],
      theme: "light",
    };
  },
  methods: {
    toggleTheme() {
      this.theme = this.theme === "light" ? "dark" : "light";
    },
}
const tasks = ref(JSON.parse(localStorage.getItem('tasks')) || []);
const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks.value));
};
watchEffect(() => {
  localStorage.setItem("tasks", JSON.stringify(tasks.value));
});

const handleAddTask = (taskData) => {
  tasks.value.push(taskData);
};

const handleDeleteTask = (index) => {
  tasks.value.splice(index, 1);
};
const newTask = ref('');
const filter = ref('all');
const addTask = () => {
  if (newTask.value.trim() === '') return;
  tasks.value.push({ text: newTask.value, completed: false,alarmTime: null });
  newTask.value = '';
};
const deleteTask = (index) => {
  tasks.value.splice(index, 1);
};
const filteredTasks = computed(() => {
  if (filter.value === 'all') {
    return tasks.value;
  } else if (filter.value === 'active') {
    return tasks.value.filter((task) => !task.completed);
  } else {
    return tasks.value.filter((task) => task.completed);
  }
});
const editTask = (index) => {
  const taskToEdit = filteredTasks.value[index];
  const originalTaskIndex = tasks.value.findIndex(t => t === taskToEdit );
  const updatedText = prompt('Edit task:', taskToEdit.text);
  if (updatedText !== null && updatedText.trim() !== ''){
    tasks.value[originalTaskIndex].text = updatedText.trim();
  } 
};

</script>


<template>
  <div id="app" :class="theme">
    <div class="container">
      <header>
        <h1> ⏰ Task Reminder</h1>
          <button @click="toggleTheme" class="theme-toggle">
            <i :class="theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
          </button>
      </header>
      <TaskForm @add-task="handleAddTask"/>
      <TaskList :tasks="tasks" @delete-task="handleDeleteTask"/>
      <input v-model="newTask" @keyup.enter="addTask" placeholder="Add a task" />
      <button @click="addTask">Add Task</button>
      <ul>
        <li v-for ="(task,index) in filteredTasks" :key="index">
          <input type="checkbox" v-model="task.completed" />
          <span :class="{completed: task.completed}">{{ task.text }}</span>
          <button @click="deleteTask(index)">Delete</button>
          <button @click="editTask(index)">Edit</button>
        </li>
      </ul>
      <div>
        <button @click="filter = 'all'">All</button>
        <button @click="filter = 'active'">Active</button>
        <button @click="filter = 'completed'">Completed</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root {
  --primary: #42b983;
  --bg: #f9f9f9;
  --text: #2c3e50;
  --card-bg: #ffffff;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dark {
  --primary: #42d392;
  --bg: #1a1a1a;
  --text: #ffffff;
  --card-bg: #2d2d2d;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

#app {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  transition: background 0.3s ease;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.theme-toggle {
  background: none;
  border: none;
  color: var(--text);
  cursor: pointer;
  font-size: 1.2rem;
}
</style>
Step 3: Enhanced TaskForm.vue
vue
<template>
  <form @submit.prevent="addTask" class="task-form">
    <div class="input-group">
      <input 
        v-model="newTask" 
        placeholder="What needs to be done?" 
        class="task-input"
      />
      <input
        type="datetime-local"
        v-model="alarmTime"
        class="time-input"
        :min="new Date().toISOString().slice(0, 16)"
      />
      <button type="submit" class="add-btn">
        <i class="fas fa-plus"></i> Add Task
      </button>
    </div>
  </form>
</template>

<style scoped>
.task-form {
  margin-bottom: 2rem;
}

.input-group {
  display: flex;
  gap: 0.5rem;
}

.task-input, .time-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.add-btn {
  background: var(--primary);
  color: white;
  border: none;
  padding: 0 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.add-btn:hover {
  background: #33a06f;
}
</style>
Step 4: Enhanced TaskList.vue (With Animations)
vue
<template>
  <transition-group name="fade" tag="ul" class="task-list">
    <li v-for="(task, index) in tasks" :key="index" class="task-item">
      <div class="task-content">
        <input 
          type="checkbox" 
          v-model="task.completed" 
          class="task-checkbox"
        />
        <span :class="{ completed: task.completed }">{{ task.text }}</span>
        <div v-if="task.alarmTime" class="alarm-badge">
          <i class="fas fa-bell"></i> {{ formatAlarmTime(task.alarmTime) }}
        </div>
      </div>
      <button @click="deleteTask(index)" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </li>
  </transition-group>
</template>

<style scoped>
.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.5rem;
  background: var(--card-bg);
  border-radius: 4px;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
}

.task-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.task-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.completed {
  text-decoration: line-through;
  opacity: 0.7;
}

.alarm-badge {
  font-size: 0.8rem;
  background: #fff3bf;
  color: #5c3c00;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.delete-btn {
  background: #ff6b6b;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s;
}

.delete-btn:hover {
  background: #ff5252;
}

/* Animations */
.fade-enter-active, .fade-leave-active {
  transition: all 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
body {
  font-family:sans-serif;
  margin : 20px;
}
h1{
  text-align: center;
}
input[type="text"] {
  padding:8px;
  margin-right:8px;
  width:calc(100% - 100px);
}
.completed {
  text-decoration: line-through;
  color: grey;
}

li {
  list-style: none;
  padding: 5px 0;
  display: flex;
  align-items: center;
}

li span {
  flex-grow: 1;
  margin: 0 10px;
}
</style>



