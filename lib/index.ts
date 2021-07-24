/**
 * Performs the specified action for each array generated from `items` iterable.
 * 
 * The generated arrays will be of length `desiredLength`, except for the last array which may be shorter.
 * 
 * @param items Iterable of items to batch up into fixed-size arrays.
 * @param desiredLength The desired length of the generated arrays.
 * @param onBatch Action to perform for each array.
 */
export async function forEachBatchAsync<T>(
    items: AsyncIterable<T>,
    desiredLength: number,
    onBatch: (batch: T[], batchIndex: number) => Promise<void>,
): Promise<void> {
    let batchIndex = 0;

    for await (const batch of batchItemsAsync(items, desiredLength)) {
        await onBatch(batch, batchIndex++);
    }
}

/**
 * Generates arrays of length `desiredLength` containing the values from `items`.
 * The final array may be shorter than `desiredLength` if there are not enough values in `items`.
 * 
 * @param items Iterable of items to batch up into fixed-size arrays.
 * @param desiredLength The desired length of the generated arrays.
 */
export async function* batchItemsAsync<T>(
    items: AsyncIterable<T>,
    desiredLength: number,
): AsyncGenerator<T[], void, void> {
    if (desiredLength < 1) {
        throw new Error('Batch size cannot be smaller than 1.');
    }

    // Array buffer holding the current batch values
    let batch: T[] = [];

    for await (const x of items) {
        batch.push(x);

        if (batch.length === desiredLength) {
            yield batch;
            batch = [];
        }
    }

    if (batch.length > 0) {
        yield batch;
    }
}

/**
 * Performs the specified action for each array generated from `items` iterable.
 * 
 * The generated arrays will be of length `desiredLength`, except for the last array which may be shorter.
 * 
 * @param items Iterable of items to batch up into fixed-size arrays.
 * @param desiredLength The desired length of the generated arrays.
 * @param onBatch Action to perform for each array.
 */
export function forEachBatchSync<T>(
    items: Iterable<T>,
    desiredLength: number,
    onBatch: (batch: T[], batchIndex: number) => void,
): void {
    let batchIndex = 0;

    for (const batch of batchItemsSync(items, desiredLength)) {
        onBatch(batch, batchIndex++);
    }
}

/**
 * Generates arrays of length `desiredLength` containing the values from `items`.
 * The final array may be shorter than `desiredLength` if there are not enough values in `items`.
 * 
 * @param items Iterable of items to batch up into fixed-size arrays.
 * @param desiredLength The desired length of the generated arrays.
 */
export function* batchItemsSync<T>(
    items: Iterable<T>,
    desiredLength: number,
): Generator<T[], void, void> {
    if (desiredLength < 1) {
        throw new Error('Batch size cannot be smaller than 1.');
    }

    if (Array.isArray(items)) {
        for (let i = 0; i < items.length; i += desiredLength) {
            yield items.slice(i, i + desiredLength);
        }
    } else {
        // Array buffer holding the current batch values
        let batch: T[] = [];

        for (const x of items) {
            batch.push(x);

            if (batch.length === desiredLength) {
                yield batch;
                batch = [];
            }
        }

        if (batch.length > 0) {
            yield batch;
        }
    }
}