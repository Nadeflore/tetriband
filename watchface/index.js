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
                const vibrator = hmSensor.createSensor(hmSensor.id.VIBRATE)

                // Constants and computed values

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

                const scorePerLineClear = [0, 40, 100, 300, 1200]

                // State of the game

                const currentAndNextPieces = new Array(4).fill(0)
                let highestPerColumn = new Array(visiblePlayAreaWidth).fill(0)
                let fallingPieceState
                let playArea
                let holdPiece
                let holdUsed
                let level
                let lines
                let score
                let vibrationActivated = true

                // time, game, pause, help, about
                let state = "time"

                // Timers
                let gravityTimer

                /**
                 * Widgets
                 */

                // background
                hmUI.createWidget(hmUI.widget.IMG, {
                    x: 0,
                    y: 0,
                    src: 'background.png',
                    show_level: hmUI.show_level.ONLY_NORMAL
                })

                // Time
                const timeNumbersArray = new Array(10).fill(0).map((_, i) => `numbers/${i}.png`)
                let timeWidget = hmUI.createWidget(hmUI.widget.IMG_TIME, {
                    hour_zero: true,
                    hour_startX: 24,
                    hour_startY: 101,
                    hour_array: timeNumbersArray,
                    hour_space: 36,
                    minutes_follow: false,
                    minute_zero: true,
                    minute_startX: 24,
                    minute_startY: 263,
                    minute_array: timeNumbersArray,
                    minute_space: 36,
                })

                const dateNumbersArray = new Array(10).fill(0).map((_, i) => `numbers/date_${i}.png`)
                const dateWidget = hmUI.createWidget(hmUI.widget.IMG_DATE, {
                    month_startX: 32,
                    month_startY: 437,
                    month_unit_sc: 'numbers/date_slash.png',
                    month_unit_tc: 'numbers/date_slash.png',
                    month_unit_en: 'numbers/date_slash.png',
                    month_align: hmUI.align.LEFT,
                    month_space: 1,
                    month_zero: 1,
                    month_en_array: dateNumbersArray,
                    month_sc_array: dateNumbersArray,
                    month_tc_array: dateNumbersArray,
                    day_align: hmUI.align.LEFT,
                    day_space: 1,
                    day_zero: 1,
                    day_follow: 1,
                    day_en_array: dateNumbersArray,
                    day_sc_array: dateNumbersArray,
                    day_tc_array: dateNumbersArray,
                })
                const weekArray = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((d) => `numbers/date_${d}.png`)
                const weekDayWidget = hmUI.createWidget(hmUI.widget.IMG_WEEK, {
                    x: 114,
                    y: 437,
                    // w,h cannot be set, use the actual width and height of the image in the weekArray.
                    week_en: weekArray,
                    week_tc: weekArray,
                    week_sc: weekArray
                })

                const batteryArray = new Array(4).fill(0).map((_, i) => `battery_${i + 1}.png`)
                const batteryWidget = hmUI.createWidget(hmUI.widget.IMG_LEVEL, {
                    x: 44,
                    y: 26,
                    w: 31,
                    h: 19,
                    image_array: batteryArray,
                    image_length: 4,
                    type: hmUI.data_type.BATTERY
                })

                // hold piece
                const holdPieceWidget = hmUI.createWidget(hmUI.widget.IMG, {
                    x: 35,
                    y: 25,
                    visible: false,
                    show_level: hmUI.show_level.ONLY_NORMAL
                })

                // Hold disabled
                const holdDisabledWidget = hmUI.createWidget(hmUI.widget.IMG, {
                    x: 33,
                    y: 51,
                    src: 'hold_disabled.png',
                    visibility: false,
                    show_level: hmUI.show_level.ONLY_NORMAL
                })

                const playAreaWidgets = []
                const playAreaFontArray = [0, 1, 2, 3, 4, 5, 6, 7, 0, 0].map(t => `blocks/${t}.png`)
                for (let y = 0; y < visiblePlayAreaHeight; y++) {
                    const widgetsRow = []
                    // Use 2 TEXT_IMG widgets, because each is 7 char max
                    for (let x = 0; x < 2; x++) {
                        widgetsRow.push(
                            hmUI.createWidget(hmUI.widget.TEXT_IMG, {
                                x: x * visiblePlayAreaWidthPx / 2 + playAreaPadding,
                                y: holdHeight + (visiblePlayAreaHeight - y - 1) * blockSize,
                                w: visiblePlayAreaWidthPx / 2,
                                h: blockSize,
                                visible: false,
                                font_array: playAreaFontArray,
                                show_level: hmUI.show_level.ONLY_NORMAL
                            })
                        )
                    }
                    playAreaWidgets.push(widgetsRow)
                }

                const fallingPieceWidget = hmUI.createWidget(hmUI.widget.IMG, {
                    show_level: hmUI.show_level.ONLY_NORMAL
                })

                const hardDropPreviewWidget = hmUI.createWidget(hmUI.widget.IMG, {

                    show_level: hmUI.show_level.ONLY_NORMAL
                })

                const nextPieceWidgets = new Array(3).fill(0).map((_, i) => hmUI.createWidget(hmUI.widget.IMG, {
                    x: 32 + 45 * i,
                    y: 437,
                    show_level: hmUI.show_level.ONLY_NORMAL
                }))

                const levelWidget = hmUI.createWidget(hmUI.widget.TEXT, {
                    x: 86,
                    y: 13,
                    w: 20,
                    h: 12,
                    color: 0xffffff,
                    text_size: 11,
                    align_h: hmUI.align.LEFT,
                    align_v: hmUI.align.BOTTOM,
                    text_style: hmUI.text_style.NONE,
                })

                const linesCountWidget = hmUI.createWidget(hmUI.widget.TEXT, {
                    x: 86,
                    y: 31,
                    w: 39,
                    h: 12,
                    color: 0xffffff,
                    text_size: 11,
                    align_h: hmUI.align.LEFT,
                    align_v: hmUI.align.BOTTOM,
                    text_style: hmUI.text_style.NONE,
                })

                const scoreWidget = hmUI.createWidget(hmUI.widget.TEXT, {
                    x: 86,
                    y: 49,
                    w: 45,
                    h: 12,
                    color: 0xffffff,
                    text_size: 11,
                    align_h: hmUI.align.LEFT,
                    align_v: hmUI.align.BOTTOM,
                    text_style: hmUI.text_style.NONE,
                })

                // Functions definition 

                function vibrate() {
                    if (vibrationActivated) {
                        vibrator.stop()
                        vibrator.scene = 23
                        vibrator.start()
                    }
                }

                function handlePauseMenuClick(info) {
                    if (state == "pause") {
                        if (info.y < 156) {
                            resumeGame()
                        } else if (info.y < 219) {
                            state = "help"
                        } else if (info.y < 279) {
                            state = "about"
                        } else if (info.y < 338) {
                            displayTime()
                        }
                    } else if (state == "help" || state == "about") {
                        state = "pause"
                    }

                    refreshPauseMenu()
                }

                function handleVibrationStatusClick() {
                    if (state == "pause") {
                        vibrationActivated = !vibrationActivated
                        if (vibrationActivated) {
                            vibrate()
                        }
                        vibrationStatusdWidget.setProperty(hmUI.prop.SRC, `vibration_${vibrationActivated}.png`)
                    }
                }

                function displayTime() {
                    state = "time"
                    refreshPauseMenu()
                    // Disable game widgets
                    setGameWidgetsVisibility(false)

                    // Show time widgets
                    setTimeWidgetsVisibility(true)

                    hardDropControl.addEventListener(hmUI.event.CLICK_DOWN, startGame)
                }

                function setGameWidgetsVisibility(visibility) {
                    holdPieceWidget.setProperty(hmUI.prop.VISIBLE, visibility);
                    holdDisabledWidget.setProperty(hmUI.prop.VISIBLE, visibility);
                    playAreaWidgets.forEach(a => a.forEach(w => w.setProperty(hmUI.prop.VISIBLE, visibility)));
                    fallingPieceWidget.setProperty(hmUI.prop.VISIBLE, visibility);
                    hardDropPreviewWidget.setProperty(hmUI.prop.VISIBLE, visibility);
                    nextPieceWidgets.forEach(w => w.setProperty(hmUI.prop.VISIBLE, visibility));
                    levelWidget.setProperty(hmUI.prop.VISIBLE, visibility);
                    linesCountWidget.setProperty(hmUI.prop.VISIBLE, visibility);
                    scoreWidget.setProperty(hmUI.prop.VISIBLE, visibility);
                }

                function setTimeWidgetsVisibility(visibility) {
                    timeWidget.setProperty(hmUI.prop.VISIBLE, visibility);
                    dateWidget.setProperty(hmUI.prop.VISIBLE, visibility);
                    weekDayWidget.setProperty(hmUI.prop.VISIBLE, visibility);
                    batteryWidget.setProperty(hmUI.prop.VISIBLE, visibility);
                }

                function refreshPauseMenu() {
                    let menuDisplayed = true
                    if (state == "pause") {
                        menuWidget.setProperty(hmUI.prop.SRC, `menu.png`)
                    } else if (state == "help") {
                        menuWidget.setProperty(hmUI.prop.SRC, `help.png`)
                    } else if (state == "about") {
                        menuWidget.setProperty(hmUI.prop.SRC, `about.png`)
                    } else {
                        menuDisplayed = false
                    }
                    menuWidget.setProperty(hmUI.prop.VISIBLE, menuDisplayed)
                    vibrationStatusdWidget.setProperty(hmUI.prop.VISIBLE, state == "pause")
                }

                function pauseGame() {
                    if (state == "game") {
                        removeControlsEventListeners()
                        console.log("pause game")
                        if (gravityTimer) {
                            timer.stopTimer(gravityTimer)
                            gravityTimer = null
                        }

                        menuWidget.addEventListener(hmUI.event.CLICK_UP, handlePauseMenuClick)
                        vibrationStatusdWidget.addEventListener(hmUI.event.CLICK_UP, handleVibrationStatusClick)
                        state = "pause"
                        refreshPauseMenu()
                    }
                }

                function resumeGame() {
                    console.log("resume game")
                    menuWidget.removeEventListener(hmUI.event.CLICK_UP, handlePauseMenuClick)
                    vibrationStatusdWidget.removeEventListener(hmUI.event.CLICK_UP, handleVibrationStatusClick)

                    // Enable controls and timer
                    addControlsEventListeners()
                    setGravityTimer()
                    state = "game"
                    refreshPauseMenu()
                }

                function generateEmptyPlayArea() {
                    return new Array(playAreaHeight).fill(0).map((v, y) => new Array(playAreaWidth).fill(0).map((w, x) => (x == 0 || x == playAreaWidth - 1 || y == 0) ? 100 : 0));
                }

                function generateEmptyRow() {
                    return new Array(playAreaWidth).fill(0).map((w, x) => (x == 0 || x == playAreaWidth - 1) ? 100 : 0)
                }

                function generateNewRandomPiece() {
                    let newPiece
                    for (let i = 0; i < 6; i++) {
                        newPiece = Math.floor(Math.random() * 7) + 1;

                        if (!currentAndNextPieces.includes(newPiece)) {
                            return newPiece
                        }
                    }
                    return newPiece
                }

                function setUpCurrentAndNextPieces() {
                    currentAndNextPieces.forEach((_, i) => { currentAndNextPieces[i] = generateNewRandomPiece() })
                    refreshNextPieces()
                }

                function startGame() {
                    state = "game"
                    hardDropControl.removeEventListener(hmUI.event.CLICK_DOWN, startGame)
                    setGameWidgetsVisibility(true)
                    // Show time widgets
                    setTimeWidgetsVisibility(false)

                    // Reset play area
                    playArea = generateEmptyPlayArea()
                    refreshPlayArea()
                    holdPiece = null
                    holdUsed = false
                    level = 0
                    lines = 0
                    score = 0
                    refreshHoldPiece()
                    refreshCounters()
                    setUpCurrentAndNextPieces()
                    handleNewPiece()
                    refreshFallingPiece(true)
                    resumeGame()
                }

                function handleNewPiece(holdPiece = null) {
                    if (holdPiece) {
                        currentAndNextPieces[0] = holdPiece
                    } else {
                        if (holdUsed) {
                            holdUsed = false
                            refreshHoldPiece()
                        }

                        // try to generate new random piece that is not same of the last 4
                        const newPiece = generateNewRandomPiece()

                        // Shift to next piece
                        currentAndNextPieces.shift()

                        // Add newly generated at the end
                        currentAndNextPieces.push(newPiece)

                        refreshNextPieces()
                    }

                    // Reset falling piece position
                    fallingPieceState = {
                        x: 3,
                        y: 17,
                        rotation: 0
                    }

                    // Check game over
                    if (!canMoveTo(fallingPieceState)) {
                        startGame()
                        return
                    }

                    refreshFallingPiece(true)

                    setGravityTimer();
                }

                function setGravityTimer() {
                    // Reset timer
                    if (gravityTimer) {
                        timer.stopTimer(gravityTimer)
                        gravityTimer = null
                    }
                    const gravityDelay = 1000 / 60 * Math.max(60 - level * 4, 1);
                    gravityTimer = timer.createTimer(gravityDelay, gravityDelay, option => {
                        if (!moveTo({
                            ...fallingPieceState, y: fallingPieceState.y - 1
                        })) {
                            lockFallingPiece()
                        }
                    })
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

                    if (clearCount != 0) {
                        score += scorePerLineClear[clearCount] * (level + 1)
                        lines += clearCount
                        level = Math.floor(lines / 5)
                        refreshCounters()
                        vibrate()
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

                function findHardDropPosition() {
                    const position = findHardDropPositionFast()
                    return position <= fallingPieceState.y ? position : findHardDropPositionSlow()
                }

                function findHardDropPositionSlow() {
                    console.log("Using slow hard drop")
                    let y = fallingPieceState.y
                    while (canMoveTo({ ...fallingPieceState, y: y - 1 })) {
                        y--
                    }

                    return y
                }

                function findHardDropPositionFast() {
                    const columns = new Array(4).fill(-2)
                    piecesRotationsCoords[currentAndNextPieces[0] - 1][fallingPieceState.rotation].forEach(([x, y]) => {
                        columns[x] = Math.max(columns[x], highestPerColumn[x + fallingPieceState.x] - y)
                    })

                    return Math.max(...columns)
                }

                function performHardDrop() {
                    //setGravity(1)
                    fallingPieceState.y = findHardDropPosition()
                    lockFallingPiece()
                }

                function lockFallingPiece() {
                    getFallingPieceCoordinates(fallingPieceState).forEach(([x, y]) => playArea[y + 1][x + 1] = currentAndNextPieces[0])

                    detectLineClear()

                    refreshPlayArea()

                    handleNewPiece()
                }

                function getFallingPieceCoordinates({ x, y, rotation }) {
                    return piecesRotationsCoords[currentAndNextPieces[0] - 1][rotation].map(coord => [coord[0] + x, coord[1] + y])
                }

                // Widgets refresh methods

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

                            if (params.text) {
                                // widget.setProperty(hmUI.prop.MORE, params)
                                widget.setProperty(hmUI.prop.X, params.x)
                                widget.setProperty(hmUI.prop.W, params.text.length * blockSize)
                                widget.setProperty(hmUI.prop.TEXT, params.text)
                                widget.setProperty(hmUI.prop.VISIBLE, true)
                            } else {
                                widget.setProperty(hmUI.prop.VISIBLE, false)
                            }
                        }
                    }

                    // Refresh highest per column
                    for (let x = 0; x < visiblePlayAreaWidth; x++) {
                        let y
                        for (y = visiblePlayAreaHeight; y >= 0; y--) {
                            if (playArea[y + 1][x + 1]) {
                                break
                            }
                        }
                        highestPerColumn[x] = y + 1
                    }
                }

                function refreshFallingPiece() {
                    const type = currentAndNextPieces[0]
                    const yOffset = type == 1 ? 1 : 0
                    const updatedParams = {
                        x: fallingPieceState.x * blockSize + playAreaPadding,
                        y: holdHeight + (visiblePlayAreaHeight - fallingPieceState.y - 3 - yOffset) * blockSize,
                        src: `tetrominos/${type}_${fallingPieceState.rotation + 1}.png`
                    }
                    fallingPieceWidget.setProperty(hmUI.prop.MORE, updatedParams)

                    // hard drop preview
                    const updatedParams2 = {
                        x: fallingPieceState.x * blockSize + playAreaPadding,
                        y: holdHeight + (visiblePlayAreaHeight - findHardDropPosition() - 3 - yOffset) * blockSize,
                        src: `tetrominos/preview_${type}_${fallingPieceState.rotation + 1}.png`
                    }
                    hardDropPreviewWidget.setProperty(hmUI.prop.MORE, updatedParams2)
                }

                function refreshNextPieces() {
                    nextPieceWidgets.forEach((w, i) => { w.setProperty(hmUI.prop.SRC, `tetrominos/mini_${currentAndNextPieces[1 + i]}.png`) })
                }

                function refreshHoldPiece() {
                    if (holdPiece) {
                        holdPieceWidget.setProperty(hmUI.prop.SRC, `tetrominos/mini_${holdPiece}.png`)
                        holdPieceWidget.setProperty(hmUI.prop.VISIBLE, true)
                    } else {
                        holdPieceWidget.setProperty(hmUI.prop.VISIBLE, false)
                    }

                    if (holdUsed) {
                        holdDisabledWidget.setProperty(hmUI.prop.VISIBLE, true)
                    } else {
                        holdDisabledWidget.setProperty(hmUI.prop.VISIBLE, false)
                    }
                }

                function refreshCounters() {
                    levelWidget.setProperty(hmUI.prop.TEXT, String(level))
                    linesCountWidget.setProperty(hmUI.prop.TEXT, String(lines))
                    scoreWidget.setProperty(hmUI.prop.TEXT, String(score))
                }

                // Controls

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

                // Menu
                const menuWidget = hmUI.createWidget(hmUI.widget.IMG, {
                    x: 0,
                    y: 0,
                    src: 'menu.png',
                    show_level: hmUI.show_level.ONLY_NORMAL
                })

                const vibrationStatusdWidget = hmUI.createWidget(hmUI.widget.IMG, {
                    x: 0,
                    pos_x: 72,
                    y: 338,
                    pos_y: 7,
                    w: 192,
                    h: 152,
                    src: 'vibration_true.png',
                    show_level: hmUI.show_level.ONLY_NORMAL
                })

                // Move methods
                const rotateLeft = () => {
                    moveTo({
                        ...fallingPieceState, rotation: (fallingPieceState.rotation - 1) & 3
                    })
                }
                const rotateRight = () => {
                    moveTo({
                        ...fallingPieceState, rotation: (fallingPieceState.rotation + 1) & 3
                    })
                }
                const moveLeft = () => {
                    moveTo({
                        ...fallingPieceState, x: fallingPieceState.x - 1
                    })
                }
                const moveRight = () => {
                    moveTo({
                        ...fallingPieceState, x: fallingPieceState.x + 1
                    })
                }
                let hardDropButtonHoldTimer
                const dropDown = () => {
                    hardDropButtonHoldTimer = timer.createTimer(200, null, option => {
                        hardDropButtonHoldTimer = undefined
                        // Hard drop
                        performHardDrop()
                    })
                }
                const dropUp = () => {
                    if (hardDropButtonHoldTimer != undefined) {
                        timer.stopTimer(hardDropButtonHoldTimer)
                        // Soft drop
                        moveTo({
                            ...fallingPieceState, y: fallingPieceState.y - 1
                        })
                    }
                }

                const hold = () => {
                    if (!holdUsed) {
                        holdUsed = true
                        const poppedPiece = holdPiece
                        holdPiece = currentAndNextPieces[0]
                        refreshHoldPiece()
                        handleNewPiece(poppedPiece)
                    }
                }

                function addControlsEventListeners() {
                    rotateLeftControl.addEventListener(hmUI.event.CLICK_DOWN, rotateLeft)

                    rotateRightControl.addEventListener(hmUI.event.CLICK_DOWN, rotateRight)

                    moveLeftControl.addEventListener(hmUI.event.CLICK_DOWN, moveLeft)

                    moveRightControl.addEventListener(hmUI.event.CLICK_DOWN, moveRight)

                    hardDropControl.addEventListener(hmUI.event.CLICK_DOWN, dropDown)

                    hardDropControl.addEventListener(hmUI.event.CLICK_UP, dropUp)

                    holdControl.addEventListener(hmUI.event.CLICK_DOWN, hold)
                }

                function removeControlsEventListeners() {
                    rotateLeftControl.removeEventListener(hmUI.event.CLICK_DOWN, rotateLeft)

                    rotateRightControl.removeEventListener(hmUI.event.CLICK_DOWN, rotateRight)

                    moveLeftControl.removeEventListener(hmUI.event.CLICK_DOWN, moveLeft)

                    moveRightControl.removeEventListener(hmUI.event.CLICK_DOWN, moveRight)

                    hardDropControl.removeEventListener(hmUI.event.CLICK_DOWN, dropDown)

                    hardDropControl.removeEventListener(hmUI.event.CLICK_UP, dropUp)

                    holdControl.removeEventListener(hmUI.event.CLICK_DOWN, hold)
                }

                hmUI.createWidget(hmUI.widget.WIDGET_DELEGATE, {
                    resume_call: (function () { pauseGame() })
                })

                // Init game state  
                // resetGame()
                displayTime()
            },

            onInit() {
                console.log("index page.js on init invoke");
                this.init_view();

                // const time = hmSensor.createSensor(hmSensor.id.TIME)

                // const fpsWidget = hmUI.createWidget(hmUI.widget.TEXT, {
                //     x: 10,
                //     y: 70,
                //     w: 140,
                //     h: 20,
                //     color: 0xffffff,
                //     text_size: 15,
                //     align_h: hmUI.align.LEFT,
                //     align_v: hmUI.align.BOTTOM,
                //     text_style: hmUI.text_style.NONE
                // })

                // let previousTime = time.utc
                // let fps = 0
                // let counter = 0

                // timer.createTimer(1, 1, option => {
                //     fps++
                //     const currentTime = time.utc
                //     if (currentTime - previousTime > 1000) {
                //         fpsWidget.setProperty(hmUI.prop.TEXT, String(fps))
                //         fps = 0
                //         previousTime = currentTime
                //     } else {
                //         // Forcce screen update
                //         fpsWidget.setProperty(hmUI.prop.X, 10 + (counter++) % 4)
                //     }
                // })
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