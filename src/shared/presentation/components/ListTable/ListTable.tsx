import React from 'react';

import './ListTable.css';

/**
 * Describes the configuration of a column within `ListTable`.
 */
export interface ListTableColumn<T> {
  header: string;
  headerClassName?: string;
  cellClassName?: string;
  cell: (item: T) => React.ReactNode;
}

/**
 * Props for the `ListTable` component.
 */
export interface ListTableProps<T> {
  data: T[];
  columns: Array<ListTableColumn<T>>;
  getRowKey: (item: T) => React.Key;
  className?: string;
  tableTestId?: string;
  emptyState?: React.ReactNode;
}

/**
 * Generic table component rendering tabular data with configurable columns.
 *
 * @param props Generic table configuration that defines the rows and columns to display.
 * @returns Table element representing the provided dataset.
 */
export function ListTable<T>({
  data,
  columns,
  getRowKey,
  className,
  tableTestId,
  emptyState,
}: ListTableProps<T>): React.ReactElement {
  if (data.length === 0) {
    if (emptyState) {
      return <>{emptyState}</>;
    }

    return <div className="list-table__empty">No data available</div>;
  }

  const containerClassName = ['list-table', className].filter(Boolean).join(' ');

  return (
    <div className={containerClassName} data-testid={tableTestId}>
      <table className="list-table__table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={`list-table-header-${index}`}
                className={['list-table__header-cell', column.headerClassName]
                  .filter(Boolean)
                  .join(' ')}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={getRowKey(item)} className="list-table__row">
              {columns.map((column, index) => (
                <td
                  key={`list-table-cell-${index}`}
                  className={['list-table__cell', column.cellClassName].filter(Boolean).join(' ')}
                >
                  {column.cell(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

ListTable.displayName = 'ListTable';

export default ListTable;
