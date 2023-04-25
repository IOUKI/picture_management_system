<template>
    <div class="w-full h-auto">
        <section class="w-full h-auto p-3 flex justify-center">
            <h1 class="text-5xl font-bold">圖片管理</h1>
        </section>
        <section class="w-full h-auto text-center">
            <input type="file" id="fileInput" @change="onFileSelected">
            <button type="button" @click="uploadFile"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                上傳
            </button>
        </section>
        <section id="imageArea" class="w-full h-auto flex">
        </section>
        <div class="flex flex-wrap justify-center">
            <div v-for="image in images" :key="image" class="w-full md:w-1/2 lg:w-1/3 px-2 py-2">
                <img @click="deleteImage(image)" :src="image" alt="image" class="w-full h-auto object-cover cursor-pointer">
            </div>
        </div>
    </div>
</template>

<script setup>
import { apiUrl } from '../assets/func/apiUrl.js'
import * as sweetalert from '../assets/func/allSweetalert.js'
import { nextTick, onMounted, ref } from 'vue'
import Swal from 'sweetalert2'

let images = ref([])

let selectedFile

// 將圖片文件儲存到變數
const onFileSelected = (event) => {
    selectedFile = event.target.files[0];
}
// 上傳圖片
const uploadFile = async () => {
    if (!selectedFile) {
        sweetalert.warningAlert('未選擇任何圖片')
        return;
    }
    const formData = new FormData();
    formData.append('image', selectedFile);
    try {
        const response = await fetch(apiUrl + '/images', {
            method: 'POST',
            body: formData
        });
        if (response.status === 201) {
            sweetalert.successfullyAlert('上傳成功')
            document.getElementById('fileInput').value = ""
            selectedFile = null
            getAllImage()
            return 
        } else {
            sweetalert.errorAlert('上傳失敗')
            return 
        }
    } catch (error) {
        console.error(error);
    }
}
// 取得所有圖片名稱
const getAllImage = async () => {
    const response = await fetch(apiUrl + '/images', {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

    const imageNames = await response.json()
    let imageArr = []
    imageNames.forEach(imageName => {
        let imageUrlPath = apiUrl + `/images/${imageName}`
        imageArr.push(imageUrlPath)
    })
    images.value = imageArr
    console.log(images.value)
}
// 移除圖片
const deleteImage = async (imageUrlPath) => {
    let arr = imageUrlPath.split('/')
    let imageName = arr[arr.length - 1]

    Swal.fire({
        title: '確定要移除照片?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '確定',
        cancelButtonText: '取消',
    }).then(async (result) => {
        if (result.isConfirmed) {
            const response = await fetch(apiUrl + `/images/${imageName}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response.status === 204) {
                sweetalert.successfullyAlert('移除成功')
                await getAllImage()
                return 
            } else {
                sweetalert.errorAlert('移除失敗')
            }
        }
    })

}

onMounted(async () => {
    nextTick(async () => {
        await getAllImage()
    })
})
</script>
