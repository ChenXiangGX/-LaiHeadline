// let windowHeight = document.documentElement.scrollHeight;

export default {
  data() {
    return {
      baseColor: '#07c160',
      // windowHeight: windowHeight + 'px',
    };
  },
  filters: {
    limit(src) {
      if (Array.isArray(src)) {
        return src.map((v) => {
          return v + '?imageslim';
        });
      } else if (typeof src == 'string') {
        return src + '?imageslim';
      }

      return '';
    },
  },
  methods: {
    checkLogin(url = '/login', msg = '请先登录', t = 500) {
      if (!this.$store.state.uid) {
        this.$toast(msg);
        setTimeout((v) => {
          this.$router.push(url);
        }, t);
        return false;
      }
      return true;
    },
  },
};
