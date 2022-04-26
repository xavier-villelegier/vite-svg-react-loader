import fs from 'fs'
import {transform} from 'esbuild'
import type {Plugin} from 'vite'

// Use require to prevent missing declaration file typescript errors
// This can be turned into a regular import when @svgr/core has proper
// typings (see https://github.com/gregberge/svgr/pull/555)
const svgr = require('@svgr/core').default

interface SvgrPluginOptions {
  // Emit SVG assets to the production bundle even if it has been
  // imported as a component.
  keepEmittedAssets?: boolean
  // Options passed directly to `@svgr/core`
  // (see https://react-svgr.com/docs/options)
  svgrOptions?: SVGROptions
}

interface SVGROptions {
  icon?: boolean
  dimensions?: boolean
  expandProps?: 'start' | 'end' | false
  svgo?: boolean
  ref?: boolean
  memo?: boolean
  replaceAttrValues?: Record<string, string>
  svgProps?: Record<string, string>
  titleProp?: boolean
}

export default function svgrPlugin(options: SvgrPluginOptions = {}): Plugin {
  const transformed: Array<string> = []

  return {
    name: 'vite:svgr',

    async transform(code: any, id: string) {
      const svgrOptions = options?.svgrOptions ?? {}
      const svgDataPath = id
      const svgData = await fs.promises.readFile(svgDataPath, 'utf8')
      const componentCode = await svgr(svgData, svgrOptions, {filePath: svgDataPath})
      const component = await transform(componentCode, {loader: 'jsx'})
      transformed.push(id)

      return {code: component.code, map: null}
    },

    generateBundle(config: any, bundle: {[key: string]: any}) {
      if (options.keepEmittedAssets) {
        return
      }
      // Discard transformed SVG assets from bundle so they are not emitted
      for (const [key, bundleEntry] of Object.entries(bundle)) {
        const {type, name} = bundleEntry
        if (
          type === 'asset' &&
          name?.endsWith('.svg') &&
          transformed.findIndex(id => id.includes(name)) >= 0
        ) {
          delete bundle[key]
        }
      }
    },
  }
}
