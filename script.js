const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');

let draggedElement = null;

document.addEventListener('dragstart', (event) => {
    draggedElement = event.target;
    event.dataTransfer.setData('text', event.target.id);
    setTimeout(() => {
        draggedElement.classList.add('hide');
    }, 0);
});

document.addEventListener('dragend', (event) => {
    draggedElement.classList.remove('hide');
    draggedElement.style.position = 'static'; // Reset the position after dragging ends
});

document.addEventListener('dragover', (event) => {
    event.preventDefault();
});

document.addEventListener('drop', (event) => {
    event.preventDefault();
    const id = event.dataTransfer.getData('text');
    const shape = document.getElementById(id);
    const target = event.target;

    if (target.classList.contains('hole') && isValidMatch(shape, target)) {
        correctMatch(target, shape);
    } else {
        wrongSound.play();
        animateWrongDrop(shape);
    }
});

document.addEventListener('touchstart', handleTouchStart, { passive: false });
document.addEventListener('touchmove', handleTouchMove, { passive: false });
document.addEventListener('touchend', handleTouchEnd, { passive: false });

function handleTouchStart(event) {
    if (event.target.classList.contains('shape')) {
        draggedElement = event.target;
    }
}

function handleTouchMove(event) {
    if (draggedElement) {
        event.preventDefault();
        const touch = event.touches[0];
        draggedElement.style.position = 'absolute';
        draggedElement.style.left = `${touch.pageX - draggedElement.offsetWidth / 2}px`;
        draggedElement.style.top = `${touch.pageY - draggedElement.offsetHeight / 2}px`;
    }
}

function handleTouchEnd(event) {
    if (draggedElement) {
        const dropTarget = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        if (isValidMatch(draggedElement, dropTarget)) {
            correctMatch(dropTarget, draggedElement);
        } else {
            wrongSound.play();
            animateWrongDrop(draggedElement);
            draggedElement.style.position = 'static';
        }
        draggedElement = null;
    }
}


function isValidMatch(shape, target) {
    const shapeId = shape.id;
    const targetId = target.id;

    if ((shapeId === 'carBodyShape' && targetId === 'carBodyHole') ||
        (shapeId === 'carWheel1Shape' && targetId === 'carWheel1Hole') ||
        (shapeId === 'carWheel2Shape' && targetId === 'carWheel2Hole')) {
        return true;
    }
    return false;
}

function correctMatch(target, shape) {
    correctSound.play();
    shape.classList.add('correct');
    setTimeout(() => {
        shape.classList.remove('correct');
        target.appendChild(shape);
        shape.style.position = 'static'; // Ensure the shape is correctly positioned after appending
    }, 500); // Wait for the fade out transition to complete
}

function animateWrongDrop(shape) {
    shape.animate([
        { transform: 'translateX(0px)' },
        { transform: 'translateX(-10px)' },
        { transform: 'translateX(10px)' },
        { transform: 'translateX(0px)' }
    ], {
        duration: 300,
        iterations: 2
    });
}
