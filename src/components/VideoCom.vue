<template>
    <div class="video-container" @touchstart="handleTouchStart">
      <iframe
        ref="youtubePlayer"
        width="100%"
        height="300"
        :src="videoUrl"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BilibiliVideo',

    data() {
      return {
        player: null
      };
    },
    computed: {
      videoUrl() {
        return `https://www.youtube.com/embed/MLHhHktbtgY?enablejsapi=1`;
      }
    },
    methods: {
      handleTouchStart() {
        console.log('触摸播放视频');
      },
      onYouTubeIframeAPIReady() {
        this.player = new YT.Player(this.$refs.youtubePlayer, {
          events: {
            onReady: this.onPlayerReady,
            onStateChange: this.onPlayerStateChange
          }
        });
      },
      onPlayerReady(event) {
        console.log('播放器已准备好');
        // 可以在这里调用播放器的方法，例如自动播放
        event.target.playVideo();
      },
      onPlayerStateChange(event) {
        console.log('播放器状态改变:', event.data);
      }
    },
    mounted() {
      // 加载 YouTube IFrame Player API
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  
        // 设置全局回调函数
        window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady;
      } else {
        this.onYouTubeIframeAPIReady();
      }
    }
  };
  </script>
  
  <style scoped>
  .video-container {
    width: 100%;
  }
  </style>