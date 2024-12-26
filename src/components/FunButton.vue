<template>
  <div class="text-center">
    <div style="height: 40px;width: 40px;"  @click="clickFun">
        <img style="height: 100%;width: 100%;" :src="props.buttonKey.icon" alt="">
    </div>
  
    <!-- <WheatherCom></WheatherCom> -->
    
  </div>
</template>
<script setup>

import { ref, defineProps } from 'vue';
import { getPlace, getWeather, getPlan, getChat } from '../api/mapApi.js';
import { useStore } from "vuex";

const store = useStore()
const props = defineProps({
  buttonKey: Object,
  parentKey:String
})
const loading = ref(false);
const emit = defineEmits(['updateMap', 'beginSearch', 'updateWeather', 'updatePlan']);
const getLocation = () => {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                // 成功时的回调函数
                position => {
                    // position.coords 包含经度、纬度和海拔等信息
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                   
                    store.state.location = {};
                    store.state.location = { 
                        latitude: latitude,
                        longitude: longitude
                    };
                    resolve(true); // 解析 Promise 并返回位置信息
                },
                // 失败时的回调函数
                error => {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            console.error("用户拒绝了请求地理定位。");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            console.error("位置信息不可用。");
                            break;
                        case error.TIMEOUT:
                            console.error("请求用户地理位置超时。");
                            break;
                        case error.UNKNOWN_ERROR:
                            console.error("发生未知错误。");
                            break;
                    }
                    reject(error); // 拒绝 Promise 并返回错误信息
                },
                // 可选的配置对象
                {
                    enableHighAccuracy: true, // 指示浏览器获取高精度位置
                    timeout: 5000, // 超过5000毫秒（5秒）后停止尝试获取用户位置
                    maximumAge: 0 // 接受缓存位置的最大年龄为0，意味着不接受缓存数据
                }
            );
        } else {
            // 如果浏览器不支持地理定位，则直接拒绝 Promise
            reject(new Error("浏览器不支持地理定位。"));
        }
    });
};


const clickFun = async () => {
    if(props.parentKey == 'location') {
        await findPlace()
    } else if(props.parentKey == 'aiFuntions'){
        await aiFun()
    }

}

const aiFun = async () => {
    emit('beginSearch', true)
    loading.value = true
    if (!store.state.location) {
        await getLocation();
    }

    let res = null;
    const location = store.state.location
    if (props.buttonKey.value == 'weather') {
        res = await getWeather({
            lat: location.latitude,
            lng: location.longitude
        });
        emit('beginSearch', false)
        
        if (res.msg && res.msg == 'success') {
            emit('updateWeather', res.data)
        }
        
    } else if(props.buttonKey.value == 'plan') {
        res = await getPlan({
            size: '600x200',
            lat: location.latitude,
            lng: location.longitude
        });
        emit('beginSearch', false)
        if (res.msg && res.msg == 'success') {
            emit('updatePlan', res.data)
        }
    } else if(props.buttonKey.value == 'chat') {
        res = await getChat({
            size: '600x200',
            lat: location.latitude,
            lng: location.longitude
        });
        emit('beginSearch', false)
        console.log(res)
        if (res.msg && res.msg == 'success') {
            emit('updatePlan', res.data)
        }
    }

   
    loading.value = false;
    
}

const findPlace = async () => {
    emit('beginSearch', true)
    loading.value = true
    if (!store.state.location) {
        await getLocation();
    }
    const location = store.state.location
    const res = await getPlace({
        type: props.buttonKey.value,
        lat: location.latitude,
        lng: location.longitude
    });
    
    emit('beginSearch', false)
    if (res.msg && res.msg == 'success') {
        emit('updateMap', res.data)
    }
    loading.value = false;
    
}

</script>