import {
  useGetLocale,
  useSetLocale,
  useGetIdentity, useLogout, useTranslate,
} from "@pankod/refine-core";
import {
  AntdLayout,
  Space,
  Menu,
  Icons,
  Dropdown,
  Avatar,
  Typography,
} from "@pankod/refine-antd";
import { useTranslation } from "react-i18next";
import React from "react";

const { Text } = Typography;

export const Header: React.FC = () => {
  const { i18n } = useTranslation();
  const t = useTranslate();
  const locale = useGetLocale();
  const changeLanguage = useSetLocale();
  const { data: user } = useGetIdentity();

  const { mutate: logout } = useLogout();

  const currentLocale = locale();

  const menu = (
    <Menu selectedKeys={currentLocale ? [currentLocale] : []}>
      {[...(i18n.languages || [])].sort().map((lang: string) => (
        <Menu.Item
          key={lang}
          onClick={() => changeLanguage(lang)}
          icon={
            <span style={{ marginRight: 8 }}>
              <Avatar size={16} src={`/images/flags/${lang}.svg`} />
            </span>
          }
        >
          {lang === "en" ? "English" : "Русский"}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <AntdLayout.Header
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0px 24px",
        height: "64px",
        backgroundColor: "#FFF",
      }}
    >
      {/*<Dropdown overlay={menu}>*/}
      {/*  <Button type="link">*/}
      {/*    <Space>*/}
      {/*      <Avatar size={16} src={`/images/flags/${currentLocale}.svg`} />*/}
      {/*      {currentLocale === "en" ? "English" : "Русский"}*/}
      {/*      <DownOutlined />*/}
      {/*    </Space>*/}
      {/*  </Button>*/}
      {/*</Dropdown>*/}
      <Space style={{ marginLeft: "8px" }}>
        {user?.username && (
          <Text ellipsis strong>
            {user.username}
          </Text>
        )}
        <Dropdown trigger={["click"]} overlay={() => {
          return (
            <Menu>

              <Menu.Item
                key="logout"
                onClick={() => logout()}
                icon={<Icons.LogoutOutlined />}
              >
                {t("buttons.logout", "Logout")}
              </Menu.Item>
            </Menu>
          )
        }}>
          {!user?.avatar ? <Icons.UserOutlined style={{fontSize: '17px'}}/> : <Avatar src={user?.avatar} alt={user?.name} />}
        </Dropdown>

      </Space>
    </AntdLayout.Header>
  );
};
