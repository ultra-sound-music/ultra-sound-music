const getDefaultConfig = require('@nrwl/react/plugins/webpack');

module.exports = (config) => {
  config = getDefaultConfig(config);

  config.module.rules = config.module.rules.filter((rule) => {
    // Find any default CSS & SCSS rules and remove them so 
    // we can use our own in order to support css modules
    return !(rule.test.test('.css') || rule.test.test('.scss') || rule.test.test('.png'));
  });
    
  config.module.rules.push(
    {
      test: /\.s[ac]ss$/i,
      use: [
        // Creates `style` nodes from JS strings
        'style-loader',
        // Translates CSS into CommonJS
        {
          loader: 'css-loader',
          options: {
            esModule: true,
            modules: {
              mode: (resourcePath) => {
                if (resourcePath.includes('global')) {
                  return 'global';
                }

                return 'local';
              },
              localIdentName: '[name]--[local]--[hash]',
              localIdentHashDigestLength: 5,
              exportLocalsConvention: 'asIs'
            }
          }
        },
        // Compiles Sass to CSS
        'sass-loader'
      ]
    },
    {
      test: /\.(jpg|jpeg|png|gif|mp3)$/,
      type: 'asset/resource'
    },
  );

  return config;
}