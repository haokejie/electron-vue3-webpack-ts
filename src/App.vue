<template>
  <div class="aaa">
    7696y
    <testcompo />
    <testtsx />
    <a-button
      type="dashed"
      danger
      @click="add"
    >
      增加怎??
    </a-button>
    <div>{{ count }}</div>
    <AButton
      type="primary"
      @click="add"
    >
      Primary Button
    </AButton>
    <img
      src="./asset/boy.jpg"
      alt=""
      srcset=""
    >
  </div>
</template>
<script lang="ts" setup>
import testcompo from './components/test/testcomp.vue'
import testtsx from './components/test/testtsx'
import { test9 } from './utils/index'
import { Button as AButton } from 'ant-design-vue'

test9({ name: '99' })
// 打印出process.env 中所有变量
console.log(process)
const count = ref(0)
const add = () => {
  test9({ name: '9aa9' })
  count.value++
}
const a = 1
console.log(a + 1)
const b = {
  a: 1,
  b: 2,
  c: 3
}

const aaa = (rgb: string) => {
  console.log(rgb)
}
console.log(aaa('rgb(1,2,3)'))
console.log({ ...b })
</script>

<style lang="less" scoped>
.aaa {
  color: rgb(96, 26, 26);
}
</style>

<style lang="css">
.han {
  color: red;
}
img {
  width: 100px;
  height: 100px;
}

#app {
  color: #2c3e50;
  width: 100vw;
  height: 100vh;
  overflow: auto;
}
body {
  border: 0;
  padding: 0;
  margin: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
