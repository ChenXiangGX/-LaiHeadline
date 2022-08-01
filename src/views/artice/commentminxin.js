import { get_comment_list } from '@/api/home';
import { List } from 'vant';
export default {
  data() {
    return {
      skip: '',
      limit: '10',
      commentList: [],
      commentFinished: false,
      commentLoading: false,
    };
  },
  components: {
    [List.name]: List,
  },
  methods: {
    get_comment_list() {
      let { uid, article_id, skip, limit } = this;
      get_comment_list({
        user_id: uid,
        skip,
        limit,
        article_id,
      })
        .then((res) => {
          if (res.code == 0) {
            this.commentList.push(...res.data);
            let len = this.commentList.length;
            if (len >= res.count) {
              this.commentFinished = true;
            } else {
              this.skip = len;
              this.commentLoading = false;
            }
          }
        })
        .catch((err) => {});
    },
  },
};
