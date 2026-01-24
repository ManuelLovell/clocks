import path from 'path'

export default {
    server: { cors: true },
    build: {
        target: 'esnext',
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, "index.html"),
                pinned: path.resolve(__dirname, "pinned.html")
            }
        }
    }
}