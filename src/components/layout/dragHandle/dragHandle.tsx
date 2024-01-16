import {SortableHandle} from "react-sortable-hoc";
import {MenuOutlined} from "@ant-design/icons";
import React from "react";

export const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);