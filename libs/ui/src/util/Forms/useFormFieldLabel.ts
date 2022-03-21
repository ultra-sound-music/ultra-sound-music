export interface IUseFormFieldLabelProps {
  value?: React.InputHTMLAttributes<HTMLInputElement>['value'];
  label?: string;
}

export default function useFormFieldLabel({ value, label }: IUseFormFieldLabelProps) {
  if (value) {
    return {
      label
    };
  } else {
    return {
      placeholder: label
    };
  }
}
