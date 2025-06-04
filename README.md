## Runnable copy of wasm-game-of-life

```diff
// package.json:
  "devDependencies": {
+   "copy-webpack-plugin": "^12.0.2",
+   "gh-pages": "^6.3.0",
+   "webpack": "^5.95.0",
+   "webpack-cli": "^5.1.4",
+   "webpack-dev-server": "^5.1.0"

-   "copy-webpack-plugin": "^5.0.0",
-   "webpack": "^4.16.3",
-   "webpack-cli": "^3.1.0",
-   "webpack-dev-server": "^3.1.5"
  }

// webpack.config.js

- plugins: [
-     new CopyWebpackPlugin(['index.html'])
- ]

+ plugins: [
+   new CopyWebpackPlugin({patterns: ['index.html']})
+ ],
+ experiments: {
+   asyncWebAssembly: true,
+ },

// index.js

+ import { memory } from 'game-of-life/game_of_life_bg.wasm'
- import { memory } from 'game-of-life/game_of_life_bg'
```