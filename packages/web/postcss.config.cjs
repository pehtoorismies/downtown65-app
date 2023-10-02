module.exports = {
  plugins: {
    "postcss-preset-mantine": {},
    "postcss-simple-vars": {
      variables: {
        "mantine-breakpoint-xs": "36em",// 540
        "mantine-breakpoint-sm": "48em",// 720
        "mantine-breakpoint-md": "62em",// 960
        "mantine-breakpoint-lg": "75em",// 1140
        "mantine-breakpoint-xl": "88em"// 1320
      }
    }
  }
};