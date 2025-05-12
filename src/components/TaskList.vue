<template>
    <transition-group name="fade" tag="ul">
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
            <button @click="deleteTask(task.id)" class="delete-btn">
                <i class="fas fa-trash"></i>
            </button>
        </li>
    </transition-group>
    
  </template>
  
<script>
  export default {
    props: {
      tasks: {
        type: Array,
        required: true,
      },
    },
    methods: {
      deleteTask(taskId) {
        this.$emit("delete-task", taskId);
      },
      formatAlarmTime(time) {
        return new Date(time).toLocaleString();
      },
    },
  };
</script>
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
  .fade-enter-active, .fade-leave-active{
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to {
    opacity:0;
  }
</style>