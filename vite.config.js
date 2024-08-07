import path from 'path'

export default {
    build: {
        target: 'esnext',
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, "index.html"),
                whatsnew: path.resolve(__dirname, 'src/whatsnew/whatsnew.html'),
            }
        }
    }
}