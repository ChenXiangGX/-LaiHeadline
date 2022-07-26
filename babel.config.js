module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    [
      "import",
      {
        libraryName: "vant",
        libraryDirectory: "es",
        // style: true,
        //less
        style: (name) => `${name}/style/less`,
      },
      "vant",
    ],
  ],
};
