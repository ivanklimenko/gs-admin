import {CloneButton, DeleteButton, EditButton, Icons, Menu, Modal, Popconfirm, ShowButton} from "@pankod/refine-antd";
import React from "react";
import {usePermissions, useTranslate} from "@pankod/refine-core";
import {EUserRole} from "interfaces/users";

type menuProps = {
  record?: any,
  id?: number | undefined,
  fullPageMenu?: boolean,
  disabled?: boolean,
  showShowButton?: boolean,
  showEditButton?: boolean,
  showCloneButton?: boolean,
  showLinkButton?: boolean,
  showDeleteButton?: boolean,
  resourceName?: string,
  linkButton?: React.ReactNode | null,
  setEdit?: (a: number) => void | undefined,
  deleteItem?: (a: number) => void | undefined,
  cloneItem?: (a: number) => void | undefined,
  showItem?: (a: number) => void | undefined,
}

const { confirm } = Modal;

export const TableMenu: React.FC<menuProps> = ({
                                                 record, setEdit, deleteItem, cloneItem, showItem,
                                                 fullPageMenu= true,
                                                 disabled= false,
                                                 showShowButton= false,
                                                 showEditButton= true,
                                                 showCloneButton= true,
                                                 showLinkButton= false,
                                                 showDeleteButton = true,
                                                 resourceName = '',
                                                 linkButton= null
}) => {
  const t = useTranslate();
  const { data: permissions } = usePermissions<string>();

  const showConfirm = (record: any) => {
    confirm({
      title: `Вы уверены, что хотите удалить "${record?.title || record?.id || ''}"?`,
      icon: <Icons.ExclamationCircleOutlined />,
      content: '',
      okText: 'Да, подтверждаю',
      okType: 'primary',
      cancelText: 'Нет',
      onOk() {
        deleteItem?.(record.id);
      },
      onCancel() {
        //console.log('Cancel');
      },
    });
  };

  if (fullPageMenu) {
    return (
      <Menu mode="vertical" disabled={disabled}>
        <Menu.Item key="show">
          <ShowButton size="small" recordItemId={record.id} className="action-table-button"/>
        </Menu.Item>
        {showEditButton && (
          <Menu.Item key="edit">
            <EditButton size="small" recordItemId={record.id} className="action-table-button"/>
          </Menu.Item>
        )}
        {(showCloneButton && (permissions?.includes(EUserRole.ADMIN) || permissions?.includes(EUserRole.CONTENT_MANAGER))) && (
          <Menu.Item key="clone">
            <CloneButton size="small" recordItemId={record.id} className="action-table-button"/>
          </Menu.Item>
        )}
        {showLinkButton && (
          linkButton
        )}
        {(showDeleteButton && (permissions?.includes(EUserRole.ADMIN) || permissions?.includes(EUserRole.CONTENT_MANAGER))) && (
          <>
            {!deleteItem ? (
              <Menu.Item key="delete">
                <DeleteButton size="small" resourceName={resourceName} recordItemId={record.id} className="action-table-button"/>
              </Menu.Item>
            ) : (
              <Menu.Item
                key="delete"
                icon={<Icons.DeleteOutlined
                  className={"menu-item-icon delete-icon"}
                  style={{marginRight: '8px'}}
                />}
                className={"table-menu-item"}
                onClick={() => showConfirm(record)}
              >
                {t("buttons.delete")}
              </Menu.Item>
              // <Menu.Item
              //   key="delete"
              //   className={"table-menu-item"}
              // >
              //
              //   {/*<Popconfirm title="Вы уверены?" okText="Да" cancelText="Нет"*/}
              //   {/*            onConfirm={() => {*/}
              //   {/*              deleteItem?.(record.id);*/}
              //   {/*            }}*/}
              //   {/*>*/}
              //   {/*  <Icons.DeleteOutlined*/}
              //   {/*    className={"menu-item-icon delete-icon"}*/}
              //   {/*    style={{marginRight: '8px'}}*/}
              //   {/*  />*/}
              //   {/*  {t("buttons.delete")}*/}
              //   {/*</Popconfirm>*/}
              // </Menu.Item>
            )}
          </>
        )}
      </Menu>
    )
  }

  return (
    <Menu
      disabled={disabled}
      mode="vertical"
      onClick={({ domEvent }) => domEvent.stopPropagation()}
    >
      {showShowButton && (
        <Menu.Item
          key="show"
          className={"table-menu-item"}
          icon={<Icons.EyeOutlined className={"menu-item-icon"}/>}
          onClick={() => {
            showItem?.(record.id)
          }}
        >
          {t("buttons.show")}
        </Menu.Item>
      )}
      <Menu.Item
        key="edit"
        className={"table-menu-item"}
        icon={<Icons.FormOutlined className={"menu-item-icon"}/>
        }
        onClick={() => {
          setEdit?.(record.id);
        }}
      >
        {t("buttons.edit")}
      </Menu.Item>

      {showCloneButton && (
        <Menu.Item
          key="copy"
          className={"table-menu-item"}
          icon={<Icons.CopyOutlined className={"menu-item-icon"}/>}
          onClick={() => {
            cloneItem?.(record.id);
          }}
        >
          {t("buttons.clone")}
        </Menu.Item>
      )}

      {showDeleteButton && (
        <>
          {!deleteItem ? (
            <Menu.Item key="delete">
              <DeleteButton size="small" resourceName={resourceName} recordItemId={record.id} className="action-table-button"/>
            </Menu.Item>
          ) : (
            <Menu.Item
              key="delete"
              icon={<Icons.DeleteOutlined
                className={"menu-item-icon delete-icon"}
                style={{marginRight: '8px'}}
              />}
              className={"table-menu-item"}
              onClick={() => showConfirm(record)}
            >
              {t("buttons.delete")}
            </Menu.Item>
          )}
        </>
      )}
    </Menu>
  )
};