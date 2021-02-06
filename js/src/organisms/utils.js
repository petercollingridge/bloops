function collide(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy <= (a.r + b.r) * (a.r + b.r);
}

function randomInRange(a, b) {
    if (!b) {
        b = a;
        a = 0;
    }
    return a + Math.floor(Math.random() * (b - a));
}

function mutate(value, min = 1, max = 100) {
    const mutation = Math.random();
    if (mutation < 0.25 && value < max) {
        return value + 1;
    } else if (mutation < 0.50 && value > min) {
        return value - 1;
    }
    return value;
}
