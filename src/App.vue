<script setup>
import {ref,computed,watchEffect,onMounted} from 'vue';
import TaskForm from "./components/TaskForm.vue";
import TaskList from "./components/TaskList.vue";
import StickyNote from "./components/StickyNote.vue";
import ParticlesBackground from "./components/ParticlesBackground.vue";



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
const showBrowserNotification = (taskText) =>{
  console.log("[showBrowserNotification] Attempting to show notification",taskText);
  if (!('Notification' in window)){
    console.error("[showBrowserNotification] Browser does not support notifications");
    return;
  }
    if(Notification.permission === 'granted'){
    try {
      const notificationOptions = {
        body: taskText,
        tag : `task-reminder-${taskText.replace(/\s+/g,'-')}-${Date.now()}`, // Unique tag for testing
        requireInteraction: true,
      };
      console.log("[showBrowserNotification] Creating notification with options:", notificationOptions);
        const notification = new Notification("Task Reminder", notificationOptions);
        
        notification.onclick = () => {
          console.log("[showBrowserNotification] Notification clicked.");
          window.focus();
        };
        notification.onerror = (err) => {
          console.error("[showBrowserNotification] Notification error:", err);
        };
        notification.onshow = () => {
          // Note: 'onshow' is not universally supported by all browsers for Notification instances.
          console.log("[showBrowserNotification] Notification shown (or attempted to be shown).");
        };
        notification.onclose = () => {
          console.log("[showBrowserNotification] Notification closed.");
        };
    } catch (error) {
      console.error("[showBrowserNotification] Error creating notification:", error);
    }
  } else if (Notification.permission !== 'denied') {
    console.log("[showBrowserNotification] Requesting notification permission...");
    Notification.requestPermission().then(permissionResult => { // Renamed 'permission' to 'permissionResult' to avoid conflict
      console.log("[showBrowserNotification] Permission request result:", permissionResult);
      if (permissionResult === 'granted') {
        showBrowserNotification(taskText); // Call again to show notification now that permission is granted
      } else {
        console.warn("[showBrowserNotification] Notification permission denied after request.");
      }
    }).catch(err => {
      console.error("[showBrowserNotification] Error requesting permission:", err);
    });
  } else {
    console.warn("[showBrowserNotification] Notification permission is denied. Cannot show notification.");
  }
};
const triggerEmailNotification = (task) => {
  if (task.userEmail) {
    console.log(`EMAIL_NOTIFICATION_TODO:Send email to ${task.userEmail} for task:"${task.text}" at ${new Date(task.alarmTime).toLocaleString()}`);
  };
}
const cancelAlarm = (taskId) => {
  if (activeAlarmTimeouts.value.has(taskId)) {
    clearTimeout(activeAlarmTimeouts.value.get(taskId));
    activeAlarmTimeouts.value.delete(taskId);
    console.log(`Cancelled alarm for task ID: ${taskId}`);
  }
};

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
      activeAlarmTimeouts.value.delete(task.id);
      console.log(`Alarm triggered for task: ${task.text}`);
    },delay);
    activeAlarmTimeouts.value.set(task.id,timeoutid);
  }
};
const theme = ref('light');
const applyThemePreference = (newTheme) => {
  const htmlEl = document.documentElement;
  if(newTheme === 'dark') {
    htmlEl.classList.add('dark');
  }else{
    htmlEl.classList.remove('dark');
  }
  localStorage.setItem('theme',newTheme);
  theme.value = newTheme;
};
const toggleTheme = () => {
  const newTheme = theme.value === 'light' ? 'dark' : 'light';
    applyThemePreference(newTheme);
};
onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme) {
    applyThemePreference(savedTheme);
  }else if (prefersDark) {
    applyThemePreference('dark');
  }else{
    applyThemePreference('light');
  };

  requestNotificationPermission();
  tasks.value.forEach(task => {
    if (task.alarmTime)
      scheduleAlarm(task);
  });
});
  

const tasks = ref(JSON.parse(localStorage.getItem('tasks')) || []);
watchEffect(() => {
  localStorage.setItem("tasks", JSON.stringify(tasks.value));
});

const handleAddTask = (taskData) => {
  const newTask = { ...taskData, id:Date.now() + Math.random().toString(36).substr(2,9) };
  tasks.value.push(newTask);
  if (newTask.alarmTime) {
    scheduleAlarm(newTask);
   }
};

const handleDeleteTask = (taskId) => {
  const index = tasks.value.findIndex(t => t.id === taskId);
  if (index !== -1) {
    cancelAlarm(taskId); // Cancel any pending alarm for this task
    tasks.value.splice(index, 1);
  }
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
  stickyNotes.value.push({ 
    id: Date.now()+ Math.random().toString(36).substr(2,9) + '_note',
    text:'', 
    color: getRandomColor()
   });
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
  <div id="app">
    <ParticlesBackground />
    <div class="container">
      <header>
        <h1>Riaor Reminder</h1>
          <button @click="toggleTheme" class="theme-toggle">
            <i :class="theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
          </button>
      </header>
      <TaskForm @add-task="handleAddTask"/>
      
      <ul>
        <li v-for ="(task,index) in filteredTasksForInlineList" :key="task.id" class="inline-task-item" >
          <input type="checkbox" v-model="task.completed" class="task-checkbox-inline" />
          <span :class="{completed: task.completed}" class="task-text-inline">{{ task.text }}</span>
          <div class="task-actions-inline">
            <button @click="editTask(index)" class="edit-btn-inline">Edit</button>
            <button @click="handleDeleteTask(task.id)" class="delete-btn-inline">Delete</button>
          </div>
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
        :tasks="filteredTasksForInlineList"
        @delete-task="handleDeleteTask"
        @toggle-complete="toggleComplete"
      />
      <div class="sticky-notes section">
        
        <div class="sticky-notes-section">
          <div class="sticky-notes-container">
            <StickyNote 
          v-for="(note, index) in stickyNotes" 
          :key="note.id"
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
  --font-family:'Arial',sans-serif;
  --primary: #42b983;
  --background-color: #f9f9f9;
  --text-color: #333333;
  --button-text-color:white;
  --card-bg: #ffffff;
  --shadow: 0 2px 8px rgba(146, 138, 138, 0.1);
}
html.dark {
    --primary: #42d392;
    --card-bg: #2d2d2d;
    --shadow: 0 2px 8px rgba(149, 140, 140, 0.3);
    --button-text-color:#212121;
  }
#app {
  max-width: 800px;
  min-height:100vh;
  margin: 0 auto;
  background: transparent;
  padding: 30px;
  font-family: var(--font-family);
  color: var(--text-color);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
header h1 {
  color:var(--text-color);
  justify-content:space-between;
  align-items:center;
  margin-bottom:20px;
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
  background: var(--card-bg);
  color: var(--text-color);
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
  background:var(--primary);
  color: var(--button-text-color);
}

.theme-toggle {
  background:var(--card-bg);
  border: none;
  color:var(--text-color);
  cursor: pointer;
  font-size: 1.2rem;
}
.inline-task-item {
  display: flex;
  align-items: center;
  justify-content: space-between; /* Distributes space */
  padding: 10px 15px;
  margin-bottom: 10px;
  background-color: var(--card-bg);
  border-radius: 4px;
  box-shadow: var(--shadow);
}

.task-checkbox-inline {
  margin-right: 10px;
}

.task-text-inline {
  flex-grow: 1; /* Allows text to take available space */
  margin-right: 10px; /* Space before action buttons */
}

.task-actions-inline {
  display: flex;
  gap: 8px;
}

.edit-btn-inline,
.delete-btn-inline {
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
 
}
</style>

