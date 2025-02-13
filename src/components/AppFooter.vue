<template>
  <div class="app-footer-container" @click="toggleRecording">
    {{ content }}
  </div>
  <audio v-show="false" ref="audioPlayer" controls></audio>
</template>

<script>
import { ref } from "vue";
import { uploadAudio } from '@/api/mapApi.js';

export default {
  name: 'AppFooter',
  setup() {
    const content = ref("Ask Celine");
    const isBegin = ref(false);
    const audioPlayer = ref(null);
    let recorder = null;
    let audioChunks = [];

    const toggleRecording = async () => {
      if (!isBegin.value) {
        startRecording();
        content.value = "Recording..";
        isBegin.value = true;
      } else {
        content.value = "Loading...";
        stopRecording();
      }
    };

    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const input = audioContext.createMediaStreamSource(stream);
        recorder = new WebAudioRecorder(input, {
          workerDir: '/web-audio-recorder-js-master/lib/', // Adjust the path to the worker.js file
          onEncoderLoading: (recorder, encoding) => {
            console.log(`Loading ${encoding} encoder...`);
          },
          onEncoderLoaded: (recorder, encoding) => {
            console.log(`${encoding} encoder loaded`);
          }
        });

        recorder.onComplete = async (recorder, blob) => {
          audioChunks.push(blob);
          
          const res = await uploadWav(blob);

          audioPlayer.value.src = res;
          audioPlayer.value.play();
        };

        recorder.setOptions({
          timeLimit: 120,
          encodeAfterRecord: true,
          mp3: { bitRate: 160 } // Set options for MP3 encoding
        });

        recorder.startRecording();
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    const stopRecording = () => {
      if (recorder) {
        recorder.finishRecording();
        
      }
    };

    const uploadWav = async (audioBlob) => {
      const formData = new FormData();
      formData.append('audio', audioBlob);

      try {
        const response = await uploadAudio(formData);
        content.value = "Ask Celine";
        isBegin.value = false;
        return response.data.audio
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    };

    return {
      content,
      isBegin,
      audioPlayer,
      toggleRecording
    };
  }
};
</script>

<style scoped>

.app-footer-container {
    height: 50px;
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    background-color: #8a151b;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: 'Pacifico-1' !important;
}

</style>
