import React, { useState } from "react";
import { IResourceComponentsProps, useTranslate } from "@pankod/refine-core";
import {
  useForm,
  Row,
  List,
  ConfigProvider,
  Col,
  Button,
  Space
} from "@pankod/refine-antd";

import {useParams} from "react-router-dom";
import ru_RU from "antd/lib/locale/ru_RU";
import {TextPageForm} from "../../components/textPages/TextPageForm";
import {ITextPage} from "interfaces/textPages";

export const SimpleTextPage: React.FC<IResourceComponentsProps> = () => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const t = useTranslate();

  const routeParams = useParams();

  const { formProps } = useForm<ITextPage>({
    resource: "contracts",
    action: routeParams?.id ? "clone" : "create",
    dataProviderName: "customProvider"
  });

  const data = {
    id: 11,
    title: "О проекте",
    slug: "about_us",
    fullText: "\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
  }

  return (
    <ConfigProvider locale={ru_RU}>
      <Row gutter={[0, 16]} wrap={false} className={"flex-column"}>
        <Row gutter={[0, 16]}>
          <List pageHeaderProps={{
            style: {width: '100%'},
            title: "О проекте",
            extra: (
              <>
                {!editMode ? (
                  <Button onClick={() => setEditMode(true)}>{t("buttons.edit")}</Button>
                ) : (
                  <Space>
                    <Button onClick={() => setEditMode(false)}>{t("buttons.cancel")}</Button>
                    <Button type={"primary"} onClick={() => setEditMode(false)}>{t("buttons.save")}</Button>
                  </Space>
                )}
              </>
            )
          }}>

            <Row>
              {!editMode ? (
                <Col xl={8} lg={12} md={24}>
                  Здесь текст страницы
                </Col>
              ) : (
                <TextPageForm formProps={{
                  ...formProps,
                  initialValues: data
                }}/>
              )}
            </Row>
          </List>
        </Row>
      </Row>
    </ConfigProvider>
  );
};
