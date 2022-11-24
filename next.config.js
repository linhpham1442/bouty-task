/** @type {import('next').NextConfig} */
const path = require("path");
const webpack = require("webpack");
// const withLess = require("@zeit/next-less");
// const withCss = require("@zeit/next-css");
const withLess = require('next-with-less')
const withPlugins = require('next-compose-plugins')

const plugins = [[withLess, {}]]

const nextConfig = withPlugins(plugins, {
  reactStrictMode: false,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
});

module.exports = nextConfig;
