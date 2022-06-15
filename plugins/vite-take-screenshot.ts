import puppeteer from 'puppeteer'
import { createServer } from 'vite'

export interface ITakeScreenshotOptions {
    port?: number
    delay?: number
    fileName?: string
    position?: { x: number, y: number }
}

const log = msg => console.log(`[vite-take-screenshot]: ${msg}`);

export const viteTakeScreenshot = (options: ITakeScreenshotOptions = {}) => ({

    name: "vite-take-screenshot",

    async generateBundle () {

        log("\n server is running...");

        const PORT = options.port ?? 3000;
        const server = await createServer({
            configFile: false,
            root: process.cwd(),
            server: {
                port: PORT
            }
        })
        await server.listen()

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        log("page is opening...");

        await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
        await page.goto(`http://localhost:${PORT}`, { waitUntil: 'load' });
        await page.waitForTimeout(options.delay ?? ( 10 * 1000 ));
        await page.evaluate(options => {
            window.scrollBy(options.position?.x ?? 0, options.position?.y ?? 0);
        }, JSON.stringify(options));

        log("screenshot is taking...");

        await page.screenshot().then( source => {
            this.emitFile({ type: 'asset', fileName: options.fileName ?? "screenshot.png", source });
        })

        log("screenshot has been taken");

        await browser.close();
        await server.close();

    }

})
