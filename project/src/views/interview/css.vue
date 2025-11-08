<template>
  <div>
    <div v-for="data in datas " :key="data.problem" class="card-box p-5 m-5">
      <div class="problem">
        {{ data.problem }}
      </div>
      <div class="answer">
        <div v-if="typeof data.answer==='string'">
          {{ data.answer }}
        </div>
        <div v-else>
          <div v-for="answer in data.answer " :key="data.answer">
            {{answer}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import cssData from "../public/css.json"


interface data {
  problem: string,
  answer: string | string[]
}

import {ref} from 'vue';

const datas = ref<data[]>(cssData);
for(let i = 1 ; i < 6; i++){

  setTimeout(() => {

    console.log(i)

  }, 1000)

}

</script>

<style>
.problem {
  font-size: 30px;
  font-weight: 6600;
}

.answer {
  font-size: 15px;
  font-weight: 700;
}

</style>