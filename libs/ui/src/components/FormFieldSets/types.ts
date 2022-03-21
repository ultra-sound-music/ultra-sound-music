import { RefObject, AllHTMLAttributes } from 'react';

export type IFormElements = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export type IBaseFormElementProps<
  P extends AllHTMLAttributes<HTMLElement> = AllHTMLAttributes<HTMLElement>
> = IBaseFormFieldProps & {
  error?: string;
  errors?: string[];
  isInitialized?: boolean;
  setValue?(v: P['value']): void;
  showIcon?: (v?: P['value'], e?: string[]) => boolean;
  toggleVisibility?(): void;
  toggleExpand?(): void;
  'data-for'?: string;
  'data-tip'?: string;
};

export type IBaseFormFieldProps<
  P extends AllHTMLAttributes<HTMLElement> = AllHTMLAttributes<HTMLElement>
> = P &
  AllHTMLAttributes<HTMLElement> & {
    name: string;
    label?: string;
    title?: string;
    selected?: boolean;
    isLoading?: boolean;
    isControlled?: boolean;
    innerRef?: RefObject<
      HTMLDivElement | HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >;
  };
