import DataTable from 'react-data-table-component';

const DataTableBase = props => {
   return <DataTable columns={props.columns} data={props.data} {...props} />;
};

export default DataTableBase;
