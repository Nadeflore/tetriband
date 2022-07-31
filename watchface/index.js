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
                for (let y = 0; y < visiblePlayAreaHeight; y++) {
                    const widgetsRow = []
                    for (let x = 0; x < visiblePlayAreaWidth; x++) {
                        widgetsRow.push(
                            hmUI.createWidget(hmUI.widget.IMG, {
                                x: x * blockSize + (screenWidth - visiblePlayAreaWidthPx) / 2,
                                y: holdHeight + (visiblePlayAreaHeight - y - 1) * blockSize,
                                w: blockSize,
                                h: blockSize,
                                show_level: hmUI.show_level.ONLY_NORMAL
                            })
                        )
                    }
                    playAreaWidgets.push(widgetsRow)
                }

                generateNewPiece()

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
                        generateNewPiece()
                    }

                    refreshPlayArea()
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
                        refreshPlayArea()
                        return true
                    }

                    return false
                }

                function getFallingPieceCoordinates({ x, y, rotation }) {
                    return piecesRotationsCoords[fallingPieceType - 1][rotation].map(coord => [coord[0] + x, coord[1] + y])
                }

                function refreshPlayArea() {
                    // Draw background
                    for (let y = 0; y < visiblePlayAreaHeight; y++) {
                        for (let x = 0; x < visiblePlayAreaWidth; x++) {
                            setDisplayBlock(x, y, playArea[y + 1][x + 1])
                        }
                    }

                    // Draw falling piece
                    getFallingPieceCoordinates(fallingPieceState).forEach(([x, y]) => {
                        if (y < visiblePlayAreaHeight) {
                            setDisplayBlock(x, y, fallingPieceType);
                        }
                    })

                    holdPiece.setProperty(hmUI.prop.SRC, `tetrominos/${fallingPieceType}.png`)
                }

                function setDisplayBlock(x, y, blockType) {
                    if (blockType && blockType < 8) {
                        playAreaWidgets[y][x].setProperty(hmUI.prop.SRC, `blocks/${blockType}.png`)
                        playAreaWidgets[y][x].setProperty(hmUI.prop.VISIBLE, true)
                    } else {
                        playAreaWidgets[y][x].setProperty(hmUI.prop.VISIBLE, false)
                    }
                }

                function lockFallingPiece() {
                    getFallingPieceCoordinates(fallingPieceState).forEach(([x, y]) => playArea[y + 1][x + 1] = fallingPieceType)

                    detectLineClear()

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
                    refreshPlayArea()
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
        })
    })()
} catch (n) {
    console.log(n)
}