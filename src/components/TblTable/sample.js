import React from 'react';

import Input from '@mui/material/Input';

import TblTable from '.';

const rows = [
  {
    key: '1',
    name: 'Mike 1',
    age: 32,
    address: '10 Downing Street',
  },
  {
    key: '2',
    name: 'John 2',
    age: 42,
    address: <Input />,
  },
  {
    key: '3',
    name: 'Mike 3',
    age: 32,
    address: '10 Downing Street',
  },
  {
    key: '4',
    name: 'John 4',
    age: 42,
    address: <Input />,
  },
  {
    key: '5',
    name: 'Mike 5',
    age: 32,
    address: '10 Downing Street',
  },
  {
    key: '6',
    name: 'John 6',
    age: 42,
    address: <Input />,
  },
  {
    key: '7',
    name: 'Mike 7',
    age: 32,
    address: '10 Downing Street',
  },
];

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    align: 'justify'
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    align: 'right'
  },
];
export default class TableTableSample extends React.PureComponent {
  state = {
    content: ''
  }
  render() {
    return <>
      <TblTable rows={rows} columns={columns} pagination />
    </>;
  }
}
