<template>
    <div class="w-full h-screen flex">
        <section class="w-1/2 h-full hidden lg:flex justify-center items-center bg-gray-500">
            <h1 class="text-5xl">影片</h1>
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

let isScrollingDown = true
const autoScroll = () => {
    const imageArea = document.getElementById('imageArea')
    if (isScrollingDown) {
        imageArea.scrollBy(0, 1);
        if (imageArea.scrollTop == (imageArea.scrollHeight - imageArea.offsetHeight)) {
            isScrollingDown = false;
        }
    } else {
        imageArea.scrollTo(0, 0)
        if (imageArea.scrollTop == 0) {
            isScrollingDown = true;
        }
    }
}

onMounted(async () => {
    nextTick(async () => {
        await getAllImageLoop()
    })
    nextTick(() => {
        setInterval(autoScroll, 10)
        clearInterval(autoScroll)
    })
})
onBeforeUnmount(() => {
    running = false
})
</script>