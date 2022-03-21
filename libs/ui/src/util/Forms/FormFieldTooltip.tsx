import styles from './FormFieldTooltip.scss';

export interface IUseFormFieldTooltipProps {
  assistiveText?: string[];
  errors?: string[];
}

export function getFormFieldTooltip({
  assistiveText = [],
  errors = []
}: IUseFormFieldTooltipProps) {
  if (!(assistiveText.length || errors.length)) {
    return;
  }

  const formattedAssistiveText = assistiveText?.map(
    (text) =>
      `<div class="${styles.success}">
      ${text}
    </div>`
  );

  const formattedErrors = errors?.map(
    (error) =>
      `<div class="${styles.error}">
      ${error}
    </div>`
  );

  return [...formattedAssistiveText, ...formattedErrors];
}
