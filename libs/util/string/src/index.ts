const nargs = /\{([0-9a-zA-Z_]+)\}/g;

export type IParamsObject = Record<string | number, unknown>;
export type IParam = string | number;
export type IRest = [(IParamsObject | IParam), ...Array<IParam>]

export function interpolate(string: string, ...rest: IRest): string {
  const params = rest.length === 1 && typeof rest[0] === 'object'
    ? rest[0]
    : rest || {};

    return string.replace(nargs, (match, i, index) => {
        let result

        if (string[index - 1] === '{' && string[index + match.length] === "}") {
            return i;
        } else {
            result = Object.prototype.hasOwnProperty.call(params, i)
              ? params[i]
              : null
            if (result === null || result === undefined) {
                return ""
            }
            return result
        }
    })
}