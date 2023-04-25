<template>
    <div>
        <h1>admin</h1>
        <input type="file" ref="fileInput" @change="onFileSelected">
        <button @click="uploadFile">Upload</button>
    </div>
</template>

<script setup>
import { apiUrl } from '../assets/func/apiUrl.js'

let selectedFile

const onFileSelected = (event) => {
    selectedFile = event.target.files[0];
}
const uploadFile = async () => {
    if (!selectedFile) {
        alert('Please select a file to upload');
        return;
    }
    const formData = new FormData();
    formData.append('image', selectedFile);
    try {
        const response = await fetch(apiUrl + '/images', {
            method: 'POST',
            body: formData
        });
        console.log(response.status)
    } catch (error) {
        console.error(error);
    }
}
</script>