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
    if (mutation < 0.01) {
        return randomInRange(min, max);
    } else if (mutation < 0.5) {
        const r = Math.random();
        if (r < 0.5 && value < max) {
            return value + 1;
        } else if (value > min) {
            return value - 1;
        }
    }
    return value;
}
