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
<script>
export default {
    data() {
        return {
            newTask: "",
            alarmTime: "",
        };
    },
    methods: {
        addTask() {
            this.$emit("add-task", {
                text: this.newTask,
                alarmTime: this.alarmTime,
                completed:false,
            });
            this.newTask = "";
            this.alarmTime = null;
        },
    },
};
</script>