import ContentLoader, { IContentLoaderProps } from 'react-content-loader';

export interface IPlaceholderProps extends IContentLoaderProps {
  preset?: 'rectangle';
}

export function Placeholder({ preset, ...props }: IPlaceholderProps) {
  let propDefaults;
  let child;
  if (preset === 'rectangle') {
    propDefaults = {
      speed: 2,
      backgroundColor: '#6b6989',
      foregroundColor: '#a286ff',
      width: '100%',
      height: '100%'
    };
    child = <rect rx='4' ry='4' width='100%' height='100%' />;
  }

  return (
    <ContentLoader preserveAspectRatio='none' {...propDefaults} {...props}>
      {child}
    </ContentLoader>
  );
}

export default Placeholder;
