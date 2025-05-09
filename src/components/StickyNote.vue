<template>
    <div 
      class="sticky-note" 
      :style="{ backgroundColor: note.color }"
      @dblclick="isEditing = true"
    >
      <textarea
        v-if="isEditing"
        v-model="localText"
        @blur="saveNote"
        @keyup.enter="saveNote"
        autofocus
      />
      <div v-else class="note-text">
        {{ note.text || 'Double-click to edit' }}
      </div>
      <button @click="$emit('delete-note')" class="delete-note-btn">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </template>
  
  <script>
  export default {
    props: ['note'],
    data() {
      return {
        isEditing: false,
        localText: this.note.text,
      };
    },
    methods: {
      saveNote() {
        this.isEditing = false;
        this.$emit('update-note', this.localText);
      },
    },
  };
  </script>
  
  <style scoped>
  .sticky-note {
    width: 150px;
    height: 150px;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    position: relative;
    cursor: pointer;
    transition: transform 0.2s;
  }
  
  .sticky-note:hover {
    transform: rotate(2deg) scale(1.05);
  }
  
  textarea {
    width: 100%;
    height: 100%;
    background: transparent;
    border: none;
    resize: none;
    outline: none;
    font-family: inherit;
  }
  
  .note-text {
    word-break: break-word;
    height: 100%;
  }
  
  .delete-note-btn {
    position: left;
    top: 2px;
    right: 2px;
    background: rgb(6, 5, 5);
    border: none;
    color: rgba(144, 30, 30, 0.5);
    cursor: pointer;
  }
  </style>