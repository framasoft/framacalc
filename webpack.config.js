/* eslint-disable import/newline-after-import */
/* eslint-disable filenames/match-regex */
/* eslint-disable import/no-commonjs */
const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const Renderer = require('@prerenderer/renderer-jsdom');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');

const mode = {
  dev: process.env.NODE_ENV === 'development',
  preview: process.env.NODE_ENV === 'preview',
  prod: process.env.NODE_ENV === 'prod',
};

let root = mode.preview ? `/${process.env.INIT_CWD.match(/([^/]*)\/*$/)[1]}/` : '/';
for (let i = 0; i < process.argv.length; i += 1) {
  if (process.argv[i].indexOf('--root=') > -1) {
    root = `/${process.argv[i].split('=')[1]}/`;
  }
}

const assets = [];
fs.readdirSync('./app/assets').forEach((file) => {
  if (!/scss/.test(file)) {
    assets.push({ from: path.resolve(__dirname, `./app/assets/${file}`), to: file });
  }
});

const config = {
  entry: './app/index.js',
  output: {
    path: path.resolve(__dirname, `public${root}`),
    publicPath: root,
    filename: !mode.dev ? '[name].[hash].bundle.js' : '[name].bundle.js',
    // chunkFilename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'img/[name].[ext]',
        },
      },
      {
        test: /\.(ttf|eot|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]',
        },
      },
      {
        test: /\.ya?ml$/,
        loader: 'yaml-import-loader',
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-hot-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          'css-hot-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: !mode.prod ? '[name].css' : '[name].[hash].css',
      chunkFilename: !mode.prod ? '[id].css' : '[id].[hash].css',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin(assets),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, './public'),
    publicPath: '/',
    historyApiFallback: true,
    inline: true,
    open: true,
    hot: true,
    writeToDisk: true,
    compress: true,
  },
  devtool: 'eval-source-map',
};

module.exports = config;

// Import locales list
const locales = [];
fs.readdirSync('./app/locales')
  .forEach((file) => {
    if (fs.existsSync(`./app/locales/${file}/_main.yml`)
      || fs.existsSync(`./app/locales/${file}/main.yml`)) {
      locales.push(file);
    }
  });

const routes = [];
const pages = [];
// Import pages list
fs.readdirSync('./app/components/pages')
  .forEach(file => pages.push(file.replace(/(.*)\.vue/, '$1')));

for (let j = 0; j < pages.length; j += 1) {
  routes.push(`${root}${pages[j].toLowerCase().replace('home', '')}`);
  // Localized routes
  for (let i = 0; i < locales.length; i += 1) {
    routes.push(`${root}${locales[i]}${pages[j].toLowerCase().replace(/^/, '/').replace('/home', '')}`);
  }
}

// Get last app modified time
const date = JSON.stringify(fs.statSync('./app').mtime);

if (mode.dev) {
  module.exports.plugins = (module.exports.plugins || [])
    .concat([
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"development"',
          BASE_URL: '""',
          DATE: date,
        },
      }),
      new HtmlWebpackPlugin({
        title: 'DEVELOPMENT prerender-spa-plugin',
        template: 'index.html',
        filename: 'index.html',
      }),
    ]);
} else { // NODE_ENV === 'production|preview'
  module.exports.devtool = '#source-map';
  module.exports.optimization = {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
    splitChunks: {
      chunks: 'all',
    },
  };
  module.exports.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `"${process.env.NODE_ENV}"`,
        BASE_URL: `"${root.split('/')[1]}"`,
        DATE: date,
      },
    }),
    new HtmlWebpackPlugin({
      title: 'PRODUCTION prerender-spa-plugin',
      template: 'index.html',
      filename: path.resolve(__dirname, 'public/index.html'),
    }),
    new PreloadWebpackPlugin({
      rel: 'preload',
      as(entry) {
        if (/\.css$/.test(entry)) return 'style';
        if (/\.woff$/.test(entry)) return 'font';
        if (/\.png$/.test(entry)) return 'image';
        if (/\.jpg$/.test(entry)) return 'image';
        return 'script';
      },
      fileBlacklist: [/\.map/, /\.svg/, /\.woff/, /\.eot/, /\.woff2/, /\.ttf/, /\.png/, /\.gif/, /\.mp4/],
      include: 'allAssets',
    }),
    new PrerenderSPAPlugin({
      staticDir: path.join(__dirname, 'public'),
      routes,
      renderer: new Renderer({
        headless: true,
        renderAfterDocumentEvent: 'render-event',
        maxConcurrentRoutes: 1,
        injectProperty: 'vuefsPrerender',
        inject: {
          prerender: true,
        },
        postProcess(renderedRoute) {
          // eslint-disable-next-line no-param-reassign
          renderedRoute.html = renderedRoute.html
            .replace(/<script (.*?)>/g, '<script $1 defer>')
            .replace('id="app"', 'id="app" data-server-rendered="true"');

          return renderedRoute;
        },
      }),
    }),
  );
}

// Create ./public/img/lg/* symlinks only if images need translation
const img = {
  assets: './app/assets/img/',
  relative: mode.dev ? '../../../app/assets/img/' : '../', // [dev] relative to assets ; [prod] relative to public
  public: `./public${root}img/`,
};

if (fs.existsSync(`${img.assets}fr`)) {
  if (!fs.existsSync(img.public)) {
    fs.mkdirSync(img.public, { recursive: true });
  }

  for (let i = 0; i < locales.length; i += 1) {
    if (!fs.existsSync(`${img.public}${locales[i]}`)) {
      fs.mkdirSync(`${img.public}${locales[i]}`);
    }

    fs.readdirSync(`${img.assets}fr`).forEach((file) => {
      if (!fs.existsSync(`${img.assets}${locales[i]}/${file}`)) {
        fs.symlink(`${img.relative}fr/${file}`,
          `${img.public}${locales[i]}/${file}`,
          (err) => { console.log(err) }); // eslint-disable-line
      }
    });
  }
}

// Create ./public/img/opengraph/*.jpg symlinks for each page
if (fs.existsSync(`${img.assets}opengraph/home.jpg`)) {
  if (!fs.existsSync(`${img.public}opengraph`)) {
    fs.mkdirSync(`${img.public}opengraph`, { recursive: true });
  }

  for (let i = 0; i < pages.length; i += 1) {
    if (!fs.existsSync(`${img.assets}opengraph/${pages[i].toLowerCase()}.jpg`)) {
      fs.symlink(`${img.relative}opengraph/home.jpg`,
        `${img.public}opengraph/${pages[i].toLowerCase()}.jpg`,
        (err) => { console.log(err) }); // eslint-disable-line
    }
  }
}
