<template>
    <div style="position: relative;height: 350px;">
        <v-card width="100%">
            <v-tabs v-model="tabs" color="primary" grow>
                <v-tab v-for="(item, key) in buttonManager" :key="key" :value="item.title">
                    <span>{{ item.title }}</span>
                </v-tab>
            </v-tabs>
            <v-tabs-window v-model="tabs">
                <v-tabs-window-item v-for="(item, key) in buttonManager" :key="key" :value="item.title">
                    <div class="button-container">
                        <FunButton @buttonEmit="buttonEmit" v-for="(button, buttonKey) in item.list"
                            :parentKey="item.key" :key="buttonKey" :buttonKey="button" />
                    </div>
                    <!-- <v-card> -->
                    <!-- <v-card-text> -->

                    <!-- </v-card-text> -->
                    <!-- </v-card> -->
                </v-tabs-window-item>
                <div v-if="isSearch" class="map-loading-container">
                    <img src="../assets/map.png" alt="">
                    <img src="../assets/mapLoading.svg" alt=""
                        :class="[{ 'rotating-element': mapLoading }, 'loading-icon']">
                </div>

            </v-tabs-window>
        </v-card>
        <v-main v-if="showResult">
            <v-container fluid>
                <v-card v-for="(item, key) in placeInfo" :key="key" class="mb-2" density="compact"
                    :subtitle="'distance' + item.distance" :title="item.displayName.text" variant="text" border>

                    <v-img height="128" v-if="item.image" :src="'data:image/png;base64,' + item.image" cover></v-img>
                    <v-img height="128" v-if="!item.image" src="../assets/map.png" cover></v-img>

                    <v-card-text>
                        {{ item.formattedAddress }}
                    </v-card-text>

                    <template v-slot:actions>
                        <v-btn color="primary" variant="text" @click="goGoogleMap(item)">谷歌定位</v-btn>
                    </template>
                </v-card>

            </v-container>
        </v-main>
        <div ref="map" v-if="showPlan" style=" height: 50vw;width: 100%;"></div>
        <!-- <GoogleMap></GoogleMap> -->
        <!-- <v-dialog v-model="isDialogVisible" max-width="500">
            <template v-slot:default>
                <v-card :title="weather.weather + '-' + weather.name">
                    <v-card-text>
                        temp:{{ weather.temp }}k<br>
                        humidity:{{ weather.humidity }}%<br>
                        speed:{{ weather.speed }}ms<br>
                        deg:{{ weather.deg }}°
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text="ok" @click="closeDialog"></v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog> -->
        <v-card v-if="isDialogVisible" theme="light" class="mx-auto weather-container" max-width="368">
            <v-card-item :title="weather.weather + '-' + weather.name">
                <!-- <template v-slot:subtitle>
                    <v-icon class="me-1 pb-1" color="error" icon="mdi-alert" size="18"></v-icon>
                    {{ weather.name }}
                </template> -->
            </v-card-item>

            <v-card-text class="py-0">
                <v-row align="center" no-gutters>
                    <v-col class="text-h2" cols="6">
                        {{ celsiusTemp }}&deg;C
                    </v-col>

                    <v-col class="text-right" cols="6">
                        <v-icon color="error" icon="mdi-weather-hurricane" size="88"></v-icon>
                    </v-col>
                </v-row>
            </v-card-text>

            <div class="d-flex py-3 justify-space-between">
                <v-list-item density="compact" prepend-icon="mdi-weather-windy">
                    <v-list-item-subtitle>{{ weather.speed }} km/h</v-list-item-subtitle>
                </v-list-item>

                <v-list-item density="compact" prepend-icon="mdi-weather-pouring">
                    <v-list-item-subtitle>{{ weather.humidity }}%</v-list-item-subtitle>
                </v-list-item>
            </div>

            <v-expand-transition>
                <div>
                    <v-list class="bg-transparent">
                        <v-list-item v-for="item in forecast" :key="item.day" :append-icon="item.icon"
                            :subtitle="item.temp" :title="item.day">
                        </v-list-item>
                    </v-list>
                </div>
            </v-expand-transition>

            <v-divider></v-divider>

            <v-card-actions>
                <v-btn variant="default" @click="closeDialog">ok</v-btn>
            </v-card-actions>
        </v-card>



    </div>

</template>
<script setup>
import { Loader } from '@googlemaps/js-api-loader';
import { ref, nextTick, computed } from 'vue';
import { useStore } from "vuex";
import { getPlace, getWeather, getPlan, getChat } from '../api/mapApi.js';
const store = useStore()

const location = [
    {
        title: '景点推荐',
        value: 'tourist',
        icon: 'data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyBjbGFzcz0iaWNvbiIgd2lkdGg9IjIwMHB4IiBoZWlnaHQ9IjE3MS41MnB4IiB2aWV3Qm94PSIwIDAgMTE5NCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iIzUxNTE1MSIgZD0iTTE4LjA5MDY2NyA2NTAuMjk2ODg5TDM1OC43NDEzMzMgNS43NDU3NzhsMjU3Ljk5MTExMSA0OTYuMjk4NjY2IDIxNC40NzExMTItMzUwLjIwOCAzMTYuMTMxNTU1IDQ5OC40NjA0NDV6TTExMy43Nzc3NzggNzM5LjU1NTU1Nmg5MTAuMjIyMjIydjU2Ljg4ODg4OEgxMTMuNzc3Nzc4ek0yMjcuNTU1NTU2IDg1My4zMzMzMzNoNjgyLjY2NjY2NnY1Ni44ODg4ODlIMjI3LjU1NTU1NnpNMzQxLjMzMzMzMyA5NjcuMTExMTExaDQ1NS4xMTExMTF2NTYuODg4ODg5SDM0MS4zMzMzMzN6IiAgLz48L3N2Zz4='
    },
    {
        title: '露营推荐',
        value: 'camping',
        icon: 'data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyBjbGFzcz0iaWNvbiIgd2lkdGg9IjIwMHB4IiBoZWlnaHQ9IjIwMC4wMHB4IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iIzUxNTE1MSIgZD0iTTE3OS4yIDc4OS4zMzMzMzNoMjQzLjJsLTExOS40NjY2NjctMzMyLjh6TTEwNi42NjY2NjcgNzg5LjMzMzMzM2gzOC40bDE1Ny44NjY2NjYtNDI2LjY2NjY2NiAxNDkuMzMzMzM0IDQyNi42NjY2NjZoMzguNEwzMDIuOTMzMzMzIDI1NnpNNjg2LjkzMzMzMyAyNTZoLTM4NGwxODcuNzMzMzM0IDUzMy4zMzMzMzNoMzg0eiIgLz48L3N2Zz4='
    },
    {
        title: '补给推荐',
        value: 'gas',
        icon: 'data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyBjbGFzcz0iaWNvbiIgd2lkdGg9IjIwMHB4IiBoZWlnaHQ9IjIwMC4wMHB4IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iIzUxNTE1MSIgZD0iTTY0NS42MzIgODA3LjQyNHYtMzEzLjg1NmgyMy41NTJjMTIuOCAwIDIzLjU1MiA5LjcyOCAyMy41NTIgMjEuNTA0djE5OS42OGMwIDUxLjIgNDUuMDU2IDkyLjY3MiAxMDAuODY0IDkyLjY3MiA1NS44MDggMCAxMDAuODY0LTQxLjQ3MiAxMDAuODY0LTkyLjY3MnYtMzg0YzAtMTkuOTY4LTkuMjE2LTM4LjQtMjMuNTUyLTUxLjJsLTgyLjQzMi03NS4yNjRjLTE0Ljg0OC0xMy44MjQtMzguOTEyLTEzLjgyNC01My43NiAwcy0xNC44NDggMzUuODQgMCA0OS42NjRsNTMuMjQ4IDQ5LjE1Mi0zOS40MjQgMzcuODg4Yy0xMi44IDEyLjI4OC0xMi44IDMxLjc0NCAwIDQ0LjAzMiA2LjE0NCA2LjE0NCAxNC44NDggOS4yMTYgMjMuNTUyIDkuMjE2aDQ0LjU0NFY3MTUuMjY0YzAgMTEuNzc2LTEwLjI0IDIxLjUwNC0yMy41NTIgMjEuNTA0LTEyLjggMC0yMy41NTItOS43MjgtMjMuNTUyLTIxLjUwNHYtMTk5LjY4YzAtNTEuMi00NS4wNTYtOTIuNjcyLTEwMC44NjQtOTIuNjcyaC0yMy4wNHYtMTcxLjAwOGMwLTMxLjc0NC0yNy42NDgtNTYuODMyLTYyLjQ2NC01Ni44MzJoLTMyNi4xNDRjLTM0LjMwNCAwLTYyLjQ2NCAyNS42LTYyLjQ2NCA1Ni44MzJWODA3LjQyNGgtNy42OGMtMjEuNTA0IDAtMzguOTEyIDE1Ljg3Mi0zOC45MTIgMzUuODRzMTcuNDA4IDM1Ljg0IDM4LjkxMiAzNS44NGg0NjYuNDMyYzIxLjUwNCAwIDM4LjkxMi0xNS44NzIgMzguOTEyLTM1Ljg0cy0xNy40MDgtMzUuODQtMzguOTEyLTM1Ljg0aC03LjY4eiBtLTMzOC45NDQtNTQxLjY5NmgyMjYuODE2YzE4Ljk0NCAwIDM0LjMwNCAxMy44MjQgMzQuMzA0IDMxLjIzMnYxNTEuMDRjMCAxNy40MDgtMTUuMzYgMzEuMjMyLTM0LjMwNCAzMS4yMzJoLTIyNi44MTZjLTE4Ljk0NCAwLTM0LjMwNC0xMy44MjQtMzQuMzA0LTMxLjIzMnYtMTUxLjA0YzAtMTcuNDA4IDE1LjM2LTMxLjIzMiAzNC4zMDQtMzEuMjMyeiIgIC8+PC9zdmc+'
    },
    {
        title: '美食推荐',
        value: 'food',
        icon: 'data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyBjbGFzcz0iaWNvbiIgd2lkdGg9IjIwMHB4IiBoZWlnaHQ9IjIwMC4wMHB4IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iIzUxNTE1MSIgZD0iTTUxMiAyLjY3MkMyMzEuMTUyIDIuNjcyIDIuNjcyIDIzMS4xNTIgMi42NzIgNTEyUzIzMS4xNTIgMTAyMS4zMjggNTEyIDEwMjEuMzI4YzI4MC44NDggMCA1MDkuMzQ0LTIyOC40NjQgNTA5LjM0NC01MDkuMzI4Uzc5Mi44NDggMi42NzIgNTEyIDIuNjcyeiBtMCA5ODcuNzc2QzI0OC4xNzYgOTkwLjQ0OCAzMy41MzYgNzc1LjgyNCAzMy41MzYgNTEyIDMzLjUzNiAyNDguMTc2IDI0OC4xNzYgMzMuNTM2IDUxMiAzMy41MzZjMjYzLjg0IDAgNDc4LjQ2NCAyMTQuNjQgNDc4LjQ2NCA0NzguNDY0Uzc3NS44NCA5OTAuNDQ4IDUxMiA5OTAuNDQ4ek01MTIgNzQuNjcyQzI3MC40NjQgNzQuNjcyIDc0LjY3MiAyNzAuNDY0IDc0LjY3MiA1MTJjMCAyNDEuNTM2IDE5NS43OTIgNDM3LjMyOCA0MzcuMzI4IDQzNy4zMjggMjQxLjU2OCAwIDQzNy4zNDQtMTk1Ljc3NiA0MzcuMzQ0LTQzNy4zMjhDOTQ5LjM0NCAyNzAuNDY0IDc1My41NjggNzQuNjcyIDUxMiA3NC42NzJ6TTM3Mi44MTYgMzc0LjI0djAuMTEyLTAuMTEyeiBtODUuNDQgODcuNmMtMjAuMDggNy4xNjgtMTguNDk2IDEzLjU2OC0xOC40OTYgMTMuNTY4czI1Ljk2OCAyNTYuMzIgMjUuOTY4IDI3My4wODhjMCAxNi43NjgtNi4xNiAyMy42OTYtMTUuMDQgMzAuNzM2LTkuMDcyIDcuMDU2LTIzLjA1NiAxMC40OTYtMzYuMzM2IDEwLjQ5NmgtMC42NTZjLTEzLjMyOCAwLTI3LjQ0LTMuNDQtMzYuMzItMTAuNDk2LTguOTYtNy4wMjQtMTUuNDA4LTE2LjExMi0xNS40MDgtMzAuNzM2IDAtMTQuNTc2IDI1Ljg4OC0yNzMuMDI0IDI1Ljg4OC0yNzMuMDI0cy0wLjE3Ni02LjcwNC0xOC4zMDQtMTMuMjE2Yy0zNS44NTYtMTIuOTc2LTU5LjQ4OC00MS42NDgtNTkuNDg4LTc0LjU5MiAwLTU1LjM0NCAyNC4yODgtMTE5LjI4IDM4LjU3Ni0xNzEuODI0aDEyLjk3NmwwLjY1NiAxNDkuNzc2YzAgNy44MjQgNC44NjQgMTQuMjI0IDE0Ljc1MiAxNC4yMjQgOS40MjQgMCAxNC40NDgtNS41MiAxNS40MDgtMTIuNjcybDAuMTc2LTEuNDI0IDE0LjU3Ni0xNDkuOTA0aDEyLjk5MmwxNi43MDQgMTQ5Ljc3NmMwIDAuNTQ0LTAuMTc2IDEuMDA4IDAgMS41NTIgMC45NiA3LjE2OCA0LjY3MiAxMi42NzIgMTMuOTM2IDEyLjY3MiA5Ljg4OCAwIDE0LjU3Ni02LjQgMTQuNTc2LTE0LjIyNGwwLjMwNC0xNDkuNzc2aDEyLjk3NnYwLjM1MmMxNC42NCA1MS45MDQgMzguOTI4IDExNiAzOC45MjggMTcxLjM0NC0wLjAzMiAzMy4wNzItMjQuMzIgNjEuNzQ0LTU5LjM0NCA3NC4zMDR6TTcwOS4xMiA3NjMuNDU2Yy0wLjA0OCAyMS40MDgtNi45OTIgMzUuMDI0LTMyLjgxNiAzNC45NzYtMjUuNzc2LTAuMDY0LTMxLjQwOC0xMy43NDQtMzEuMzYtMzUuMTM2bC0wLjc1Mi0xNzkuNjY0Yy0wLjk2IDAuMDgtMTA0LjI0LTkuNzYtOTcuMzYtODguMjcyIDAgMCAyOS41NjgtMjcxLjA3MiAxNDAuNjU2LTI3MC44OTYgMjguMzM2IDAuMDY0IDIxLjEwNCA1OS4zMTIgMjEuMTA0IDU5LjMxMmwwLjUyOCA0NzkuNjh6IiAvPjwvc3ZnPg=='
    },
    {
        title: '车辆维修',
        value: 'repair',
        icon: 'data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyBjbGFzcz0iaWNvbiIgd2lkdGg9IjIwMHB4IiBoZWlnaHQ9IjIwMC4wMHB4IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iIzUxNTE1MSIgZD0iTTIzNy41OCA3NDAuMjNMMTc2LjY2IDc1MyA2Ny4yNCA5MTcuODlsMjAuNiAyMC40OSAyMC42IDIwLjUyIDE2Ni4xNC0xMDguNzIgMTIuOTEtNjAuNDhMNDI0LjEzIDY1NGwtNDkuNzgtNDkuNTN6IG01OTUuODQtNjIwLjg4YTE0Ljg0IDE0Ljg0IDAgMCAxIDIwLjkyIDAgMTQuNSAxNC41IDAgMCAxIDAgMjAuOEw2MTQuNjMgMzc4LjIzIDY1MiA0MTUuMzggODkxLjY3IDE3Ny4zYTE0Ljg3IDE0Ljg3IDAgMCAxIDIxIDAgMTQuNSAxNC41IDAgMCAxIDAgMjAuODFsLTIzOS43IDIzOCAzMy41NyAzMy4zMWMwLjU3LTAuNTMgMS4xNS0wLjg0IDEuNzItMS40NWwyNS4zNi0yNS4xNyAyMDMuMTktMjAxLjdhMTAyLjQgMTAyLjQgMCAwIDAgMC0xNDUuNjggMTA0LjI0IDEwNC4yNCAwIDAgMC0xNDYuNzUgMEw1ODguMTIgMjk1Ljg0bC0yNi42NCAyNi40OGMtMC41MSAwLjYtMC45IDEuMjMtMS40IDEuNzZsMzMuNTEgMzMuMzd6TTQ4OC4yMyAzMTIuMjhhMjEwLjczIDIxMC43MyAwIDAgMCAyLjYtNTYuODggMjA3IDIwNyAwIDAgMC02MC41My0xMjguNTdDMzY4LjE3IDY1LjIxIDI3NyA1MC4yOCAyMDAuNyA4MS45MUwzMjQgMjA0LjE5YTQ3LjE0IDQ3LjE0IDAgMCAxLTAuMDcgNjYuOWwtNTEuNDQgNTFhNDcuNjggNDcuNjggMCAwIDEtNjcuMTQgMEw4NC43OCAyMDIuNGEyMDcuMTMgMjA3LjEzIDAgMCAwIDQ4LjM5IDIxOS4zOSAyMDkuNyAyMDkuNyAwIDAgMCAxMTUuOTIgNTguMzMgMjEzLjMgMjEzLjMgMCAwIDAgNjAuNjYgMC42M2MxMjguMjUgMTI3LjQ0IDQ0NSA0NDEuOSA0NDUgNDQxLjkgNDguMDYgNDcuNjQgMTI2LjE0IDQ3LjY0IDE3NC4xNSAwYTEyMS41NCAxMjEuNTQgMCAwIDAtMC4wNy0xNzIuODV6TTg5MSA4ODVhNjQuNTUgNjQuNTUgMCAwIDEtOTAuOCAwLjA3IDYzLjUgNjMuNSAwIDAgMSAwLjA3LTkwIDY0LjU5IDY0LjU5IDAgMCAxIDkwLjY2IDAgNjMuMjMgNjMuMjMgMCAwIDEgMC4wNyA5MHogbTAgMCIgIC8+PC9zdmc+'
    },
]

const tabs = ref('');

const aiFuntions = [
    {
        title: '社交互动',
        value: 'chat',
        icon: 'data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyBjbGFzcz0iaWNvbiIgd2lkdGg9IjIwMHB4IiBoZWlnaHQ9IjIwMC4wMHB4IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iIzUxNTE1MSIgZD0iTTgwMy45ODUgNDA1LjA3NmMtMC41MjcgOC4zNDItMS40NTYgMTcuMDM2LTIuNzM1IDI2LjE2OS0yMS43MjkgMTUwLjM4LTE0MC44NzcgMjU5LjQ4OS0yODMuNDYgMjU5LjQ4OWgtNDYuMzcxbC04LjUzMSA4Ljc2N2MzMi4wMTYgNTkuNTE2IDkxLjUzNCA5Ny45NjggMTU4LjQwNCA5Ny45NjhoNDYuMDhsOTEuMzQ4IDk1LjY3YzUuODk2IDUuODk1IDEzLjg3NSA5LjEyIDIyLjA4IDkuMTIgMy43ODkgMCA3LjY3Ny0wLjQyNyAxMS4zOTEtMi4wMDggMTEuNTA1LTQuNzQxIDE5LjEwOC0xNS44ODIgMTkuMTA4LTI4LjYwM3YtNzcuNzY3Yzg1LjAyMy0xNy40MDIgMTQ3Ljg3OC05Ny41NTQgMTQ3Ljg3OC0xOTQuMDAzIDAtOTguNDA0LTY3LjQyMS0xODAuMTM2LTE1NS4xOTItMTk0LjgwMnpNNTE3Ljc5IDEyMS43NEgzMDcuODg1QzE3My44MiAxMjEuNzQgNjQuODIgMjM5LjYxNSA2NC44MiAzODQuNDUyYzAgMTI5Ljc0NCA4NS44MDIgMjM2Ljg0MyAyMDAuODk2IDI1OC4yNzF2MTEwLjdjMCAxNC4yOSA4LjgyIDI3LjM3NSAyMi4yNyAzMi45N2EzOC4xMzggMzguMTM4IDAgMCAwIDEzLjI2IDIuMzg0YzkuNTEgMCAxOC44NjktMy41ODggMjUuNjk0LTEwLjcxNWwxMjUuNzM0LTEzMS4zMzhoNjUuMTE0YzEyMC40OSAwIDIyMS4zOTYtOTMuMjc0IDIzOS45NTEtMjIxLjgwMSAyLjEzMy0xNC43MjkgMy4xMTItMjguMTc3IDMuMTEyLTQwLjQ3MSAwLjAwMS0xNDQuODM3LTEwOC45OTgtMjYyLjcxMi0yNDMuMDYyLTI2Mi43MTJ6TTI0Mi4wMDYgNDEzLjc5NGMtMTkuNjcyIDAtMzUuNjE3LTE1Ljk0NS0zNS42MTctMzUuNjAzIDAtMTkuNjcgMTUuOTQ1LTM1LjYxNiAzNS42MTctMzUuNjE2czM1LjYwNiAxNS45NDYgMzUuNjA2IDM1LjYxNmMwIDE5LjY2LTE1LjkzNCAzNS42MDMtMzUuNjA2IDM1LjYwM3ogbTE4NC40NzQgMGMtMTkuNjczIDAtMzUuNjA1LTE1Ljk0NS0zNS42MDUtMzUuNjAzIDAtMTkuNjcgMTUuOTMyLTM1LjYxNiAzNS42MDUtMzUuNjE2IDE5LjY3MiAwIDM1LjYwNSAxNS45NDYgMzUuNjA1IDM1LjYxNiAwIDE5LjY2LTE1LjkzMyAzNS42MDMtMzUuNjA1IDM1LjYwM3ogbTE4NC40NzQgMGMtMTkuNjYgMC0zNS42MDQtMTUuOTQ1LTM1LjYwNC0zNS42MDMgMC0xOS42NyAxNS45NDUtMzUuNjE2IDM1LjYwNC0zNS42MTYgMTkuNjczIDAgMzUuNjE5IDE1Ljk0NiAzNS42MTkgMzUuNjE2IDAgMTkuNjYtMTUuOTQ2IDM1LjYwMy0zNS42MTkgMzUuNjAzeiIgLz48L3N2Zz4='
    },
    {
        title: '截图保存',
        icon: 'data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyBjbGFzcz0iaWNvbiIgd2lkdGg9IjIwMHB4IiBoZWlnaHQ9IjIwMC4wMHB4IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iIzUxNTE1MSIgZD0iTTkwOC40MzQyODYgNjg5LjUxNzcxNGg1Ni44MzJhNTYuNzU4ODU3IDU2Ljc1ODg1NyAwIDAgMSAwIDExMy41MTc3MTVoLTU2LjgzMnY1Ni43NTg4NTdhNTYuNzU4ODU3IDU2Ljc1ODg1NyAwIDAgMS0xMTMuNTkwODU3IDB2LTU2Ljc1ODg1N0gxNzAuNDIyODU3YTU2LjgzMiA1Ni44MzIgMCAwIDEtNTYuODMyLTU2LjgzMlYyOTIuMDU5NDI5SDU2LjgzMmE1Ni43NTg4NTcgNTYuNzU4ODU3IDAgMCAxIDAtMTEzLjU5MDg1OGg1Ni44MzJ2LTU2LjgzMmE1Ni43NTg4NTcgNTYuNzU4ODU3IDAgMCAxIDExMy41MTc3MTQgMHY1Ni44MzJoNjI0LjU2Njg1N2MzMS4zMDUxNDMgMCA1Ni44MzIgMjUuNDUzNzE0IDU2LjgzMiA1Ni44MzJ2NDU0LjE0NGgtMC4xNDYyODV6TTMzNC43MDE3MTQgMzQ4LjgxODI4NmE1Ni43NTg4NTcgNTYuNzU4ODU3IDAgMSAwIDExMy41MTc3MTUgMy44MDM0MjggNTYuNzU4ODU3IDU2Ljc1ODg1NyAwIDAgMC0xMTMuNTE3NzE1LTMuODAzNDI4ek03MzcuMjggNjE0LjRMNjYyLjM4MTcxNCA0MTQuMzU0Mjg2YTEzLjUzMTQyOSAxMy41MzE0MjkgMCAwIDAtMTEuNDgzNDI4LTguODUwMjg2IDEzLjY3NzcxNCAxMy42Nzc3MTQgMCAwIDAtMTMuMTY1NzE1IDYuMTQ0TDU1Mi45NiA1NDEuMTEwODU3YTE0LjA0MzQyOSAxNC4wNDM0MjkgMCAwIDEtMTcuODQ2ODU3IDQuODI3NDI5TDM5MC4wNzA4NTcgNDc1LjQyODU3MWExMy45NzAyODYgMTMuOTcwMjg2IDAgMCAwLTE3Ljg0Njg1NyA0LjgyNzQyOUwyODYuMTM0ODU3IDYxMS44NGExMi45NDYyODYgMTIuOTQ2Mjg2IDAgMCAwLTAuNTEyIDEzLjg5NzE0MyAxMy42Nzc3MTQgMTMuNjc3NzE0IDAgMCAwIDEyLjE0MTcxNCA2Ljk0ODU3MWg0MjYuNDIyODU4YTEzLjUzMTQyOSAxMy41MzE0MjkgMCAwIDAgMTEuNDEwMjg1LTUuNzA1MTQzIDEyLjg3MzE0MyAxMi44NzMxNDMgMCAwIDAgMS42ODIyODYtMTIuNDM0Mjg1eiIgLz48L3N2Zz4='
    },
    {
        title: '天气情况',
        value: 'weather',
        icon: 'data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyBjbGFzcz0iaWNvbiIgd2lkdGg9IjIwMHB4IiBoZWlnaHQ9IjIwMC4wMHB4IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTkzNi4yNTAyNDMgNzk3LjUxMTc4OGMtMjkuOTgzMTUzIDM2LjA0MDQ2Ni03NC4xNTYwMjEgNjQuNDkwMzI4LTEyNi4yODc5MTUgNjQuNDkwMzI4SDI4OC44NTAzNTNjLTIwLjUxOTU1MS0xLjI2NzgxLTQxLjM0NjMwMy05LjQ1NDM5Mi02MC40NTgyNi0yMS45NjQ1MjktNDguODU0MDExLTI4LjI5ODE1OS04MS43MTUyLTgxLjExMjcyLTgxLjcxNTItMTQxLjU5MzczNWExNjQuMDcxMzQ4IDE2NC4wNzEzNDggMCAwIDEgMy40ODY0NzYtMzMuNjk5ODk0IDY2LjMyMjE1IDY2LjMyMjE1IDAgMCAxIDMuNzQ5NzkxLTE0LjUyNTYzQzE3NC41MTM0MzkgNTgzLjQyNTM1NCAyMzYuNzY2MTM4IDUzNC44ODUwNDYgMzEwLjM3NDQgNTM0Ljg4NTA0NmgwLjEzODE1OWMtMC4wODE4MTItMi4zNDk3ODItMC4xMzgxNTktNC43MDYwNjYtMC4xMzgxNTktNy4wNzUzNTMgMC0xMTAuNDkxNzY3IDg5LjY0NzEzNy0yMDAuMDYzMDUyIDIwMC4yMzIwOTMtMjAwLjA2MzA1MiA5OS44ODcxMzcgMCAxNzcuNzgxNTcgNjEuMjAwNTI1IDE5OS42NjQ4MyAxNTguNDY1ODk3IDI1LjM5NDExNi0xMi4zMjM3NTkgNTIuMDA3MjgtMTcuNTQ0NTMzIDgyLjEzMTMwMS0xNy41NDQ1MzQgMTA2LjM2NTk2OCAwIDE5Mi41ODc4NTIgOTQuNjM5MjcyIDE5Mi41ODc4NTIgMjAwLjkxMzEzNWExOTEuNTk5NjExIDE5MS41OTk2MTEgMCAwIDEtNDguNzQwMjMzIDEyNy45MzA2NDl6IG0tMjcuMjQxNjUtMjIuMDk0NTZjLTI3LjIyNTM5NyAzMS4zMTA1NjEtNjcuMzQwMTkgNTYuMDIyMDExLTExNC42ODI1ODIgNTYuMDIyMDFIMzEyLjAzNzE4MWMtMTguNjM0MDkxLTEuMDk5ODUyLTM3LjU0NjY2Ny04LjIwODI1NC01NC45MDI2NTQtMTkuMDc2NzQxLTQ0LjM2NDY2NS0yNC41ODY4MzYtNjUuMzA5NTI4LTUyLjkyODMzOS03MC44MDk4NzEtMTA3LjEyNDQ4Ni0xLjc4NzkzNy0xNy42MzU1NTYgMi4yMjc4NzctMzUuNzA0NTUgNC4yOTg2MzMtNDUuMTUzNTI0YTU1LjUzNDM5MiA1NS41MzQzOTIgMCAwIDEgMy40MDUyMDYtMTIuNjEzMDhjMTguNzA1MDY3LTU4LjAyMTI0OSA3Ni4zMzE4ODYtODcuMjAyNTQgMTQzLjE3NTI0Ny04Ny4yMDI1MzloMC4xMjU2OTdhMTY5LjE4MjEzOCAxNjkuMTgyMTM4IDAgMCAxLTAuMTI1Njk3LTYuMTQ5NDE4YzAtOTUuOTgwNzY2IDY2LjE4MDE5OS0xOTYuMDkzMjkxIDE3Mi41NTEwNDMtMTk1LjI0NDI5MiAxMDUuOTk3NTQ1IDAuODQ1NzQ4IDE2OC42ODkxMDEgODkuNTk1NjY2IDE4Mi4zOTExOTYgMTcyLjYxMzg5MiAyMy4wNTg5NjMtMTAuNzA0ODYzIDUzLjAzNjY5OC0yOC41Mjg5NjUgOTQuMDIzNzg4LTI4LjI5NzA3NSA5My4xMDgxNDggMC41MjY2MjkgMTYyLjU2Njc3MiA2OC43Nzk3NSAxNjIuNTY2NzczIDE2MS4wOTY4NzIgMC4wMDIxNjcgNDIuNjY2NjY3LTEyLjE5OTE0NSA4MS41ODk1MDMtMzkuNzI3OTQ5IDExMS4xMjgzODF6IiBmaWxsPSIjN0Q3RDdEIiAvPjxwYXRoIGQ9Ik05MzYuMjUwMjQzIDc5Ny41MTE3ODhjLTI5Ljk4MzE1MyAzNi4wNDA0NjYtNzQuMTU2MDIxIDY0LjQ5MDMyOC0xMjYuMjg3OTE1IDY0LjQ5MDMyOEgyODguODUwMzUzYy0yMC41MTk1NTEtMS4yNjc4MS00MS4zNDYzMDMtOS40NTQzOTItNjAuNDU4MjYtMjEuOTY0NTI5LTQ4Ljg1NDAxMS0yOC4yOTgxNTktODEuNzE1Mi04MS4xMTI3Mi04MS43MTUyLTE0MS41OTM3MzVhMTY0LjA3MTM0OCAxNjQuMDcxMzQ4IDAgMCAxIDMuNDg2NDc2LTMzLjY5OTg5NCA2Ni4zMjIxNSA2Ni4zMjIxNSAwIDAgMSAzLjc0OTc5MS0xNC41MjU2M2MxOS40NTMyOTEtNjMuMDgxNjUxIDc2LjA2ODU3MS0xMDkuODc2ODI1IDE0NC4zMDU5ODEtMTE0Ljg4MDg4QzIzMy4wNDU2MDQgNTIxLjEzNjM1NiAxODQuMjI3MzUyIDQ2Mi45NjM5NDUgMTg0LjIyNzM1MiAzOTMuMzQ2MDMyYzAtODAuMjU0NTEgNjQuODcxNzU0LTE0NS4zMTQyNjkgMTQ0Ljg5NDM3NS0xNDUuMzE0MjY5IDU4Ljg4NTk2IDAgMTA5LjU2NDIwNyAzNS4yMzIxMDIgMTMyLjIyODc0MSA4NS44MjA5NTJxNC43Mjc3MzgtMS4xOTQ2NjcgOS41NDM3ODgtMi4xNjEyMzZDMzkxLjUxMTUwMSAzNDkuOTcyODU5IDMxMS41MzQzOTIgNDMzLjE1MDkxNiAzMTEuNTM0MzkyIDUyMi4yOTQxOGExMzkuNDE4NDEzIDEzOS40MTg0MTMgMCAwIDAgNS4zMzc4MDMgMzguOTA2NTgyYy01Ny45Njk3NzggNS4zOTA4OTktMTA2LjA2MzY0NCAzNC4yMjU0MzktMTIyLjg0MTUzMyA4Ni4yNzA2NDVhNTUuNTM0MzkyIDU1LjUzNDM5MiAwIDAgMC0zLjQwNTIwNiAxMi42MTMwOGMtMi4wNzA3NTYgOS40NDg5NzQtNi4wODc2NTMgMjcuNTE3OTY4LTQuMjk4NjMzIDQ1LjE1MzUyNCA1LjQ5ODE3NiA1NC4xOTYxNDggMjYuNDQzMDM5IDgyLjUzNzY1MSA3MC44MDc3MDQgMTA3LjEyNDQ4NiAxNy4zNTU5ODcgMTAuODY4NDg3IDM2LjI2ODU2MyAxNy45NzY4ODkgNTQuOTAyNjU0IDE5LjA3Njc0MWg0ODIuMjg4ODNjNDcuMzQyMzkyIDAgODcuNDU3MTg1LTI0LjcxMTQ1IDExNC42ODI1ODItNTYuMDIyMDEgMjcuNTI4ODA0LTI5LjUzODg3OCAzOS43MzAxMTYtNjguNDYxNzE0IDM5LjczMDExNi0xMTEuMTI4MzgxIDAtOTIuMzE3MTIyLTY5LjQ1ODYyNC0xNjAuNTcwMjQzLTE2Mi41NjY3NzItMTYxLjA5Njg3Mi00MC45ODcwOS0wLjIzMTg5LTcwLjk2NDgyNSAxNy41OTIyMTItOTQuMDIzNzg5IDI4LjI5NzA3NS0xMC4xMDk5NjgtNjEuMjc3NDYtNDYuOTE5Nzg4LTEyNS42NjQ4NDctMTA4LjEyNjgxNS0xNTUuNTM0MjIyLTI1Ljk3OTI1OS0zMC44NDc4NjUtNjEuMTI3MzgyLTUwLjQyMzYwMi0xMDAuMjgyNjQ5LTQ2LjQxMTA0YTIwMS44MDQzOTQgMjAxLjgwNDM5NCAwIDAgMSAyNi44Njc4MDktMS43OTYwNjNjOTkuODg3MTM3IDAgMTc3Ljc4MTU3IDYxLjIwMDUyNSAxOTkuNjY0ODMgMTU4LjQ2NTg5NiAyNS4zOTQxMTYtMTIuMzIzNzU5IDUyLjAwNzI4LTE3LjU0NDUzMyA4Mi4xMzEzMDEtMTcuNTQ0NTMzIDEwNi4zNjU5NjggMCAxOTIuNTg3ODUyIDk0LjYzOTI3MiAxOTIuNTg3ODUyIDIwMC45MTMxMzRhMTkxLjU5OTYxMSAxOTEuNTk5NjExIDAgMCAxLTQ4Ljc0MDIzMyAxMjcuOTI5NTY2eiBtLTUwMC4wMjYyNDMtNDU1LjQ5MzYyMUM0MTcuMDMwMjMxIDMwMi4xNDc3MjUgMzc2LjI5OTk1MyAyNzQuNjM3ODg0IDMyOS4xNTUzMTkgMjc0LjYzNzg4NGMtNjUuNjExODUyIDAtMTE4Ljc5ODYyOSA1My4yODI2NzUtMTE4Ljc5ODYyOSAxMTkuMDExMDEzIDAgNTkuNTY0MjkyIDQzLjY4MTQ1NiAxMDguOTA4MDg5IDEwMC43MDIwMDIgMTE3LjYzOTE3OUMzMTcuMzYzNjA2IDQzNC4yNTE4NTIgMzY3LjM0NTEwMSAzNjkuNTcyOTc4IDQzNi4yMjI5MTYgMzQyLjAxODE2N3oiIGZpbGw9IiM3RDdEN0QiIC8+PHBhdGggZD0iTTMzMC41MTU3NzYgMTMyLjc0MDc0MWExMC42MDY3OTggMTAuNjA2Nzk4IDAgMCAxIDEwLjYwNjc5OCAxMC42MDY3OTh2NzcuODExNTM4YTEwLjYwNjc5OCAxMC42MDY3OTggMCAxIDEtMjEuMjEzNTk2IDBWMTQzLjM0NzUzOUExMC42MDY3OTggMTAuNjA2Nzk4IDAgMCAxIDMzMC41MTU3NzYgMTMyLjc0MDc0MXpNMjA5LjAxNDExMiAyNzAuNTc0MzkyYTEwLjYwOTUwNyAxMC42MDk1MDcgMCAwIDEtMTUuMDAwNzg3IDE1LjAwNzgzTDEzOS4wMjU2MDggMjMwLjU2NjMzMmExMC42MDk1MDcgMTAuNjA5NTA3IDAgMCAxIDE1LjAwMDI0Ni0xNS4wMDc4M201NC45Nzg1MDYgMjk0LjcyNzc4OGwwLjAwNTk2IDAuMDA1OTZhMTEuODI1MzA0IDExLjgyNTMwNCAwIDAgMSAwIDE2LjcxNzIwNmwtNTMuMjc3Nzk5IDUzLjMwNTk3M2ExMS44MTEyMTcgMTEuODExMjE3IDAgMCAxLTE2LjcwODUzOCAwbC0wLjAwNTk2LTAuMDA1NDE4YTExLjgyODU1NCAxMS44Mjg1NTQgMCAwIDEgMC0xNi43MTk5MTZsNTMuMjc3Nzk5LTUzLjMwMzgwNWExMS44MTEyMTcgMTEuODExMjE3IDAgMCAxIDE2LjcxMDE2MyAweiBtMjQzLjYxOTM1Mi0yMzkuNjY5NjM4YTEwLjYxMTEzMiAxMC42MTExMzIgMCAwIDAgMTUuMDAyOTU1IDE1LjAxMjE2NWw1NC45ODM5MjMtNTUuMDI4ODkzYTEwLjYxMTEzMiAxMC42MTExMzIgMCAxIDAtMTQuOTk5MTYxLTE1LjAxMjE2NU03Ni43MTE2ODcgMzgyLjU4MjExMmg3Ny44NzQ5MjlhMTAuNjEyMjE2IDEwLjYxMjIxNiAwIDAgMSAwIDIxLjIyNDQzMkg3Ni43MTE2ODdhMTAuNjEyMjE2IDEwLjYxMjIxNiAwIDAgMSAwLTIxLjIyNDQzMnoiIGZpbGw9IiNGN0NBMTkiIC8+PC9zdmc+'
    },
    {
        title: '5小时路线生成',
        value: 'plan',
        icon: 'data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyBjbGFzcz0iaWNvbiIgd2lkdGg9IjIwMHB4IiBoZWlnaHQ9IjE5OS40MnB4IiB2aWV3Qm94PSIwIDAgMTAyNyAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iIzUxNTE1MSIgZD0iTTM3MS4yIDU0LjRDMTcyLjggNTQuNCA2LjQgMjI3LjIgNi40IDQ0MS42YzAgMTA4LjggNDEuNiAyMDQuOCAxMDguOCAyNzUuMmwyMzYuOCAyNDkuNmMxMi44IDEyLjggMzUuMiAxMi44IDQ4IDBsMjM2LjgtMjQ5LjZjNjcuMi03MC40IDEwOC44LTE2OS42IDEwOC44LTI3NS4yLTYuNC0yMTQuNC0xNzIuOC0zODcuMi0zNzQuNC0zODcuMnogbTAgNTA4LjhjLTgwIDAtMTQ0LTY0LTE0NC0xNDRzNjQtMTQ0IDE0NC0xNDQgMTQ0IDY0IDE0NCAxNDQtNjQgMTQ0LTE0NCAxNDR6TTcwNy4yIDk3OS4yaC0yNTZsNjQtNjRoMTI4bDY0IDY0eiIgIC8+PHBhdGggZmlsbD0iIzUxNTE1MSIgZD0iTTEwMjcuMiA2NDYuNGMwIDY3LjItMjUuNiAxMjgtNzAuNCAxNzIuOGwtMTUzLjYgMTUzLjZjLTkuNiA5LjYtMjIuNCA5LjYtMzIgMGwtMTUzLjYtMTU2LjhjLTMuMi0zLjItMy4yLTMuMi0zLjItNi40bDY0LTY3LjJjMTYtMTYgMjguOC0zMiA0MS42LTQ4IDE2IDE5LjIgNDEuNiAzMiA3MC40IDMyIDUxLjIgMCA5Mi44LTQxLjYgOTIuOC04OS42IDAtNDgtNDEuNi04OS42LTkyLjgtODkuNiA5LjYtMzguNCAxNi03Ni44IDE2LTExNS4ydi0yOC44YzEyMS42IDkuNiAyMjAuOCAxMTIgMjIwLjggMjQzLjJ6IiAgLz48L3N2Zz4='
    },
]

const buttonManager = [
    {
        title: '快速定位',
        list: location,
        key: 'location'
    },
    {
        title: '智能查询',
        list: aiFuntions,
        key: 'aiFuntions'
    },

]
const goGoogleMap = (place) => {
    window.location.href = `https://www.google.com/maps/search/?api=1&query=${place.location.latitude},${place.location.longitude}`
}
const map = ref(null)
const placeInfo = ref([])
const isSearch = ref(true)
const mapLoading = ref(false);
const showPlan = ref(false);

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

const buttonEmit = async (button, parent) => {
    if (parent == 'location') {
        beginSearch(true)
        if (!store.state.location) {
            await getLocation();
        }
        const location = store.state.location
        const res = await getPlace({
            type: button,
            lat: location.latitude,
            lng: location.longitude
        });
        beginSearch(false)
        if (res.msg && res.msg == 'success') {
            updateMap(res.data)
        }

    } else if (parent == 'aiFuntions') {
        beginSearch(true)
        if (!store.state.location) {
            await getLocation();
        }

        let res = null;
        const location = store.state.location
        if (button == 'weather') {
            res = await getWeather({
                lat: location.latitude,
                lng: location.longitude
            });
            beginSearch(false)

            if (res.msg && res.msg == 'success') {
                updateWeather(res.data)
            }

        } else if (button == 'plan') {
            res = await getPlan({
                size: '600x300',
                lat: location.latitude,
                lng: location.longitude
            });
            beginSearch(false)
            if (res.msg && res.msg == 'success') {
                updatePlan(res.data)
            }
        } else if (button == 'chat') {
            res = await getChat({
                size: '300x600',
                lat: location.latitude,
                lng: location.longitude
            });
            beginSearch(false)
            console.log(res)
            if (res.msg && res.msg == 'success') {
                updatePlan(res.data)
            }
        } 
    }


}

const beginSearch = (value) => {
    mapLoading.value = value
    isSearch.value = true
    showResult.value = false
    showPlan.value = false

}
const showResult = ref(false)
const updateMap = (value) => {
    isSearch.value = false
    showResult.value = true
    placeInfo.value = value.places
}


const isDialogVisible = ref(false)
const weather = ref('')
const updateWeather = (data) => {
    weather.value = data
    isDialogVisible.value = true
}
const closeDialog = () => {
    isDialogVisible.value = false
}
const celsiusTemp = computed(() => Math.floor(weather.value.temp - 273.15));
const updatePlan = async (data) => {
    isSearch.value = false
    showPlan.value = true
    await nextTick();
    map.value.innerHTML = ''
    const img = document.createElement('img')
    img.src = 'data:image/png;base64,' + data.image
    img.style.height = '100%'
    img.style.width = '100%'
    map.value.appendChild(img)


}
</script>

<style scoped>
.button-container {
    display: flex;
    height: 80px;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
}

.map-loading-container {
    position: relative;
    height: 100%;
    width: 100%;
}

.map-loading-container img {
    height: 100%;
    width: 100%;
}

.map-loading-container .loading-icon {
    height: 20vw;
    width: 20vw;
    position: absolute;
    /* transform: translate(-50%, -50%); */
    /* top: 50%;
    left: 50%; */
    top: calc(10vw + 16px);
    left: calc(40vw - 6px)
}

.rotating-element {
    animation: rotate 4s linear infinite;
}

.weather-container {
    position: fixed;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    width: 80vw;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
        /* 起始角度 */
    }

    to {
        transform: rotate(360deg);
        /* 结束角度，完成一圈 */
    }
}
</style>


<!-- // map.value.innerHTML = ''
    // const img = document.createElement('img')
    // img.src = 'data:image/png;base64,' + value
    // img.style.height = '100%'
    // img.style.width = '100%'

    // map.value.appendChild(img)
    // console.log(value)
    // const loader = new Loader({
    //     apiKey: "AIzaSyDHj4PiaqPmcSUBsqjLoQ4zcnavqacD0NA",
    //     version: "weekly",
    //     libraries: ["places"]
    // });

    // const mapOptions = {
    //     center: {
    //         lat: store.state.location.latitude,
    //         lng: store.state.location.longitude
    //     },
    //     zoom: 4
    // };

    // loader
    // .importLibrary('maps')
    // .then(({Map}) => {
    //     const googleMap = new Map(map.value, mapOptions);
    //     const locations = [];
    //     value.forEach(place => {
    //         locations.push({
    //             lat:place.location.latitude,
    //             lng:place.location.longitude,
    //             title:place.displayName.text
    //         })
    //     });

    //     for (let i = 0; i < locations.length; i++) {
    //         const marker = new google.maps.Marker({
    //             position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
    //             map: googleMap,
    //             title: locations[i].title
    //         });
    //     }
    // })
    // .catch((e) => {
    //     // do something
    // }); -->