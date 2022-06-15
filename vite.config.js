import { viteStaticCopy } from 'vite-plugin-static-copy'
import { viteTakeScreenshot } from './plugins/vite-take-screenshot'

export default {


    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: 'assets/images',
                    dest: 'assets'
                }
            ]
        }),
        viteTakeScreenshot()
    ],

    base: "./"

}