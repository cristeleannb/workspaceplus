module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.android.js',
          '.android.tsx',
          '.ios.js',
          '.ios.tsx',
        ],
        alias: {
          '@/assets': './src/assets',
          '@/components': './src/components',
          '@/hooks': './src/hooks',
          '@/modals': './src/modals',
          '@/navigations': './src/navigations',
          '@/screens': './src/screens',
          '@/services': './src/services',
          '@/stores': './src/stores',
          '@/toast': './src/toast',
          '@/types': './src/types',
          '@/utils': './src/utils',
          '@/views': './src/views',
        },
      },
    ],
    [
      'react-native-reanimated/plugin',
      {
        globals: ['__scanCodes'],
      },
    ],
    [
      'module:react-native-dotenv',
      {
        moduleName: 'react-native-dotenv',
      },
    ],
  ],
};
