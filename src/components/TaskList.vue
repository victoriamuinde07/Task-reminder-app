<template>
    <ul>
        <li v-for="(task,index) in tasks" :key="index">
            {{ task.text }}
            <span v-if="task.alarmTime">⏰ {{ formatAlarmTime(task.alarmTime) }}</span>
            <button @click

    </ul>
</template>