AppConfig = {
    version: "BUILD_NUMBER",
    PROCESSING_TIMEOUT: 10, // in minutes
    host: "",
    recorder: "AUDIO_RECORDER",
    flavor: "DEPLOYMENT",
    S3_CONTENT_HOST: "/assets/public/content/",
    PREVIEW_PLUGINSPATH: "/content-plugins",
    DEVICE_PLUGINSPATH: "/widgets/content-plugins",
    CORE_PLUGINSPATH: 'coreplugins',
    apislug: '/action',
    MIMETYPES:["application/vnd.ekstep.ecml-archive", "application/vnd.ekstep.html-archive"],
    DEFAULT_METADATA: {"identifier": "org.ekstep.item.sample", "mimeType": "application/vnd.ekstep.ecml-archive", "name": "Content Preview ", "author": "EkStep", "localData": {"name": "Content Preview ", "loadingMessage": "Without requirements or design, programming is the art of adding bugs to an empty text file. ...", "identifier": "org.ekstep.item.sample", "pkgVersion": 1 }, "isAvailable": true, "path": ""},
    CONTENT_LAUNCHERS: [{
        mimeType: 'application/vnd.ekstep.html-archive',
        id: 'org.ekstep.htmlrenderer',
        ver: 1.0,
        type: 'plugin'
    }, {
        mimeType: 'application/vnd.ekstep.ecml-archive',
        id: 'org.ekstep.ecmlrenderer',
        ver: 1.0,
        type: 'plugin'
    }],
    DEFAULT_PLUGINS: [
        {id: 'org.ekstep.launcher',ver: 1.0,type: 'plugin'}, 
        {id: 'org.ekstep.collection',ver: 1.0,type: 'plugin'}
    ],
    overlay: {
        userSwitcherEnabled: true,
        showUser: true,
        enableOverlay: true,
        overlayNext: true,
        overlayPrevious: true,
        overlaySubmit: false,
        overlayGoodJob: true,
        overlayTryAgain: true,
        overlayMenu: true,
        overlayReload: true,
        menu: {
            showReplay: true,
            showTeachersInstruction: true,
            showHome: true
        },
    }
}
