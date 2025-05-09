<script setup>import {ref,computed} from 'vue';
const newTask = ref('');
const tasks = ref([
{ text: 'A to do Task', completed: false },
]);
const filter = ref('all');
const addTask = () => {
  if (newTask.value.trim() === '') return;
  tasks.value.push({ text: newTask.value, completed: false });
  newTask.value = '';
};
const deleteTask = (index) => {
  tasks.value.splice(index, 1);
};
const editTask = (index) => {
  const taskToEdit = tasks.value[index];
  const updatedText = prompt('Edit task:', taskToEdit.text);
  if (updatedText !== null) {
    taskToEdit.text = updatedText;
  }
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
</script>


<template>
  <div>
    <h1> Task Manager </h1>
    <input v-model="newTask" @keyup.enter="addTask" placeholder="Add a task" />
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
</template>

<style scoped>
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

button {
  margin-left: 5px;
}
</style>



