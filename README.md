# batch-utils

Take an iterable (such as an array) of values, and batch the values into multiple fixed-length arrays.

Both sync and async iterable generators are available.

# What is it for?

Imagine needing to parse a huge CSV file and loading it into a database. The file is too big to fit into memory.
You could just read the file [line by line](https://www.npmjs.com/package/@mangosteen/line-by-line), but sending
individual INSERTs to a SQL database is slow.

`@mangosteen/batch-utils` allows you to to batch the entries in preparation before executing a batch SQL insert.
This provides significant performance speed-up.

# Installation

With [npm](https://www.npmjs.com/) do:

    $ npm install @mangosteen/batch-utils

# Basic Usage

```js
import { batchItemsAsync } from '@mangosteen/batch-utils';

(async () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const batches = batchItemsAsync(values, 3);

    for await (const batch of batches) {
        console.log(batch);
        // console.log(typeof batch); // Array<string>
    }
})();
```

This code will output the following arrays:

```js
[1, 2, 3]
[4, 5, 6]
[7, 8, 9]
[10]
```

# Advanced Usage

```js
import fs from 'fs';
import { lineByLine } from '@mangosteen/line-by-line';
import { batchItemsAsync } from '@mangosteen/batch-utils';

(async () => {
    const inputStream = fs.createReadStream('./shakespeare.txt');
    const lines = lineByLine(inputStream);
    const lineBatches = batchItemsAsync(lines, 100);

    for await (const batch of lineBatches) {
        // sql.batchInsert(batch);
        console.log(typeof batch); // Array<string>
    }
})();
```

# API

### batchItemsAsync(items, desiredLength)

Generates arrays of length `desiredLength` containing the values from `items`. The final array may be shorter than `desiredLength` if there are not enough values in `items`.

`items: AsyncIterable<T>`
: Iterable of items to batch up into fixed-size arrays.

`desiredLength: number`
: The desired length of the generated arrays.

---

### forEachBatchAsync(items, desiredLength, onBatch)

Performs the specified action for each array generated from `items` iterable.
 
The generated arrays will be of length `desiredLength`, except for the last array which may be shorter.
 
`items: AsyncIterable<T>`
: Iterable of items to batch up into fixed-size arrays.

`desiredLength: number`
: The desired length of the generated arrays.
 
`onBatch: (batch: T[], batchIndex: number) => Promise<void>`
: Action to perform for each array.

---

### batchItemsSync(items, desiredLength)

Generates arrays of length `desiredLength` containing the values from `items`.
 
The final array may be shorter than `desiredLength` if there are not enough values in `items`.

`items: Iterable<T>`
: Iterable of items to batch up into fixed-size arrays.

`desiredLength: number`
: The desired length of the generated arrays.

---

### forEachBatchSync(items, desiredLength, onBatch)

Performs the specified action for each array generated from `items` iterable.

The generated arrays will be of length `desiredLength`, except for the last array which may be shorter.

`items: Iterable<T>`
: Iterable of items to batch up into fixed-size arrays.

`desiredLength: number`
: The desired length of the generated arrays.

`onBatch: (batch: T[], batchIndex: number) => void`
: Action to perform for each array.