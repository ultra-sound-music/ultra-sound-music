export type ILoadScriptOptions = Pick<Partial<HTMLScriptElement>, 'type' | 'onload' | 'onerror' | 'src' | 'crossOrigin' | 'integrity'>

export default function loadScript(src: string, options?: ILoadScriptOptions) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.onload = resolve
    script.onerror = reject
    script.src = src
    Object.assign(script, options || {});
    document.head.append(script)
  });
}
