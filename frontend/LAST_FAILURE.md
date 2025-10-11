> MulterError: Unexpected field
    at wrappedFileFilter (/Users/cemakpolat/Development/top-projects/soundw
ave/backend/node_modules/multer/index.js:40:19)
    at Multipart.<anonymous> (/Users/cemakpolat/Development/top-projects/so
undwave/backend/node_modules/multer/lib/make-middleware.js:107:7)
    at Multipart.emit (node:events:508:28)
    at Multipart.emit (node:domain:489:12)
    at HeaderParser.cb (/Users/cemakpolat/Development/top-projects/soundwav
e/backend/node_modules/busboy/lib/types/multipart.js:358:14)
    at HeaderParser.push (/Users/cemakpolat/Development/top-projects/soundw
ave/backend/node_modules/busboy/lib/types/multipart.js:162:20)
    at SBMH.ssCb [as _cb] (/Users/cemakpolat/Development/top-projects/sound
wave/backend/node_modules/busboy/lib/types/multipart.js:394:37)
    at feed (/Users/cemakpolat/Development/top-projects/soundwave/backend/n
ode_modules/streamsearch/lib/sbmh.js:248:10)
    at SBMH.push (/Users/cemakpolat/Development/top-projects/soundwave/back
end/node_modules/streamsearch/lib/sbmh.js:104:16)
    at Multipart._write (/Users/cemakpolat/Development/top-projects/soundwa
ve/backend/node_modules/busboy/lib/types/multipart.js:567:19)

⏺ The issue is that the frontend is sending the file with field name cover
  but the backend is expecting a different field name. Let me check the
  backend album routes to see what field name is configured:
