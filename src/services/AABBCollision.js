export const isAABBCollision = (
    x1,
    y1,
    width1,
    height1,
    x2,
    y2,
    width2,
    height2
) =>
    x1 + width1 >= x2 &&
    x1 <= x2 + width2 &&
    y1 + height1 >= y2 &&
    y1 <= y2 + height2;
