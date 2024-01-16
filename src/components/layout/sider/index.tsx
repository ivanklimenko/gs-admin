import React, { useState } from "react";

import {
  useTranslate,
  useTitle,
  CanAccess,
  ITreeMenu,
  useMenu,
  useRefineContext,
  useRouterContext, usePermissions,
} from "@pankod/refine-core";
import { AntdLayout, Menu, Grid, Icons } from "@pankod/refine-antd";
import { antLayoutSider, antLayoutSiderMobile } from "./styles";
import {EAppResources} from "interfaces/common";
import {EUserRole} from "@interfaces/users";

const { UnorderedListOutlined } = Icons;

export const Sider: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const { data: permissions } = usePermissions<string>();

  const { Link } = useRouterContext();
  const { hasDashboard } = useRefineContext();
  const Title = useTitle();
  const { SubMenu } = Menu;

  const translate = useTranslate();
  const { menuItems, selectedKey, defaultOpenKeys } = useMenu();
  const breakpoint = Grid.useBreakpoint();

  const isMobile = !breakpoint.lg;

  const renderTreeView = (tree: ITreeMenu[], selectedKey: string, permissions: any) => {
    return tree.map((item: ITreeMenu) => {
      const { icon, label, route, name, children, parentName, options } = item;

      if (name === EAppResources.DIRECTORIES && !options?.canAccess?.some((role: EUserRole) => permissions?.includes(role))) {
        return null
      }

      if (children.length > 0) {
        return (
          <SubMenu
            key={route}
            icon={icon ?? <UnorderedListOutlined />}
            title={label}
          >
            {renderTreeView(children, selectedKey, permissions)}
          </SubMenu>
        );
      }
      const isSelected = route === selectedKey;
      const isRoute = !(parentName !== undefined && children.length === 0);

      return (
        <CanAccess key={route} resource={name.toLowerCase()} action="list" params={{userRoles: permissions}}>
          <Menu.Item
            key={route}
            style={{
              fontWeight: isSelected ? "bold" : "normal",
            }}
            icon={icon ?? (isRoute && <UnorderedListOutlined />)}
          >
            <Link to={route}>{label}</Link>
            {!collapsed && isSelected && (
              <div className="ant-menu-tree-arrow" />
            )}
          </Menu.Item>
        </CanAccess>
      );
    });
  };

  return (
    <AntdLayout.Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(collapsed: boolean): void => setCollapsed(collapsed)}
      collapsedWidth={isMobile ? 0 : 80}
      breakpoint="lg"
      style={isMobile ? antLayoutSiderMobile : antLayoutSider}
    >
      {Title && <Title collapsed={collapsed} />}
      <Menu
        selectedKeys={[selectedKey]}
        defaultOpenKeys={defaultOpenKeys}
        mode="inline"
        onClick={() => {
          if (!breakpoint.lg) {
            setCollapsed(true);
          }
        }}
      >
        {/*{hasDashboard && (*/}
        {/*  <Menu.Item*/}
        {/*    key="dashboard"*/}
        {/*    style={{*/}
        {/*      fontWeight: selectedKey === "/" ? "bold" : "normal",*/}
        {/*    }}*/}
        {/*    icon={<Icons.DashboardOutlined />}*/}
        {/*  >*/}
        {/*    <Link to="/">{translate("dashboard.title", "Dashboard")}</Link>*/}
        {/*    {!collapsed && selectedKey === "/" && (*/}
        {/*      <div className="ant-menu-tree-arrow" />*/}
        {/*    )}*/}
        {/*  </Menu.Item>*/}
        {/*)}*/}

        {renderTreeView(menuItems, selectedKey, permissions)}
      </Menu>
    </AntdLayout.Sider>
  );
};
