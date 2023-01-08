const getMax = (arr: string[] | string[][]): number =>
  Math.max(...arr.map((arr) => arr.length));

const formatTable = (rows: string[][]): string[] => {
  const maxInColumn: number[] = [];

  const columns = getMax(rows);

  for (let i = 0; i < columns; i++) {
    const cells = rows.map((row) => (!!row[i] ? row[i] : ' '));

    maxInColumn.push(getMax(cells));
  }

  return rows.map((row, rowIndex) => {
    return row
      .map((cell, cellIndex) => {
        const maxLen = maxInColumn[cellIndex];
        const diff = maxLen - cell.length + 1;
        const space = ' '.repeat(diff);
        if ((cellIndex === 0 && rowIndex !== 0) || cellIndex === row.length - 1) {
          return space + cell;
        }
        return cell + space;
      })
      .join('');
  });
};

export default formatTable;
