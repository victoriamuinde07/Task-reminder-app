<script setup>
import {ref,computed,watchEffect,onMounted} from 'vue';
import TaskForm from "./components/TaskForm.vue";
import TaskList from "./components/TaskList.vue";
import StickyNote from "./components/StickyNote.vue";


const theme = ref(localStorage.getItem("theme") || "light");
const toggleTheme = () => {
  theme.value = theme.value === "light" ? "dark" : "light";
  localStorage.setItem("theme", theme.value);
};
const activeAlarmTimeouts = ref(new Map());
const requestNotificationPermission = () => {
  if('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Notification permission granted');

      }else{
        console.log('Notification permission denied');
      }
    });
  }
};
const showBrowserNotification = (taskTest) =>{
  if ('Notification' in window && Notification.permission === 'granted'){
    new Notification ("Task Reminder",{body: taskTest});
  }else if('Notification' in window && Notification.permission !== 'denied'){
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification("Task reminder",{body:taskText});
      }
    });
  }
};
const triggerEmailNotification = (task) => {
  if (task.userEmail) {
    console.log('EMAIL_NOTIFICATION_TODO:Send email to ${task.userEmail} for task:"${task.text}" at ${new Date(task.alarmTime).toLocaleString()}');
  };
}
const scheduleAlarm = (task) => {
  if(!task.id || !task.alarmTime) return;
  cancelAlarm(task.id);
  const alarmDate = new Date(task.alarmTime);
  const now = new Date();
  const delay = alarmDate - now;

  if (delay > 0) {
    const timeoutid = setTimeout(() => {
      showBrowserNotification(task.text);
      triggerEmailNotification(task);
      activeAlarmTimeouts.value.delete(task.id)
    },delay);
    activeAlarmTimeouts.value.set(task.id,timeoutid);
  }
};
const tasks = ref(JSON.parse(localStorage.getItem('tasks')) || []);
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
const taskDate = ref('');
const addInlineTask = () => {
  if (newTask.value.trim() === '') return;
  tasks.value.push({
    text: newTask.value,
    date: taskDate.value,
    completed: false,
    alarmTime: null,
  });
  newTask.value = '';
  taskDate.value = '';
};
const deleteInlineTask = (index) => {
  tasks.value.splice(index, 1);
};
const editTask = (index) => {
  const taskToEdit = filteredTasksForInlineList.value[index];
  const originalTaskIndex = tasks.value.findIndex(t => t === taskToEdit);

  if (originalTaskIndex === -1) return; // Should not happen

  const updatedText = prompt('Edit task:', tasks.value[originalTaskIndex].text);
  if (updatedText !== null && updatedText.trim() !== ''){
    tasks.value[originalTaskIndex].text = updatedText.trim();
  } 
};

const currentTab = ref('all'); 
const TABS = ['all','active','completed'];

const filteredTasks = computed(() => { 
  if (currentTab.value === 'active') return tasks.value.filter(t => !t.completed);
  if (currentTab.value === 'completed') return tasks.value.filter(t => t.completed);
  return tasks.value;
});
const filteredTasksForInlineList = computed(() => {
  if (currentTab.value === 'active') return tasks.value.filter(t => !t.completed);
  if (currentTab.value === 'completed') return tasks.value.filter(t => t.completed);
  return tasks.value;
});
const toggleComplete = (task) => { // Pass the actual task object
  const taskInArray = tasks.value.find(t => t === task);
  if (taskInArray) {
    taskInArray.completed = !taskInArray.completed;
  }
};

// --- Sticky Notes ---
const stickyNotes = ref(JSON.parse(localStorage.getItem('stickyNotes')) || []);
watchEffect(() => {
  localStorage.setItem('stickyNotes', JSON.stringify(stickyNotes.value));
});

const getRandomColor = () => {
  const colors = ['#ffd700', '#ffb6c1', '#98fb98', '#add8e6', '#dda0dd'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const addStickyNote = () => {
  stickyNotes.value.push({ text: '', color: getRandomColor() });
};

const updateNote = (index, text) => {
  if (stickyNotes.value[index]) {
    stickyNotes.value[index].text = text;
  }
};

const deleteNote = (index) => {
  stickyNotes.value.splice(index, 1);
};
</script>

<template>
  <div id="app" :class="theme">
    <div class="container">
      <header>
        <h1> ⏰ Riaor Reminder</h1>
          <button @click="toggleTheme" class="theme-toggle">
            <i :class="theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
          </button>
      </header>
      <TaskForm @add-task="handleAddTask"/>
      
      <ul>
        <li v-for ="(task,index) in filteredTasksForInlineList" :key="task.id || index">
          <input type="checkbox" v-model="task.completed" />
          <span :class="{completed: task.completed}">{{ task.text }}</span>
          <button @click="deleteInlineTask(index)">Delete</button>
          <button @click="editTask(index)">Edit</button>
        </li>
      </ul>
      <div class="task-tabs">
        <button 
        v-for="tab in TABS"
        :key="tab"
        @click="currentTab = tab"
        :class="{ active:currentTab === tab}"
        >
          {{tab}}
        </button>
      </div>
      <TaskList 
      v-if="tasks.length > 0 "
        :tasks="filteredTasks"
        @delete-task="handleDeleteTask"
        @toggle-complete="toggleComplete"
      />
      <div class="sticky-notes section">
        
        <div class="sticky-notes-section">
          <div class="sticky-notes-container">
            <StickyNote 
          v-for="(note, index) in stickyNotes" 
          :key="index"
          :note="note"
          @update-note="updateNote(index, $event)"
          @delete-note="deleteNote(index)"
        />
        <button @click="addStickyNote" class="add-note-btn">
          <i class="fas fa-plus"></i> Add Note
        </button>
      </div>
    </div>
    </div>
  </div>
  </div>
</template>

<style scoped>
:root {
  --primary: #42b983;
  --bg: #f9f9f9;
  --text: #dae7f5ed;
  --card-bg: #ffffff;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dark {
  --primary: #42d392;
  --bg: #b2f2f3;
  --text: #ffffff;
  --card-bg: #2d2d2d;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

#app {
  max-width: 800px;
  max-height:100vh;
  margin: 0 auto;
  background:rgb(37, 64, 72);
  padding: 30px;
  font-family: 'Arial',sans-serif;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

header h1 {
  display: flex;
  color:rgb(72, 96, 133);
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.task-text-input, .task-date-input {
  padding: 10px;
  border: 1px;
  border-radius: 4px;
  flex: 1;
}
.task-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.task-tabs button {
  padding: 8px 15px;
  background: #06070a;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.sticky-notes-section {
  margin-top: 40px;
}


.sticky-notes-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.add-note-btn {
  padding: 10px 15px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.task-tabs button.active {
  background: #42b983;
  color: white;
}

.theme-toggle {
  background:#1a1a1a;
  border: none;
  color:rgb(187, 241, 224);
  cursor: pointer;
  font-size: 1.2rem;
}
</style>

