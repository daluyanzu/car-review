<template>
  
  
</template>
<!-- <script>
// lamejs  版本号为  1.2.0  最新版本会报错 属性找不到
import Recorder from "js-audio-recorder";
import { convertToMp3 } from '@/utils/recorder'
import { uploadAudio } from '@/api/mapApi.js'

// const lamejs = require("lamejs");
var recorder = new Recorder({
sampleBits: 16, // 采样位数，支持 8 或 16，默认是16
sampleRate: 48000, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
numChannels: 1 // 声道，支持 1 或 2， 默认是1
// compiling: false,(0.x版本中生效,1.x增加中)  // 是否边录边转换，默认是false
});

export default {
name: "audioRecord",
data() {
  return {
    //波浪图-录音
    drawRecordId: null,
    oCanvas: null,
    ctx: null,
    //波浪图-播放
    drawPlayId: null,
    pCanvas: null,
    pCtx: null,
    recordStatus: null,
    rm: 0, // 录音时长 分
    rs: 0, // 录音时长 秒
    ym: 0, // 播放时长 分
    ys: 0 // 播放时长 秒
  };
},
created() {
  // 绑定事件-打印的是当前录音数据
  recorder.onprogress = function(params) {
    // console.log('--------------START---------------')
    console.log("录音时长(秒)", params.duration);
    // console.log('录音大小(字节)', params.fileSize);
    // console.log('录音音量百分比(%)', params.vol);
    // console.log('当前录音的总数据([DataView, DataView...])', params.data);
    // console.log('--------------END---------------')
  };
},
mounted() {
  // this.startCanvas();
},
methods: {
  formatNum(val) {
    return val < 10 ? "0" + val : val;
  },
  // 将秒数 转为 时间
  secondsTotime(seconds) {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds - hours * 3600) / 60);
    var second = seconds - hours * 3600 - minutes * 60;
    second = Math.round(seconds * 100) / 100;
    var result =
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (second < 10 ? "0" + second : second);
    return result;
  },
  /**
   * 波浪图配置
   * */
  startCanvas() {
    //录音波浪
    this.oCanvas = document.getElementById("canvas");
    this.ctx = this.oCanvas.getContext("2d");
    //播放波浪
    this.pCanvas = document.getElementById("playChart");
    this.pCtx = this.pCanvas.getContext("2d");
  },
  /**
   *  录音的具体操作功能
   * */
  // 开始录音
  startRecorder(val) {
    this.recordStatus = val;
    let that = this;
    // 获取麦克风权限
    Recorder.getPermission().then(
      () => {
        console.log("获取权限成功，开始录音");
        recorder.start();
      },
      error => {
        console.log("请先允许该网页使用麦克风");
        // console.log(`${error.name} : ${error.message}`);
      }
    );
    // recorder.start().then(() => {
    //   this.drawRecord();//开始绘制图片
    // }, (error) => {
    //   // 出错了
    //   console.log(`${error.name} : ${error.message}`);
    // });
  },
  // 继续录音
  resumeRecorder(val) {
    this.recordStatus = val;
    recorder.resume();
  },
  // 暂停录音
  pauseRecorder(val) {
    this.recordStatus = val;
    recorder.pause();
    // this.drawRecordId && cancelAnimationFrame(this.drawRecordId);
    // this.drawRecordId = null;
  },
  // 结束录音
  stopRecorder(val) {
    this.recordStatus = val;
    recorder.stop();
    // this.drawRecordId && cancelAnimationFrame(this.drawRecordId);
    // this.drawRecordId = null;
  },
  // 录音播放
  playRecorder(val) {
    this.recordStatus = val;
    recorder.play();
    // this.drawPlay();//绘制波浪图
  },
  // 暂停录音播放
  pausePlayRecorder(val) {
    this.recordStatus = val;
    recorder.pausePlay();
  },
  // 恢复录音播放
  resumePlayRecorder(val) {
    this.recordStatus = val;
    recorder.resumePlay();
    // this.drawPlay();//绘制波浪图
  },
  // 停止录音播放
  stopPlayRecorder(val) {
    this.recordStatus = val;
    recorder.stopPlay();
  },
  // 重新录制
  resetRecorder(val) {
    this.recordStatus = val;
  },
  // 销毁录音
  destroyRecorder(val) {
    this.recordStatus = val;
    let that = this;
    recorder.destroy().then(function() {
      // recorder = null;
      that.drawRecordId && cancelAnimationFrame(that.drawRecordId);
      that.drawRecordId = null;
    });
  },
  /**
   *  获取录音文件
   * */
  getRecorder() {
    let toltime = recorder.duration; //录音总时长
    let fileSize = recorder.fileSize; //录音总大小
    //录音结束，获取取录音数据
    let PCMBlob = recorder.getPCMBlob(); //获取 PCM 数据
    let wav = recorder.getWAVBlob(); //获取 WAV 数据
    let channel = recorder.getChannelData(); //获取左声道和右声道音频数据
  },
  /**
   *  下载录音文件
   * */
  //下载pcm
  downPCM() {
    //这里传参进去的时文件名
    recorder.downloadPCM("新文件");
  },
  //下载wav
  downWAV() {
    //这里传参进去的时文件名
    recorder.downloadWAV("新文件");
  },
  /**
   *  获取麦克风权限
   * */
  getPermission() {
    Recorder.getPermission().then(
      () => {
        this.$message.success("获取权限成功");
      },
      error => {
        console.log(`${error.name} : ${error.message}`);
      }
    );
  },
  /**
   * 文件格式转换 wav-map3
   * */
  async getMp3Data() {
    const mp3Blob = convertToMp3(recorder.getWAV(), recorder);
    // recorder.download(mp3Blob, "recorder", "mp3");
    const formData = new FormData();
      formData.append('audio', mp3Blob, 'recording.mp3');

      try {
        const response = await uploadAudio(formData);

        if (response.ok) {
          console.log('Upload successful!');
        } else {
          console.error('Upload failed.');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
  },

  /**
   * 绘制波浪图-录音
   * */
  drawRecord() {
    // 用requestAnimationFrame稳定60fps绘制
    this.drawRecordId = requestAnimationFrame(this.drawRecord);
    // 实时获取音频大小数据
    let dataArray = recorder.getRecordAnalyseData(),
      bufferLength = dataArray.length;
    // 填充背景色
    this.ctx.fillStyle = "rgb(200, 200, 200)";
    this.ctx.fillRect(0, 0, this.oCanvas.width, this.oCanvas.height);
    // 设定波形绘制颜色
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "rgb(0, 0, 0)";
    this.ctx.beginPath();
    var sliceWidth = (this.oCanvas.width * 1.0) / bufferLength, // 一个点占多少位置，共有bufferLength个点要绘制
      x = 0; // 绘制点的x轴位置
    for (var i = 0; i < bufferLength; i++) {
      var v = dataArray[i] / 128.0;
      var y = (v * this.oCanvas.height) / 2;
      if (i === 0) {
        // 第一个点
        this.ctx.moveTo(x, y);
      } else {
        // 剩余的点
        this.ctx.lineTo(x, y);
      }
      // 依次平移，绘制所有点
      x += sliceWidth;
    }
    this.ctx.lineTo(this.oCanvas.width, this.oCanvas.height / 2);
    this.ctx.stroke();
  },
  /**
   * 绘制波浪图-播放
   * */
  drawPlay() {
    // 用requestAnimationFrame稳定60fps绘制
    this.drawPlayId = requestAnimationFrame(this.drawPlay);
    // 实时获取音频大小数据
    let dataArray = recorder.getPlayAnalyseData(),
      bufferLength = dataArray.length;
    // 填充背景色
    this.pCtx.fillStyle = "rgb(200, 200, 200)";
    this.pCtx.fillRect(0, 0, this.pCanvas.width, this.pCanvas.height);
    // 设定波形绘制颜色
    this.pCtx.lineWidth = 2;
    this.pCtx.strokeStyle = "rgb(0, 0, 0)";
    this.pCtx.beginPath();
    var sliceWidth = (this.pCanvas.width * 1.0) / bufferLength, // 一个点占多少位置，共有bufferLength个点要绘制
      x = 0; // 绘制点的x轴位置
    for (var i = 0; i < bufferLength; i++) {
      var v = dataArray[i] / 128.0;
      var y = (v * this.pCanvas.height) / 2;
      if (i === 0) {
        // 第一个点
        this.pCtx.moveTo(x, y);
      } else {
        // 剩余的点
        this.pCtx.lineTo(x, y);
      }
      // 依次平移，绘制所有点
      x += sliceWidth;
    }
    this.pCtx.lineTo(this.pCanvas.width, this.pCanvas.height / 2);
    this.pCtx.stroke();
  }
}
};
</script> -->
<style lang="less" scoped>
.audioBox {
color:black;
width: 100px;
height: 40px;
display: flex;
justify-content: space-around;
align-items: center;
flex-direction: column;

.boxItem {
  cursor: pointer;
  text-align: center;

  &.active {
    color: #49f66c;
  }
  &:hover {
    color: #49f66c;
  }
}
}
</style>
