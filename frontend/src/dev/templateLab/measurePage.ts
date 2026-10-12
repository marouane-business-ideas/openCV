// Measures the layout of a page image: the text lines of given areas and the horizontal rules.
// Used to compare a template's PDF with the picture it was designed from (tests/templates/templates.reference.visual.ts).

// Pages are measured at the width of an A4 page at 96 dpi: a picture of any resolution can be compared with the PDF
const PAGE_WIDTH = 794;
// Horizontal runs of ink at least this long are rules, not text
const MIN_RULE_LENGTH = 60;

export type Area = [x0: number, y0: number, x1: number, y1: number];

export interface TextLine {
    top: number;
    baseline: number;
    left: number;
    right: number;
}

export interface Rule {
    y: number;
    left: number;
    right: number;
}

export interface PageLayout {
    rules: Rule[];
    lines: Record<string, TextLine[]>;
}

const loadImage = async (src: string) => {
    const image = new Image();
    image.src = src;
    await image.decode();
    return image;
};

export const measurePage = async (src: string, areas: Record<string, Area>): Promise<PageLayout> => {
    const image = await loadImage(src);
    const width = PAGE_WIDTH;
    const height = Math.round(image.height * PAGE_WIDTH / image.width);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    context.drawImage(image, 0, 0, width, height);
    const data = context.getImageData(0, 0, width, height).data;

    // Red is ignored: design pictures often carry annotations (arrows, circled numbers...).
    // The threshold is low to also catch their blurred edges: text is gray, its channels are almost equal
    const isMarked = (x: number, y: number) => {
        const i = (y * width + x) * 4;
        const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
        const isRed = r - Math.max(g, b) > 20;
        return !isRed && (r + g + b) / 3 < 215;
    };

    // Rules: rows containing a long horizontal run of marked pixels
    const isRule = new Uint8Array(width * height);
    const rules: Rule[] = [];
    for (let y = 0; y < height; y++) {
        let start = -1;
        for (let x = 0; x <= width; x++) {
            if (x < width && isMarked(x, y)) {
                if (start < 0) start = x;
                continue;
            }
            if (start >= 0 && x - start >= MIN_RULE_LENGTH) {
                isRule.fill(1, y * width + start, y * width + x);
                // Consecutive rows of the same rule are merged
                const previous = rules.find((rule) => y - rule.y <= 3 && start < rule.right && x - 1 > rule.left);
                if (previous) {
                    previous.left = Math.min(previous.left, start);
                    previous.right = Math.max(previous.right, x - 1);
                } else {
                    rules.push({ y, left: start, right: x - 1 });
                }
            }
            start = -1;
        }
    }

    const isInk = (x: number, y: number) => !isRule[y * width + x] && isMarked(x, y);

    const measureLines = ([x0, y0, x1, y1]: Area): TextLine[] => {
        const inkPerRow: number[] = [];
        for (let y = y0; y < Math.min(y1, height); y++) {
            let count = 0;
            for (let x = x0; x < x1; x++) if (isInk(x, y)) count++;
            inkPerRow.push(count);
        }

        const lines: TextLine[] = [];
        let row = 0;
        while (row < inkPerRow.length) {
            if (inkPerRow[row] < 2) {
                row++;
                continue;
            }
            let end = row;
            while (end < inkPerRow.length && inkPerRow[end] >= 2) end++;
            if (end - row > 4) {
                // The baseline is where the ink drops the most: below it, only descenders remain
                let baseline = row;
                let biggestDrop = -Infinity;
                for (let r = row; r < end; r++) {
                    const drop = inkPerRow[r] - (inkPerRow[r + 1] ?? 0);
                    if (drop > biggestDrop) {
                        biggestDrop = drop;
                        baseline = r;
                    }
                }
                let left = Infinity;
                let right = -Infinity;
                for (let r = row; r < end; r++) {
                    for (let x = x0; x < x1; x++) {
                        if (isInk(x, r + y0)) {
                            left = Math.min(left, x);
                            right = Math.max(right, x);
                        }
                    }
                }
                lines.push({ top: row + y0, baseline: baseline + y0, left, right });
            }
            row = end;
        }
        return lines;
    };

    return {
        rules: rules.sort((a, b) => a.y - b.y || a.left - b.left),
        lines: Object.fromEntries(Object.entries(areas).map(([name, area]) => [name, measureLines(area)])),
    };
};

/** The picture in red over the page in black: what lines up looks dark red */
export const overlayImages = async (pageSrc: string, pictureSrc: string) => {
    const [page, picture] = await Promise.all([loadImage(pageSrc), loadImage(pictureSrc)]);
    const width = PAGE_WIDTH;
    const height = Math.round(page.height * PAGE_WIDTH / page.width);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    context.fillStyle = "#fff";
    context.fillRect(0, 0, width, height);
    context.drawImage(picture, 0, 0, width, Math.round(picture.height * PAGE_WIDTH / picture.width));
    const pictureData = context.getImageData(0, 0, width, height);
    context.fillRect(0, 0, width, height);
    context.drawImage(page, 0, 0, width, height);
    const pageData = context.getImageData(0, 0, width, height);

    const { data } = pageData;
    for (let i = 0; i < data.length; i += 4) {
        const pictureLightness = (pictureData.data[i] + pictureData.data[i + 1] + pictureData.data[i + 2]) / 3;
        // Red channel from the page only, green and blue darkened by both images
        data[i + 1] = Math.min(data[i + 1], pictureLightness);
        data[i + 2] = Math.min(data[i + 2], pictureLightness);
    }
    context.putImageData(pageData, 0, 0);
    return canvas.toDataURL("image/png");
};
