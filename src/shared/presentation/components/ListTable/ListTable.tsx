import React from 'react';

import './ListTable.css';

/**
 * Describes the configuration of a column within `ListTable`.
 */
export interface ListTableColumn<T> {
  /**
   * Column header label.
   */
  header: string;
  /**
   * Custom class name applied to the header cell.
   */
  headerClassName?: string;
  /**
   * Custom class name applied to each row cell.
   */
  cellClassName?: string;
  /**
   * Function that renders the cell contents for a given row item.
   */
  cell: (item: T) => React.ReactNode;
}

/**
 * Props for the `ListTable` component.
 */
export interface ListTableProps<T> {
  /**
   * Collection of items to render.
   */
  data: T[];
  /**
   * Column definitions describing how to display the data.
   */
  columns: Array<ListTableColumn<T>>;
  /**
   * Function that returns a unique key for each row.
   */
  getRowKey: (item: T) => React.Key;
  /**
   * Additional CSS classes for the table container.
   */
  className?: string;
  /**
   * Optional test id used in testing scenarios.
   */
  tableTestId?: string;
  /**
   * Optional node to render when there is no data.
   */
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
