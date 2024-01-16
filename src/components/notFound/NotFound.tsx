import React from "react";
import {Empty} from "@pankod/refine-antd";

export const EmptyContainer = () => {
  return (
    <Empty
      className={"width-100-pr"}
      imageStyle={{
        height: 60,
      }}
      description={
        <span>
          Нет данных
        </span>
      }
    >
    </Empty>
  )
}