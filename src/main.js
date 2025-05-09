import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

const { createApp,ref,computed } = Vue; 
createApp({
    setup() {
        const newTask = ref("");
        const tasks = ref([]);
        const filter = ref("all");
        const addTask = () => {
            if(newTask.value.trim()) {
                tasks.value.push({text:newTask.value, completed:false});
                newTask.value = "";
            };
            const deleteTask = (index) => {
                tasks.value.splice(index,1);
            };
            const filteredTasks = computed(() => {
                if(filter.value === "active") return tasks.value.filter(t => !t.completed);
                if(filter.value === "completed") return tasks.value.filter(t => t.completed);
                return tasks.value;
            });
            return {
                newTask,
                tasks,
                filter,
                addTask,
                deleteTask,
                filteredTasks
            };
        }       
    }
}).mount("#app");