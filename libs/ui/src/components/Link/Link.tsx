import { Link as ReactLink, LinkProps } from 'react-router-dom';

export type ILinkProps = LinkProps;

export function Link({ to, children, ...props }: ILinkProps) {
  const isExternalUrl = typeof to === 'string' && to.startsWith('http');
  return isExternalUrl
    ? <a href={to} target='_blank' rel='noreferrer' {...props}>{children}</a>
    : <ReactLink to={to} {...props}>{children}</ReactLink>;
}

export default Link;
