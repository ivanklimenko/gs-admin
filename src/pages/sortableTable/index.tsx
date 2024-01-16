import {
  useTranslate
} from "@pankod/refine-core";
import {
  Table, Switch,
} from "@pankod/refine-antd";

import React, {useEffect, useState} from "react";
import {
  SortableContainer,
  SortableContainerProps,
  SortableElement,
  SortEnd,
  SortEvent
} from "react-sortable-hoc";
import {arrayMoveImmutable} from "array-move";


const SortableProductItem = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => {
  return (<tr {...props} />)
});
const SortableProductsBody = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props} />
));


export const SortableTable: React.FC<{
  items: Array<any>,
  columns: Array<any>,
  searchMode?: boolean,
  onChange?: any,
  loading: boolean}> = ({items, columns, onChange, searchMode, loading}) => {
  const t = useTranslate();

  const [dataSource, setDataSource] = useState(items);
  const [sortMode, setSortMode] = useState(false)

  useEffect(() => {
    setDataSource(items.map((p, i) => ({...p, sort: i + 1})))
  }, [items])

  const onSortEnd = ({ oldIndex, newIndex }: SortEnd, event: SortEvent) => {
    event.stopPropagation();
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(dataSource.slice(), oldIndex, newIndex).filter(
        (el: any) => !!el,
      );
      onChange(newData.map((o, i) => ({...o, sort: i + 1})), true)
    }
  };

  const DraggableContainer = (props: SortableContainerProps) => (
    <SortableProductsBody
      useDragHandle={true}
      disableAutoscroll
      onClick={(e) => e.stopPropagation()}
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow: React.FC<any> = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex(x => x.sort === restProps['data-row-key']);
    return <SortableProductItem index={index} {...restProps} />;
  };

  if (!dataSource?.length) {
    return null;
  }

  return (
    <div className={"flex-column width-100-pr"}>
      {!searchMode && (
        <div className={"row-with-margin-12"}>
          <span style={{marginRight: '12px'}}>Включить сортировку:</span>
          <Switch checked={sortMode} size={"small"} onChange={() => setSortMode(!sortMode)} />
        </div>
      )}
      {(!sortMode || searchMode) ? (
        <Table
          pagination={false}
          loading={loading}
          dataSource={dataSource}
          columns={columns.slice(1, columns?.length)}
          rowKey="id"
        >
        </Table>
      ) : (
        <Table
          pagination={false}
          loading={loading}
          dataSource={dataSource}
          columns={columns.slice(0, columns?.length - 1)}
          rowKey="sort"
          components={{
            body: {
              wrapper: DraggableContainer,
              row: DraggableBodyRow,
            },
          }}
        >

        </Table>
      )}

    </div>
  )
}