<template>
    <div class="answer">
        <!-- <v-virtual-scroll
  height="100%"
  :items="answerItems"
>
  <template v-slot:default="{ item }">
    
  </template>
</v-virtual-scroll> -->
        <!-- <v-card style="margin-bottom: 6px;" :text="current"></v-card> -->
        <div id="chat-container">
            <div id="chat-messages" ref="chatMessages">
            </div>
        </div>


    </div>
    <div class="app-footer-container">
        <div class="mic-loading" v-if="isBegin">
            <div class="music">
                <div class="item one"></div>
                <div class="item two"></div>
                <div class="item three"></div>
                <div class="item four"></div>
                <div class="item five"></div>
                <div class="item six"></div>
                <div class="item seven"></div>
            </div>
        </div>
        <img class="mic-img" src="../assets/maci.svg" alt="" @mousedown="startLongPress" @mouseup="endLongPress" 
        @touchstart="startLongPress" @touchend="endLongPress" />
    </div>
    <div class="text-center mic-img-p" v-if="micP" >
    <v-progress-circular :model-value="micValue" :rotate="360" :size="80" :width="12" color="teal">
      <template v-slot:default> {{ micValue }} % </template>
    </v-progress-circular>
  </div>
    <audio v-show="false" ref="audioPlayer" controls></audio>
</template>

<script>
import { ref, onMounted } from "vue";
import { uploadAudio } from '@/api/mapApi.js';

export default {
    name: 'AppFooter',
    setup() {
        const micValue = ref(100);

        const content = ref("Ask Celine");
        const isBegin = ref(false);
        const audioPlayer = ref(null);
        let recorder = null;
        let audioChunks = [];

        const startLongPress = (event) => {
            event.preventDefault();
            if (!isBegin.value) {
                isBegin.value = true
                micFlag = false
                startRecording();
            }
        };

        const endLongPress = (event) => {
            if (!micFlag) {
                event.preventDefault();
            isBegin.value = false
            stopRecording();
            }
            

        };
        const current = ref('Hello, l am Celine, your Caravan Enhanced Lifestyle Interactive Navigation Experience.l can help control your motorhomes systems and provide information or entertainment during your journey. How can l assist you today?')
        const answerItems = ref([])


        function getNowTime() {
            var currentTime = new Date();
            var year = currentTime.getFullYear();
            var month = currentTime.getMonth() + 1; // 月份从 0 开始，所以要加 1
            var day = currentTime.getDate();
            var hours = currentTime.getHours();
            var minutes = currentTime.getMinutes();
            var seconds = currentTime.getSeconds();

            // 格式化为两位数
            if (month < 10) {
                month = '0' + month;
            }
            if (day < 10) {
                day = '0' + day;
            }
            if (hours < 10) {
                hours = '0' + hours;
            }
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            if (seconds < 10) {
                seconds = '0' + seconds;
            }

            var formattedTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
            return formattedTime;
        }


        function formateMarkdown(message) {


            let messageHTML = ` <div class="flex-left">
                           <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAXNJREFUSEu1VktOwzAQfW7YYokbtLfwjvQktLdApBIgEcQtaE/SsPMtyA0QYZ0apoqjSWq7dkW8qZQ47zMzfq7AxEtMjI8gwb36mpOAN31Tu4TQ+xmy/FXLrU9okKBQjQFQl1ouXACFavYAcgGxfNHXlWuPl4DUZcg+zxCQALRoFz6XMQ7gUsgEoNTSi3Pygj68wmxFygzEY2fbVWPqT04O/34rA3wc0FZjJwOCjfrJDQzV9dJVG+CZN31A0DWVwGsBs0thMRC31hEfip7gQTUrAbwTaKimPtKuJ+R+znvmIqhKLZcE1JXsrtRy7QLeqO+nA0RtS2LH1gBr+yxIEJpz5rgX9K8EbCC21mEyQUxU8LEMEjBFveWUKaK9QQIeDeNZjiHiJ5tHx/gcHMMrBjCwZ1CBAYGNCRYRqVwn5XWGlG1uCnpymnZNt2EX5DLAznfpeGO2UA3FxjFVI1Z/FsZ7gxcOXYcR4Lj4yowBP7dn8n8Vv+TZ4BkEEwYiAAAAAElFTkSuQmCC" style="width: 20px;
    height: 20px;
    
}" class="avatar mr10"/>
                <div class="time-remark-wrapper" style=" display: flex;
    flex-direction: column;">
                    <span class="time" style="color: rgba(180, 187, 196);
    font-size: 12px;
    margin-bottom: 5px;">${getNowTime()}</span>
                    <div style="padding: 8px;
    border-radius: 8px;background-color: rgb(244, 246, 248);
    margin-bottom: 20px;
    padding: 10px 15px;    word-wrap:break-word;

word-break:normal; " class="message bot-message" style="display: inline-block;">
                        ${message}
                    </div>
                </div>
              
            </div>`

            return messageHTML

        }

        let micFlag = false
        let interval = null;
        const micP = ref(false)
        const startRecording = async () => {
            micValue.value = 100;
            micP.value = true;
            interval = setInterval(() => {
                

                if(micValue.value < 0) {
                    isBegin.value = false
                    stopRecording();
                    micFlag = true;
                }else {
                    micValue.value -= 10;
                }
            }, 1000)
           
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
            clearInterval(interval)
            micP.value = false;
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
                
                current.value = response.data.text
                let res = formateMarkdown(current.value)
            const chatMessages = document.getElementById("chat-messages");
            chatMessages.innerHTML = res;
                answerItems.value.push(response.data.text)
                return response.data.audio
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        };


        return {
            content,
            isBegin,
            audioPlayer,
            startLongPress,
            endLongPress, answerItems, current, micValue, micP
        };
    }
};
</script>

<style scoped>
.app-footer-container {
    height: 100px;
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    /* background-color: #8a151b; */
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: 'Pacifico-1' !important;
}

.mic-img {

    height: 80px;
    width: 80px;
    border-radius: 50%;
}

.mic-loading {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    bottom: 140px;
}

.item {
    position: absolute;
    width: 8px;
    border-radius: 6px;
    background-color: #1f94ea;

}

.music {
    display: flex;
    align-items: center;
}

.music .one {
    height: 18px;
    transform: translateX(-60px);
}

.music .two {
    height: 53px;
    transform: translateX(-40px);
}

.music .three {
    height: 36px;
    transform: translateX(-20px);
}

.music .four {
    height: 70px;
    transform: translateX(0);
}

.music .five {
    height: 30px;
    transform: translateX(20px);
}

.music .six {
    height: 40px;
    transform: translateX(40px);
}

.music .seven {
    height: 50px;
    transform: translateX(60px);
}

@keyframes radius-animation {
    100% {
        height: 10px;
        border-radius: 50%;
        filter: contrast(2);
    }
}

.music .one {
    animation: radius-animation .3s ease;
}

.music .two {
    animation: radius-animation .6s ease;
}

.music .three {
    animation: radius-animation .57s ease;
}

.music .four {
    animation: radius-animation .52s ease;
}

.music .five {
    animation: radius-animation .4s ease;
}

.music .six {
    animation: radius-animation .3s ease;
}

.music .seven {
    animation: radius-animation .7s ease;
}

.music .item {
    animation-iteration-count: infinite;
    -webkit-animation-iteration-count: infinite;
    animation-direction: alternate;
    -webkit-animation-direction: alternate;
}


#chat-messages {
    padding: 12px;
}

#chat-container {

    margin: 0 auto;
    border-width: 1px;
    border-style: solid;
    border-color: #e5e7eb;
    border-radius: 8px;
    height: calc(100% - 150px);
    box-sizing: content-box;
    position: relative;
    overflow: auto;
}

.answer {
    width: 96%;
    margin-left: 2%;
    margin-top: 10px;
    height: 80vh;

}

.flex-left {
    display: flex;
    justify-content: start;
}

.avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
}

.mr10 {
    margin-right: 10px;
}

.time {
    color: rgba(180, 187, 196);
    font-size: 12px;
    margin-bottom: 5px;
}

.time-remark-wrapper {
    display: flex;
    flex-direction: column;
}

.message {
    padding: 8px;
    border-radius: 8px;

}

.bot-message {
    background-color: rgb(244, 246, 248);
    margin-bottom: 20px;
    padding: 10px 15px;

}
.v-progress-circular {
  margin: 1rem;
}
.mic-img-p {
    position: absolute;
    left: 50%;top: 50%;
    transform: translate(-50%, -50%);



}
</style>