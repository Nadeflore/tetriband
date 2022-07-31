try {
    (() => {
        var n = __$$hmAppManager$$__.currentApp;
        var __$$app$$__ = __$$hmAppManager$$__.currentApp;
        var __$$module$$__ = __$$app$$__.current;
        var h = new DeviceRuntimeCore.WidgetFactory(
            new DeviceRuntimeCore.HmDomApi(__$$app$$__, __$$module$$__),
            "drink"
        );
        const g = n.current,
            {
                px: p
            } = (new DeviceRuntimeCore.WidgetFactory(new DeviceRuntimeCore.HmDomApi(n, g)), n.app.__globals__),
            e = DeviceRuntimeCore.HmLogger.getLogger("watchface6");
        g.module = DeviceRuntimeCore.WatchFace({
            init_view() {
                console.log("Initview called")
                const screenWidth = 192
                const screenHeight = 490


                const visiblePlayAreaWidth = 10
                const visiblePlayAreaHeight = 20
                const playAreaWidth = visiblePlayAreaWidth + 2
                const playAreaHeight = visiblePlayAreaHeight + 10

                const blockSize = 18
                const visiblePlayAreaWidthPx = visiblePlayAreaWidth * blockSize
                const visiblePlayAreaHeightPx = visiblePlayAreaHeight * blockSize

                const playAreaPadding = (screenWidth - visiblePlayAreaWidthPx) / 2;

                const holdHeight = (screenHeight - visiblePlayAreaHeightPx) / 2
                const rotateHeight = visiblePlayAreaHeightPx / 2
                const moveHeight = visiblePlayAreaHeightPx / 2


                const piecesRotationsCoords = [
                    // I (center coordinates first so that test is always within bound)
                    [
                        [[1, 2], [2, 2], [0, 2], [3, 2]],
                        [[2, 1], [2, 2], [2, 0], [2, 3]],
                        [[1, 1], [2, 1], [0, 1], [3, 1]],
                        [[1, 1], [1, 2], [1, 0], [1, 3]],
                    ],
                    // O
                    [
                        [[1, 1], [1, 2], [2, 1], [2, 2]],
                        [[1, 1], [1, 2], [2, 1], [2, 2]],
                        [[1, 1], [1, 2], [2, 1], [2, 2]],
                        [[1, 1], [1, 2], [2, 1], [2, 2]]
                    ],
                    // T
                    [
                        [[0, 1], [1, 1], [2, 1], [1, 2]],
                        [[1, 0], [1, 1], [2, 1], [1, 2]],
                        [[0, 1], [1, 1], [2, 1], [1, 0]],
                        [[0, 1], [1, 1], [1, 0], [1, 2]],
                    ],
                    // S
                    [
                        [[2, 2], [0, 1], [1, 1], [1, 2]],
                        [[2, 1], [1, 1], [1, 2], [2, 0]],
                        [[1, 0], [1, 1], [2, 1], [0, 0]],
                        [[0, 2], [1, 0], [1, 1], [0, 1]]
                    ],
                    // Z
                    [
                        [[0, 2], [1, 2], [1, 1], [2, 1]],
                        [[1, 0], [1, 1], [2, 1], [2, 2]],
                        [[0, 1], [1, 1], [1, 0], [2, 0]],
                        [[0, 0], [0, 1], [1, 1], [1, 2]]
                    ],
                    // J
                    [
                        [[0, 2], [0, 1], [1, 1], [2, 1]],
                        [[1, 0], [1, 1], [1, 2], [2, 2]],
                        [[0, 1], [1, 1], [2, 1], [2, 0]],
                        [[0, 0], [1, 0], [1, 1], [1, 2]]
                    ],
                    // L
                    [
                        [[2, 2], [0, 1], [1, 1], [2, 1]],
                        [[1, 0], [1, 1], [1, 2], [2, 0]],
                        [[0, 1], [1, 1], [2, 1], [0, 0]],
                        [[0, 2], [1, 0], [1, 1], [1, 2]]
                    ]
                ]


                let fallingPieceType = 1;

                let fallingPieceState = {
                    x: 3,
                    y: 17,
                    rotation: 0
                }

                let playArea = generateEmptyPlayArea()

                // background
                hmUI.createWidget(hmUI.widget.IMG, {
                    x: 0,
                    y: 0,
                    src: 'background.png',
                    show_level: hmUI.show_level.ONLY_NORMAL
                })

                // hold piece
                const holdPiece = hmUI.createWidget(hmUI.widget.IMG, {
                    x: 35,
                    y: 25,
                    src: 'tetrominos/1.png',
                    show_level: hmUI.show_level.ONLY_NORMAL
                })

                const playAreaWidgets = []
                const playAreaFontArray = [0, 1, 2, 3, 4, 5, 6, 7, 0, 0].map(t => `blocks/${t}.png`)
                for (let y = 0; y < visiblePlayAreaHeight; y++) {
                    const widgetsRow = []
                    for (let x = 0; x < 2; x++) {
                        widgetsRow.push(
                            hmUI.createWidget(hmUI.widget.TEXT_IMG, {
                                x: x * visiblePlayAreaWidthPx / 2 + playAreaPadding,
                                y: holdHeight + (visiblePlayAreaHeight - y - 1) * blockSize,
                                w: visiblePlayAreaWidthPx / 2,
                                h: blockSize,
                                font_array: playAreaFontArray,
                                show_level: hmUI.show_level.ONLY_NORMAL
                            })
                        )
                    }
                    playAreaWidgets.push(widgetsRow)
                }


                const fallingPieceWidgets = new Array(4).fill(0).map(() => hmUI.createWidget(hmUI.widget.IMG, {
                    w: blockSize,
                    h: blockSize,
                    show_level: hmUI.show_level.ONLY_NORMAL
                }))

                generateNewPiece()

                refreshFallingPiece(true)

                function generateEmptyPlayArea() {
                    return new Array(playAreaHeight).fill(0).map((v, y) => new Array(playAreaWidth).fill(0).map((w, x) => (x == 0 || x == playAreaWidth - 1 || y == 0) ? 100 : 0));
                }

                function generateEmptyRow() {
                    return new Array(playAreaWidth).fill(0).map((w, x) => (x == 0 || x == playAreaWidth - 1) ? 100 : 0)
                }

                function generateNewPiece() {
                    fallingPieceState = {
                        x: 3,
                        y: 17,
                        rotation: 0
                    };
                    fallingPieceType = Math.floor(Math.random() * 7) + 1;

                    // Check game over
                    if (!canMoveTo(fallingPieceState)) {
                        playArea = generateEmptyPlayArea()
                        refreshPlayArea()
                        generateNewPiece()
                    }

                    refreshFallingPiece(true)
                }

                function detectLineClear() {
                    let clearCount = 0
                    let y = 1;
                    while (y < playAreaHeight) {
                        const row = playArea[y + clearCount] || generateEmptyRow()
                        if (row.every(v => !!v)) {
                            clearCount++
                        } else {
                            playArea[y] = row
                            y++
                        }
                    }
                }

                function canMoveTo(state) {
                    return getFallingPieceCoordinates(state).every(([x, y]) => !playArea[y + 1][x + 1])
                }

                function moveTo(state) {
                    if (canMoveTo(state)) {
                        fallingPieceState = state
                        refreshFallingPiece()
                        return true
                    }

                    return false
                }

                function getFallingPieceCoordinates({ x, y, rotation }) {
                    return piecesRotationsCoords[fallingPieceType - 1][rotation].map(coord => [coord[0] + x, coord[1] + y])
                }

                function refreshPlayArea() {
                    for (let y = 0; y < visiblePlayAreaHeight; y++) {
                        for (let x = 0; x < 2; x++) {
                            const text = playArea[y + 1].slice(1 + x * 5, 6 + x * 5).join('')
                            const match = text.match(/^(0*)(.*?)(0*)$/)
                            const params = {
                                x: playAreaPadding + match[1].length * blockSize + x * visiblePlayAreaWidthPx / 2,
                                text: match[2]
                            }
                            const widget = playAreaWidgets[y][x]
                            // widget.setProperty(hmUI.prop.MORE, params)
                            widget.setProperty(hmUI.prop.X, params.x)
                            widget.setProperty(hmUI.prop.TEXT, params.text)
                        }
                    }

                    // TODO TEMP
                    holdPiece.setProperty(hmUI.prop.SRC, `tetrominos/${fallingPieceType}.png`)
                }

                function refreshFallingPiece(updateType = false) {
                    getFallingPieceCoordinates(fallingPieceState).forEach((coord, i) => {
                        const updatedParams = {
                            x: coord[0] * blockSize + playAreaPadding,
                            y: holdHeight + (visiblePlayAreaHeight - coord[1] - 1) * blockSize,
                        }
                        if (updateType) {
                            updatedParams.src = `blocks/${fallingPieceType}.png`
                        }
                        fallingPieceWidgets[i].setProperty(hmUI.prop.MORE, updatedParams)
                    })
                }

                function lockFallingPiece() {
                    getFallingPieceCoordinates(fallingPieceState).forEach(([x, y]) => playArea[y + 1][x + 1] = fallingPieceType)

                    detectLineClear()

                    refreshPlayArea()

                    generateNewPiece()
                }

                const holdControl = hmUI.createWidget(hmUI.widget.IMG, {
                    x: 0,
                    y: 0,
                    w: screenWidth,
                    h: holdHeight
                })

                const rotateLeftControl = hmUI.createWidget(hmUI.widget.IMG, {
                    x: 0,
                    y: holdHeight,
                    w: screenWidth / 2,
                    h: rotateHeight
                })

                const rotateRightControl = hmUI.createWidget(hmUI.widget.IMG, {
                    x: screenWidth / 2,
                    y: holdHeight,
                    w: screenWidth / 2,
                    h: rotateHeight
                })

                const moveLeftControl = hmUI.createWidget(hmUI.widget.IMG, {
                    x: 0,
                    y: holdHeight + rotateHeight,
                    w: screenWidth / 2,
                    h: moveHeight
                })

                const moveRightControl = hmUI.createWidget(hmUI.widget.IMG, {
                    x: screenWidth / 2,
                    y: holdHeight + rotateHeight,
                    w: screenWidth / 2,
                    h: moveHeight
                })

                const hardDropControl = hmUI.createWidget(hmUI.widget.IMG, {
                    x: 0,
                    y: holdHeight + rotateHeight + moveHeight,
                    w: screenWidth,
                    h: screenHeight - holdHeight - rotateHeight - moveHeight
                })

                holdControl.addEventListener(hmUI.event.CLICK_DOWN, info => {

                })

                rotateLeftControl.addEventListener(hmUI.event.CLICK_DOWN, info => {
                    moveTo({
                        ...fallingPieceState, rotation: (fallingPieceState.rotation - 1) & 3
                    })
                })

                rotateRightControl.addEventListener(hmUI.event.CLICK_DOWN, info => {
                    moveTo({
                        ...fallingPieceState, rotation: (fallingPieceState.rotation + 1) & 3
                    })
                })

                moveLeftControl.addEventListener(hmUI.event.CLICK_DOWN, info => {
                    moveTo({
                        ...fallingPieceState, x: fallingPieceState.x - 1
                    })
                })

                moveRightControl.addEventListener(hmUI.event.CLICK_DOWN, info => {
                    moveTo({
                        ...fallingPieceState, x: fallingPieceState.x + 1
                    })
                })

                hardDropControl.addEventListener(hmUI.event.CLICK_DOWN, info => {
                    moveTo({
                        ...fallingPieceState, y: fallingPieceState.y - 1
                    })
                })

                timer.createTimer(0, 1000, option => {
                    if (!moveTo({
                        ...fallingPieceState, y: fallingPieceState.y - 1
                    })) {
                        lockFallingPiece()
                    }
                })
            },

            onInit() {
                console.log("index page.js on init invoke");
                this.init_view();
            },

            onReady() {
                console.log("index page.js on ready invoke");
            },

            onShow() {
                console.log("index page.js on show invoke");
            },

            onHide() {
                console.log("index page.js on hide invoke");
            },

            onDestory() {
                console.log("index page.js on destory invoke");
            }
        }) // end Watchface
    })()
} catch (n) {
    console.log(n)
}