declare module '*.svg' {
  import type {ElementType} from 'react'
  /**
   * Use `any` to avoid conflicts with
   * `@svgr/webpack` plugin or
   * `babel-plugin-inline-react-svg` plugin.
   */
  const content: ElementType<any>

  export default content
}
