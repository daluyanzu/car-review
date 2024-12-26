<template>
    <div class="map-container">
        <!-- <iframe width="100%" height="350px" loading="lazy" allowfullscreen
            referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDHj4PiaqPmcSUBsqjLoQ4zcnavqacD0NA
    &q=Space+Needle,Seattle+WA">
        </iframe> -->
        <div ref="map" style=" height: 400px;width: 400px;"></div>
        
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Loader } from '@googlemaps/js-api-loader';
import { useStore } from "vuex";
const store = useStore()
const map = ref(null);
let googleMap = null;
// const initialize = () => {
//       var mapProp = {
//         center: {lat: 39.9042, lng: 116.4074}, // 设置初始中心为北京
//         zoom:5,
//         mapTypeId:google.maps.MapTypeId.ROADMAP
//       };
//       googleMap = new google.maps.Map(map.value,mapProp);
//     }
const loader = new Loader({
  apiKey: "AIzaSyDHj4PiaqPmcSUBsqjLoQ4zcnavqacD0NA",
  version: "weekly",
  libraries: ["places"]
});

const mapOptions = {
  center: {
    lat: store.state.location.latitude,
    lng: store.state.location.longitude
  },
  zoom: 4
};
    
        loader
  .importLibrary('maps')
  .then(({Map}) => {
    const googleMap = new Map(map.value, mapOptions);
    var locations = [
          {lat: 39.9042, lng: 116.4074, title: "Beijing"},
          {lat: 31.2304, lng: 121.4737, title: "Shanghai"},
          {lat: 34.0522, lng: -118.2437, title: "Los Angeles"},
          {lat: 48.8566, lng: 2.3522, title: "Paris"},
          {lat: 51.5074, lng: -0.1278, title: "London"}
        ];

        // 遍历坐标点数组，并在每个位置上添加标记
        for (var i = 0; i < locations.length; i++) {
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
            map: googleMap,
            title: locations[i].title
          });
        }
  })
  .catch((e) => {
    // do something
  });
        // initialize()
       


</script>

<style scoped>
.map-container {
    width: 100%;
    height: 600px;
    position: absolute;
    top: 128px;
    margin-top: 6px;
}
</style>