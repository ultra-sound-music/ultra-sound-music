import { TextareaHTMLAttributes, RefObject } from 'react';

export type ITextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  innerRef?: RefObject<HTMLTextAreaElement>;
};

export function TextArea({ innerRef, ...props }: ITextAreaProps) {
  return <textarea {...props} ref={innerRef} />;
}

export default TextArea;
