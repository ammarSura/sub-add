const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Constants
const SCREEN_WIDTH = 1000;
const SCREEN_HEIGHT = 1000;
const PIPE_WIDTH = 40;
const PIPE_HEIGHT = PIPE_WIDTH * 9;

// Set canvas size
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;

const TOP_OFFSET = 100;
const BOTTOM_OFFSET = 100;

// Pipe positions
const recvPipeOne = {
  x: 100,
  y: SCREEN_HEIGHT - BOTTOM_OFFSET,
};

const recvPipeTwo = {
  x: 300,
  y: SCREEN_HEIGHT - 100,
};

const supPipeOne = {
  x: 100,
  y: PIPE_HEIGHT + TOP_OFFSET,
};

const supPipeTwo = {
  x: 300,
  y: PIPE_HEIGHT + TOP_OFFSET,
};

function drawPipe(x, y, openSide) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;

  // Left side
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - PIPE_HEIGHT);
  ctx.stroke();

  // Right side
  ctx.beginPath();
  ctx.moveTo(x + PIPE_WIDTH, y);
  ctx.lineTo(x + PIPE_WIDTH, y - PIPE_HEIGHT);
  ctx.stroke();

  // Bottom
  if (openSide === "top") {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + PIPE_WIDTH, y);
    ctx.stroke();
  } else if (openSide === "bottom") {
    ctx.beginPath();
    ctx.moveTo(x, y - PIPE_HEIGHT);
    ctx.lineTo(x + PIPE_WIDTH, y - PIPE_HEIGHT);
    ctx.stroke();
  }
}

function drawSuppPipe(x, y, n) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;

  // Left side
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - PIPE_HEIGHT);
  ctx.stroke();

  // Right side
  ctx.beginPath();
  ctx.moveTo(x + PIPE_WIDTH, y);
  ctx.lineTo(x + PIPE_WIDTH, y - PIPE_HEIGHT);
  ctx.stroke();

  // Top
  ctx.beginPath();
  ctx.moveTo(x, y - PIPE_HEIGHT);
  ctx.lineTo(x + PIPE_WIDTH, y - PIPE_HEIGHT);
  ctx.stroke();

  // Add number as label
  ctx.font = "36px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.fillText(n.toString(), x + PIPE_WIDTH / 2, y - PIPE_HEIGHT - 10);
}

function drawPlusSign(x, y) {
    ctx.font = "128px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText("+", x , y);
}

function drawBall(x, y, color) {
  const radius = PIPE_WIDTH / 2 - 2;

  // Fill circle
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  // Draw outline
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawInitialSetup() {
  // Clear screen
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  drawPlusSign(500, 500);

  // Draw pipes
  drawPipe(recvPipeOne.x, recvPipeOne.y, "top");
  drawPipe(recvPipeTwo.x, recvPipeTwo.y, "top");

  drawPipe(supPipeOne.x, supPipeOne.y, "bottom");
  drawPipe(supPipeTwo.x, supPipeTwo.y, "bottom");
}

function fillTopPipe(x, y, num) {
    for (let i = 0; i < num; i++) {
        drawBall(x + PIPE_WIDTH / 2, (y - PIPE_HEIGHT) + i * PIPE_WIDTH + PIPE_WIDTH / 2, "red");
    }
}

function fillBottomPipe(x, y, num) {
    for (let i = 0; i < num; i++) {
        drawBall(x + PIPE_WIDTH / 2, (y - PIPE_WIDTH) - (i * PIPE_WIDTH) + PIPE_WIDTH / 2, "blue");
    }
}

function getNumbersWPlaces(num) {
    const strNum = num.toString();
    const units = +(strNum.at(-1) || 0);
    const tens = +(strNum.at(-2) || 0);

    return {
        tens,
        units
    }
}

function fillTopPipes({ units, tens }) {
    // Clear the areas where the supply pipes are
    ctx.fillStyle = "white";
    ctx.fillRect(supPipeOne.x, supPipeOne.y - PIPE_HEIGHT, PIPE_WIDTH, PIPE_HEIGHT);
    ctx.fillRect(supPipeTwo.x, supPipeTwo.y - PIPE_HEIGHT, PIPE_WIDTH, PIPE_HEIGHT);

    // Clear the areas where the counts are
    ctx.fillRect(supPipeOne.x - PIPE_WIDTH/2, supPipeOne.y - PIPE_HEIGHT - 20 - PIPE_WIDTH, PIPE_WIDTH * 2, 40);
    ctx.fillRect(supPipeTwo.x - PIPE_WIDTH/2, supPipeTwo.y - PIPE_HEIGHT - 20 - PIPE_WIDTH, PIPE_WIDTH * 2, 40);

    // Redraw the supply pipes
    drawPipe(supPipeOne.x, supPipeOne.y, "bottom");
    drawPipe(supPipeTwo.x, supPipeTwo.y, "bottom");

    if (tens) {
        fillTopPipe(supPipeOne.x, supPipeOne.y, tens);
    }

    if (units) {
        fillTopPipe(supPipeTwo.x, supPipeTwo.y, units);
    }

    writePipeCounts(topnum, {
        x: supPipeOne.x,
        y: supPipeOne.y - PIPE_HEIGHT - PIPE_WIDTH - 20
    }, {
        x: supPipeTwo.x,
        y: supPipeTwo.y - PIPE_HEIGHT - PIPE_WIDTH - 20
    });
}

function writePipeCounts({ units, tens }, { x: x1, y: y1 }, { x: x2, y: y2 }) {
    ctx.font = "36px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";

    // Write counts under each pipe
    if (tens !== undefined) {
        ctx.fillText(tens.toString(), x1 + PIPE_WIDTH / 2, y1 + 40);
    }
    if (units !== undefined) {
        ctx.fillText(units.toString(), x2 + PIPE_WIDTH / 2, y2 + 40);
    }
}

function fillBottomPipes({ units, tens }) {
    // Clear the areas where the receiver pipes are
    ctx.fillStyle = "white";
    ctx.fillRect(recvPipeOne.x, recvPipeOne.y - PIPE_HEIGHT, PIPE_WIDTH, PIPE_HEIGHT);
    ctx.fillRect(recvPipeTwo.x, recvPipeTwo.y - PIPE_HEIGHT, PIPE_WIDTH, PIPE_HEIGHT);
    // Clear the areas where the counts are
    ctx.fillRect(recvPipeOne.x - PIPE_WIDTH/2, recvPipeOne.y + 10, PIPE_WIDTH * 2, 40);
    ctx.fillRect(recvPipeTwo.x - PIPE_WIDTH/2, recvPipeTwo.y + 10, PIPE_WIDTH * 2, 40);

    // Redraw the receiver pipes
    drawPipe(recvPipeOne.x, recvPipeOne.y, "top");
    drawPipe(recvPipeTwo.x, recvPipeTwo.y, "top");

    if (tens) {
        fillBottomPipe(recvPipeOne.x, recvPipeOne.y, tens);
    }

    if (units) {
        fillBottomPipe(recvPipeTwo.x, recvPipeTwo.y, units);
    }

    writePipeCounts({ units, tens }, recvPipeOne, recvPipeTwo);
}

const topnum = {
    units: 0,
    tens: 0
}

const bottomnum = {
    units: 0,
    tens: 0
}

document.getElementById("start-game").addEventListener("click", () => {
    const num1Val = document.getElementById("num1-input").value || 12;
    const num2Val = document.getElementById("num2-input").value || 37;
    const topVals = getNumbersWPlaces(num1Val)
    const bottomVals = getNumbersWPlaces(num2Val)

    if(!num1Val && !num2Val) {
        window.alert("Please enter at least 1 number");
        return;
    }

    topnum.tens = topVals.tens;
    topnum.units = topVals.units;
    bottomnum.tens = bottomVals.tens;
    bottomnum.units = bottomVals.units;

    console.log(topnum, bottomnum);

    drawInitialSetup();

    fillTopPipes(topnum);
    fillBottomPipes(bottomnum);
});

document.getElementById("unit-dropper").addEventListener("click", () => {
    if(topnum.units <= 0) {
        return;
    }

    // Calculate start and end positions for the ball
    const startX = supPipeTwo.x + PIPE_WIDTH/2;
    const startY = (supPipeTwo.y - PIPE_HEIGHT) + (topnum.units - 1) * PIPE_WIDTH + PIPE_WIDTH/2;
    const endX = recvPipeTwo.x + PIPE_WIDTH/2;
    const endY = (recvPipeTwo.y - PIPE_WIDTH) - (bottomnum.units * PIPE_WIDTH) + PIPE_WIDTH/2;

    // Animate the ball dropping
    animateBall(startX, startY, endX, endY, "blue");

    // Update the numbers
    topnum.units = topnum.units - 1;
    bottomnum.units = bottomnum.units + 1;

    // Redraw the pipes after animation
    setTimeout(() => {
        fillTopPipes(topnum);
        fillBottomPipes(bottomnum);

        if(bottomnum.units === 10) {
            // Calculate positions for the carrying animation
            const carryStartX = recvPipeTwo.x + PIPE_WIDTH/2;
            const carryStartY = (recvPipeTwo.y - PIPE_WIDTH) - (9 * PIPE_WIDTH) + PIPE_WIDTH/2;
            const carryEndX = recvPipeOne.x + PIPE_WIDTH/2;
            const carryEndY = (recvPipeOne.y - PIPE_WIDTH) - (bottomnum.tens * PIPE_WIDTH) + PIPE_WIDTH/2;

            // Animate the ball carrying over
            animateBall(carryStartX, carryStartY, carryEndX, carryEndY, "blue");

            // Update the numbers after the carrying animation
            setTimeout(() => {
                bottomnum.tens = bottomnum.tens + 1;
                bottomnum.units = 0;
                fillTopPipes(topnum);
                fillBottomPipes(bottomnum);
            }, 500);
        }
    }, 1000);
});

document.getElementById("tens-dropper").addEventListener("click", () => {
    if(topnum.tens <= 0) {
        return;
    }

    // Calculate start and end positions for the ball
    const startX = supPipeOne.x + PIPE_WIDTH/2;
    const startY = (supPipeOne.y - PIPE_HEIGHT) + (topnum.tens - 1) * PIPE_WIDTH + PIPE_WIDTH/2;
    const endX = recvPipeOne.x + PIPE_WIDTH/2;
    const endY = (recvPipeOne.y - PIPE_WIDTH) - (bottomnum.tens * PIPE_WIDTH) + PIPE_WIDTH/2;

    // Animate the ball dropping
    animateBall(startX, startY, endX, endY, "blue");

    // Update the numbers
    topnum.tens = topnum.tens - 1;
    bottomnum.tens = bottomnum.tens + 1;

    // Redraw the pipes after animation
    setTimeout(() => {
        fillTopPipes(topnum);
        fillBottomPipes(bottomnum);
    }, 1000);
});

window.onload = () => {
    drawInitialSetup();
};

function animateBall(startX, startY, endX, endY, color, duration = 1000) {
    const startTime = performance.now();
    const controlX = (startX + endX) / 2;
    const controlY = Math.min(startY, endY) - Math.abs(endX - startX) * 0.5;

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const t = progress;
        const currentX = Math.pow(1-t, 2) * startX +
                        2 * (1-t) * t * controlX +
                        Math.pow(t, 2) * endX;
        const currentY = Math.pow(1-t, 2) * startY +
                        2 * (1-t) * t * controlY +
                        Math.pow(t, 2) * endY;

        // Clear a larger area to account for the arc
        ctx.fillStyle = "white";
        ctx.fillRect(
            Math.min(startX, endX) - PIPE_WIDTH/2,
            Math.min(startY, endY, controlY) - PIPE_WIDTH/2,
            Math.abs(endX - startX) + PIPE_WIDTH,
            Math.abs(Math.max(startY, endY) - controlY) + PIPE_WIDTH
        );

        // Redraw the pipes
        drawPipe(recvPipeOne.x, recvPipeOne.y, "top");
        drawPipe(recvPipeTwo.x, recvPipeTwo.y, "top");
        drawPipe(supPipeOne.x, supPipeOne.y, "bottom");
        drawPipe(supPipeTwo.x, supPipeTwo.y, "bottom");

        // Draw the ball at current position
        drawBall(currentX, currentY, color);

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}
