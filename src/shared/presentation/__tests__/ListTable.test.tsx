import ListTable, { type ListTableColumn } from '@shared/presentation/components/ListTable';
import { render, screen } from '@testing-library/react';

interface UserRow {
  id: string;
  name: string;
}

const USERS: UserRow[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
];

describe('ListTable', () => {
  const columns: Array<ListTableColumn<UserRow>> = [
    {
      header: 'Name',
      cell: (user: UserRow) => user.name,
    },
  ];

  it('renders rows and headers', () => {
    render(
      <ListTable
        data={USERS}
        columns={columns}
        getRowKey={(user) => user.id}
        tableTestId="users-table"
      />,
    );

    expect(screen.getByTestId('users-table')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(USERS.length + 1);
  });

  it('renders the empty state when there is no data', () => {
    render(
      <ListTable
        data={[]}
        columns={columns}
        getRowKey={(user) => user.id}
        emptyState={<div data-testid="empty-state">No rows</div>}
      />,
    );

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });
});
