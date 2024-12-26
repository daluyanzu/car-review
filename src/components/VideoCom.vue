<template>
    <div class="video-container" @touchstart="handleTouchStart">
        <iframe width="100%" height="300" src="https://www.youtube.com/embed/MLHhHktbtgY?si=be-hnCzGvjLpvOsh" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      <!-- <iframe
        :src="videoUrl"
        frameborder="0"
        allowfullscreen
        @load="handleLoad"
        style="width: 100%;"
      ></iframe> -->
      <!-- <div class="video-duration">时长：{{ duration }}秒</div> -->
    </div>
  </template>
  
  <script>
  export default {
    name: 'BilibiliVideo',
    props: {
      videoId: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        duration: 0
      };
    },
    computed: {
      videoUrl() {
        return 'https://youtu.be/MLHhHktbtgY?si=Azpl0UKOGJqVUSRz'
        // return `//player.bilibili.com/player.html?isOutside=true&aid=113683539693680&bvid=BV12dk1YnEa7&cid=27432979989&p=1`;
      }
    },
    methods: {
      handleLoad() {
        console.log('视频加载完成');
        this.getVideoDuration();
      },
      handleTouchStart() {
        console.log('触摸播放视频');
      },
      getVideoDuration() {
        this.duration = 300;
      }
    }
  };
  </script>
  
  <style scoped>
  .video-duration {
    position: absolute;
    bottom: 10px;
    right: 10px;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 5px;
    border-radius: 5px;
  }
  .video-container {
    width: 100%;
  }
  </style>