<template>
    <form @submit.prevent="addTask">
        <input v-model ="newTask" placeholder="Task" required />
        <input 
          type="datetime-local"
          v-model="alarmTime"
          :min="new Date().toISOString().slice(0, 16)"
        />
        <button type="submit">Add Task</button>
    </form>
</template>

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