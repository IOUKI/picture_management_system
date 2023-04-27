<template>
    <div class="w-full h-screen flex">
        <section class="w-1/2 h-full hidden lg:block justify-center bg-gray-500">
            <!-- <h1 class="text-5xl">影片</h1> -->
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
        </section>
        <section class="window w-full lg:w-1/2 h-full flex justify-center">
            <div id="imageArea" class="w-full h-full flex flex-wrap justify-center overflow-y-scroll">
                <div v-for="image in images" :key="image" class="w-full h-auto md:w-1/2 lg:w-1/3 px-2 py-2">
                    <img :src="image" alt="image" class="w-full h-auto">
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue"
import { apiUrl } from "../assets/func/apiUrl"

let images = ref([])
let running = true

const sleep = async (time) => {
    return new Promise(resolve => setTimeout(resolve, time))
}

// 取得圖片
const getAllImageLoop = async () => {
    while (running) {

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

        if (images.value !== imageArr) {
            images.value = imageArr
        }

        await new Promise(resolve => setTimeout(resolve, 3000))
    }
}

const autoScrollImage = async () => {
    const imageArea = document.getElementById('imageArea')
    await sleep(3000)
    while (running) {
        // 偵測是否到最底部
        // scrollHeight(元素內容高度的度量，包括由於溢出而在屏幕上不可見的內容) 
        // scrollTop(向上捲動高度)
        // offsetHeight(元素高度)
        if (imageArea.scrollHeight - imageArea.scrollTop === imageArea.offsetHeight) { 
            await sleep(1000)
            imageArea.scrollTo(0, 0)
        } else {
            imageArea.scrollBy(0, 1)
        }
        await sleep(10)
    }
}

onMounted(async () => {
    nextTick(async () => {
        await getAllImageLoop()
    })
    nextTick(async () => {
        await autoScrollImage()
    })
})

onBeforeUnmount(() => {
    running = false
})
</script>