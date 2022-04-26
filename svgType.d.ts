declare module '*.svg' {
  import type {ReactElement} from 'react'
  /**
   * Use `any` to avoid conflicts with
   * `@svgr/webpack` plugin or
   * `babel-plugin-inline-react-svg` plugin.
   */
  const content: ReactElement<any>

  export default content
}
