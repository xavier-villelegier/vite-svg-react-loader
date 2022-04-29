declare module '*.svg' {
  import type {FunctionComponent, SVGProps} from 'react'
  const src: FunctionComponent<SVGProps<SVGSVGElement> & {title?: string}>
  export default src
}
