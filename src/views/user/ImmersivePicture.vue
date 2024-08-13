<template>
	<canvas ref="canvas"></canvas>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';

// 开发环境绕过cors之必须，生产环境请将此置为空字符串
const proxyUrl = 'http://localhost:8080/';

const props = defineProps({
	src: {
		type: String,
		required: true
	}
});

const canvas = ref(null);
let currentPattern = null;
let newPattern = null;
let fadeProgress = 0;

const loadImage = (src) => {
	const img = new Image();
	img.crossOrigin = 'anonymous';

	img.onload = () => {
		canvas.value.width = img.width;
		canvas.value.height = img.height;
		processAndExtract(img);
		fadeProgress = 0;
		requestAnimationFrame(fadeTransition);
	};

	img.src = proxyUrl + src;
};

const fadeTransition = () => {
	const ctx = canvas.value.getContext('2d');
	const width = canvas.value.width;
	const height = canvas.value.height;

	ctx.clearRect(0, 0, width, height);

	ctx.globalAlpha = 1 - fadeProgress;
	if (currentPattern) {
		ctx.fillStyle = currentPattern;
		ctx.fillRect(0, 0, width, height);
	}

	ctx.globalAlpha = fadeProgress;
	if (newPattern) {
		ctx.fillStyle = newPattern;
		ctx.fillRect(0, 0, width, height);
	}

	if (fadeProgress < 1) {
		fadeProgress += 0.04;
		requestAnimationFrame(fadeTransition);
	} else {
		currentPattern = newPattern;
		newPattern = null;
		// 确保最后一帧不出问题
		ctx.clearRect(0, 0, width, height);
		ctx.globalAlpha = 1;
		ctx.fillStyle = currentPattern;
		ctx.fillRect(0, 0, width, height);
	}
};

const processAndExtract = (img) => {
	const tempCanvas = document.createElement('canvas');
	const tempCtx = tempCanvas.getContext('2d');
	tempCanvas.width = img.width;
	tempCanvas.height = img.height;
	tempCtx.drawImage(img, 0, 0, img.width, img.height);
	const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
	const data = imageData.data;
	for (let i = 0; i < data.length; i += 4) {
		const r = data[i];
		const g = data[i + 1];
		const b = data[i + 2];

		const gray = 0.299 * r + 0.587 * g + 0.114 * b;
		if (gray > 248) data[i + 3] = 0;
	}
	const processedCanvas = document.createElement('canvas');
	const processedCtx = processedCanvas.getContext('2d');
	processedCanvas.width = img.width;
	processedCanvas.height = img.height;
	processedCtx.putImageData(imageData, 0, 0);
	newPattern = processedCtx.createPattern(processedCanvas, 'no-repeat');
};

watch(() => props.src, (newSrc) => {
	if (typeof newSrc === 'string') loadImage(newSrc);
});

onMounted(() => {
	setTimeout(() => {
		loadImage(props.src);
	}, 300);
});
</script>

<style scoped>
canvas {
	width: 100%;
	height: auto;
	object-fit: cover;
}
</style>