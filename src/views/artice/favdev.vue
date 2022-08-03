<template>
  <div>
    <commonListVue :API="get_history_list" :params="{ uid: $store.state.uid }">
      <template #default="{ list }">
        <li v-for="(item, index) in list" :key="index">
          {{ item }}
        </li>
      </template>
    </commonListVue>
  </div>
</template>

<script>
import commonListVue from '@/components/commList.vue';
import { get_history_list } from '@/api/home';
export default {
  components: {
    commonListVue,
  },
  data() {
    return {
      get_history_list,
    };
  },
};
</script>

<style></style>
