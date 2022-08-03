<template>
  <div class="history">
    <van-nav-bar title="历史记录" left-arrow @click-left="$router.back()" />

    <div class="box" style="padding-bottom: 50px">
      <ul>
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onload">
          <!-- immediate-check是因为默认为true直接执行一次 -->
          <li
            class="box"
            v-for="(item, index) in lists"
            :key="index"
            @click="
              $router.push({
                path: '/artice',
                query: {
                  article_id: item._id,
                  title: item.title,
                },
              })
            "
          >
            <div class="info">
              <div
                v-if="item.imageSrc.length == 1"
                class="imgs"
                :class="{
                  one: item.imageSrc.length == 1,
                  two: item.imageSrc.length == 2,
                  three: item.imageSrc.length == 3,
                }"
              >
                <h3>
                  {{ item.title }}
                </h3>
                <div class="lr">
                  <img v-for="(v, i) in item.imageSrc" :src="v" alt="" :key="i" />
                </div>
              </div>
              <div
                v-else-if="item.imageSrc.length == 2"
                class="imgs"
                :class="{
                  one: item.imageSrc.length == 1,
                  two: item.imageSrc.length == 2,
                  three: item.imageSrc.length == 3,
                }"
              >
                <h3>
                  {{ item.title }}
                </h3>
                <div class="lr">
                  <img v-for="(v, i) in item.imageSrc" :src="v" alt="" :key="i" />
                </div>
              </div>
              <div
                v-else-if="item.imageSrc.length == 3"
                class="imgs"
                :class="{
                  one: item.imageSrc.length == 1,
                  two: item.imageSrc.length == 2,
                  three: item.imageSrc.length == 3,
                }"
              >
                <h3>
                  {{ item.title }}
                </h3>
                <div class="lr">
                  <img v-for="(v, i) in item.imageSrc" :src="v" alt="" :key="i" />
                </div>
              </div>
              <div class="bb">
                <span> 发布人{{ item.author }} </span>
                <span> 时间 {{ item.time | formatDate }} </span>
              </div>
            </div>
          </li>
        </van-list>
      </ul>
    </div>
  </div>
</template>

<script>
import { get_history_list } from '@/api/home';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      lists: [],
      loading: false,
      finished: false,
      skip: '',
      limit: 10,
    };
  },
  computed: {
    ...mapState(['uid']),
  },
  mounted() {},
  methods: {
    onload() {
      let { uid, skip, limit } = this;
      get_history_list({
        skip,
        uid,
        limit,
      }).then((res) => {
        this.lists.push(...res.data);
        let len = this.lists.length;

        if (len >= res.count) {
          this.finished = true;
        } else {
          this.skip = len; //skip更新
          this.loading = false;
        }
      });
    },
  },
  filters: {
    formatDate: function (value) {
      // 时间戳转换日期格式方法
      if (value == null) {
        return '';
      } else {
        let date = new Date(value);
        let y = date.getFullYear(); // 年
        let MM = date.getMonth() + 1; // 月
        MM = MM < 10 ? '0' + MM : MM;
        let d = date.getDate(); // 日
        d = d < 10 ? '0' + d : d;
        return y + '-' + MM + '-' + d;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.history {
  ::v-deep .box:first-child {
    margin-top: 10px;
  }
  ::v-deep .van-nav-bar {
    background-color: #3288de;
  }
  ::v-deep .van-nav-bar .van-icon {
    color: black;
  }
  ::v-deep .van-nav-bar__text {
    color: black;
  }
  .box {
    width: 100%;
    ul {
      width: 100%;
      .info {
        .bb {
          padding: 5px 0;
          color: #ccc;
          display: flex;
          align-items: center;

          span:first-child {
            overflow: hidden;
            white-space: nowrap;
            /*文字超出宽度则显示ellipsis省略号*/
            text-overflow: ellipsis;
            width: 30%;
          }
          span:last-child {
            margin-left: 20px;
          }
        }
        margin-bottom: 6px;
        width: 100%;
        box-sizing: border-box;
        padding: 0 16px;
        div.one {
          display: flex;
          justify-content: space-between;
          align-items: center;
          h3 {
            padding: 0;
            margin: 0;
            flex: 1;
            padding-right: 8px;
            box-sizing: border-box;
            word-break: break-all;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2; /*行数*/
            -webkit-box-orient: vertical;
            height: inherit;
            margin: 0;
          }
          .lr {
            width: 113px;
            height: 88px;
            img {
              border-radius: 9px;
              object-position: center center;
              object-fit: revert;
              width: inherit;
              height: inherit;
            }
          }
        }
        div.two {
          display: flex;
          //   justify-content: space-between;
          align-items: center;
          h3 {
            padding: 0;
            margin: 0;
            flex: 0.5;
            padding-right: 8px;
            box-sizing: border-box;
            word-break: break-all;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3; /*行数*/
            -webkit-box-orient: vertical;
            height: 100%;
            margin: 0;
          }

          .lr {
            flex: 1;
            display: flex;
            justify-content: space-between;
            width: 113px;
            height: 88px;
            img {
              border-radius: 9px;
              padding: 0 5px;
              box-sizing: border-box;
              object-position: center center;
              object-fit: revert;
              width: inherit;
              height: inherit;
            }
          }
        }
        div.three {
          //   display: flex;
          //   justify-content: space-between;
          //   align-items: center;
          h3 {
            // padding: 0;
            margin: 0;
            // flex: 0.5;
            padding: 10px 0;
            box-sizing: border-box;

            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3; /*行数*/
            -webkit-box-orient: vertical;
            height: 18vw;
            margin: 0;
          }
          .lr {
            display: flex;
            justify-content: space-between;
            // width: 113px;
            height: 88px;
            img:first-child {
              padding-left: 0;
              padding-right: 0;
            }
            img {
              border-radius: 9px;
              padding: 0 5px;
              box-sizing: border-box;
              object-position: center center;
              object-fit: revert;
              width: 33%;
              height: inherit;
            }
          }
        }
      }
    }
  }
}
</style>
>
