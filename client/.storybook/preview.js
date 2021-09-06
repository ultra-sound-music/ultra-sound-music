import '../src/styles/core.scss';
import '../src/styles/colors.scss';
import '../src/styles/fonts.scss';
import '../src/styles/mixins.scss';
import '../src/styles/responsive.scss';
import '../src/styles/typo.scss';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
};
