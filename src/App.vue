<script setup>
import HelloWorld from './components/HelloWorld.vue'
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
      <button @click="filter = 'completed '">Completed</button>
    </div>
  </div>
</template>

