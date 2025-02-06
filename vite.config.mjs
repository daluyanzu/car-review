// Plugins
import Components from 'unplugin-vue-components/vite'
import Vue from '@vitejs/plugin-vue'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import ViteFonts from 'unplugin-fonts/vite'
import VueRouter from 'unplugin-vue-router/vite'
import requireTransform from 'vite-plugin-require-transform';
import commonjs from '@rollup/plugin-commonjs';
// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    commonjs(),
    VueRouter(),

    Vue({
      template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
    Components(),
    ViteFonts({
      google: {
        families: [{
          name: 'Roboto',
          styles: 'wght@100;300;400;500;700;900',
        }],
      },
    }),
    
    requireTransform({
      fileRegex: /.js$|.vue$|.png$|.ts$|.jpg$/
    }),
   
  ],
  define: { 'process.env': {} },
  build: {
    rollupOptions: {
      plugins: [
        commonjs({
          include: /node_modules/,
          requireReturnsDefault: 'auto', // 处理默认导出问题
        }),
      ],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
        '/api': {
          target: 'https://139.180.170.150:443',
          changeOrigin: true,
          secure: false, // 如果使用的是自签名证书，可以设置为 false
     
        }
      }
  },
  css: {
    preprocessorOptions: {
      sass: {
        api: 'modern-compiler',
      },
    },
  },
})
