<template>
    <div class="text-center pa-4">
        <v-dialog v-model="dialog" max-width="360" persistent>


            <v-card text="Allow AI to execute this command?" title="Confirm Action">
                <template v-slot:actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="Agree" color="#813df4">
                        Agree
                    </v-btn>
                    <v-btn @click="Disagree">
                        Disagree
                    </v-btn>

                    
                </template>
            </v-card>
        </v-dialog>
    </div>
    <div style="height: 100%;top: 8vh;position: fixed; left: 0;width: 100%;z-index: 9;background-color: rgba(0, 0, 0, 0.2);"
        v-if="micP"> </div>

    <div class="answer">
        <div v-for="(item, index) in message" :key="index" :class="item.type === 0 ? 'message-left' : 'message-right'">
            <div class="message-container">
                <div style="margin-right: 6px;" v-if="item.type === 0">
                    <div class="avatar">
                        <img style="width: 70%;height: 70%;" src="../assets/robot.svg" alt="">
                    </div>
                </div>

                <div class="message-content">{{ item.value }}</div>
                <div style="margin-left: 6px;" v-if="item.type === 1">
                    <div class="avatar">
                        <img style="width: 70%;height: 70%;" src="../assets/robot.svg" alt="">
                    </div>
                </div>
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
    <div class="text-center mic-img-p" v-if="micP">
        <v-progress-circular :model-value="micValue" :rotate="360" :size="80" :width="12" color="teal">
            <template v-slot:default> {{ micValue }} % </template>
        </v-progress-circular>
    </div>

    <audio v-show="false" ref="audioPlayer" controls></audio>
</template>

<script>
import { ref, onMounted } from "vue";
import { uploadAudio, setDeviceStatus } from '@/api/mapApi.js';

export default {
    name: 'AppFooter',
    setup() {
        const dialog = ref(false)
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



        let micFlag = false
        let interval = null;
        const micP = ref(false)
        const startRecording = async () => {
            micValue.value = 100;
            micP.value = true;
            interval = setInterval(() => {


                if (micValue.value < 0) {
                    isBegin.value = false
                    stopRecording();
                    micFlag = true;
                } else {
                    micValue.value -= 10;
                }
            }, 1000)

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const input = audioContext.createMediaStreamSource(stream);
                recorder = new WebAudioRecorder(input, {
                    workerDir: '/web-audio-recorder-js-master/lib/', // Adjust the path to the worker.js file
                    encoding: "wav"
                });

                recorder.onComplete = async (recorder, blob) => {
                    audioChunks.push(blob);

                    const res = await uploadWav(blob);

                    if (res) {
                        audioPlayer.value.src = res;
                        audioPlayer.value.play();
                    }


                };



                recorder.setOptions({
                    timeLimit: 120,
                    encodeAfterRecord: true,

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
            current.value = null;
            const formData = new FormData();
            formData.append('audio', audioBlob);

            try {
                const response = await uploadAudio(formData);
                content.value = "Ask Celine";
                isBegin.value = false;

                const obj1 = {
                    value: response.data.question,
                    type: 1
                }
                message.value.push(obj1)
                const obj = {
                    value: response.data.text,
                    type: 0
                }

                if (response.data.type == 'received') {
                    dialog.value = true
                    current.value = response.data
                } else {
                    message.value.push(obj)
                    return response.data.audio
                }



            } catch (error) {
                console.error('Error uploading file:', error);
            }
        };

        const message = ref([ {
            value:"Hello! How can I assist you today? I'm here to help with anything related to your motorhome experience.",
            type: 0
        }


        ])

        const Agree = async () => {
            dialog.value = false
            const obj = {
                value: current.value.text,
                type: 0
            }
           
            if ( current.value.question== 'Open door step.') {
                const res = await setDeviceStatus({
                    channel:1,
                    status:'on'
                })
                audioPlayer.value.src = current.value.audio;
                audioPlayer.value.play();
                message.value.push(obj)
            } else if ( current.value.question== 'Stop opening door step.') {
                const res = await setDeviceStatus({
                    channel:1,
                    status:'off'
                })
                audioPlayer.value.src = current.value.audio;
                audioPlayer.value.play();
                message.value.push(obj)
            } else if ( current.value.question== 'Closing door step.') {
                const res = await setDeviceStatus({
                    channel:0,
                    status:'on'
                })
                audioPlayer.value.src = current.value.audio;
                audioPlayer.value.play();
                message.value.push(obj)
            } else if ( current.value.question== 'Stop closing door step.') {
                const res = await setDeviceStatus({
                    channel:0,
                    status:'off'
                })
                audioPlayer.value.src = current.value.audio;
                audioPlayer.value.play();
                message.value.push(obj)
            } else if ( current.value.question== 'Open awnings.') {
                const res = await setDeviceStatus({
                    channel:3,
                    status:'on'
                })
                audioPlayer.value.src = current.value.audio;
                audioPlayer.value.play();
                message.value.push(obj)
            } else if ( current.value.question== 'Stop opening awnings.') {
                const res = await setDeviceStatus({
                    channel:3,
                    status:'off'
                })
                audioPlayer.value.src = current.value.audio;
                audioPlayer.value.play();
                message.value.push(obj)
            } else if ( current.value.question== 'Closing awnings.') {
                const res = await setDeviceStatus({
                    channel:2,
                    status:'on'
                })
                audioPlayer.value.src = current.value.audio;
                audioPlayer.value.play();
                message.value.push(obj)
            } else if ( current.value.question== 'Stop closing awnings.') {
                const res = await setDeviceStatus({
                    channel:2,
                    status:'off'
                })
                audioPlayer.value.src = current.value.audio;
                audioPlayer.value.play();
                message.value.push(obj)
            } else {
                const obj = {
                    value:'No such received.',
                    type:0
                }
                message.value.push(obj)
            }
        }
        const Disagree = () => {
            dialog.value = false
            const obj = {
                value: 'disagree',
                type: 0
            }

            message.value.push(obj)
        }
        return {
            content,
            isBegin,
            audioPlayer,
            startLongPress,
            endLongPress, answerItems, current, micValue, micP, message, dialog, Agree, Disagree
        };
    }
};
</script>

<style scoped>
.message-content {
    height: auto;
    background-color: #813df4;
    color: white;
    border-radius: 6px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 4px;
}

.avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #813df4;
    display: flex;
    justify-content: center;
    align-items: center;
}

.message-container {
    display: flex;
    margin-bottom: 10px;
    /* flex-direction: column; */
}

.message-left {
    display: flex;
    align-items: center;

}

.message-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.app-footer-container {
    height: 12vh;
    width: 100%;
    position: sticky;
    left: 0;
    bottom: 0;
    /* background-color: #8a151b; */
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: 'Pacifico-1' !important;
    z-index: 10
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
    width: 100%;
    padding: 10px 4px;
    height: 82vh;
    overflow-y: auto;

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
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);



}
</style>