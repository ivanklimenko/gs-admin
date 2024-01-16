import React, {useRef, useState} from "react";
import {useList, useTranslate} from "@pankod/refine-core";
import {
  Form,
  Input, FormProps, Row, Col, Card, Descriptions, BooleanField, Tag, Select
} from "@pankod/refine-antd";

import {FORM_COMMON_RULES, USER_DATE_TIME_FORMAT} from "../../common/constants";
import {Editor} from "@tinymce/tinymce-react";
import DOMPurify from 'isomorphic-dompurify';
import {ITextPage} from "@interfaces/textPages";

type FormTextPageProps = {
  formProps: FormProps;
  readonlyMode?: boolean;
};

export const TextPageForm: React.FC<FormTextPageProps> = ({ formProps, readonlyMode }) => {
  const t = useTranslate();

  const urls = [
    {
      value: 'О проекте',
      key: 'about'
    },
    {
      value: 'Контакты',
      key: 'contacts'
    },
    {
      value: 'Политика безопасности',
      key: 'privacy'
    },
    {
      value: 'Публичная оферта',
      key: 'offer'
    },
    {
      value: 'Правила подключения и использования платформы для бизнеса',
      key: 'business'
    },
    {
      value: 'Лицензионное соглашение',
      key: 'license'
    },
    {
      value: 'Стать партнером',
      key: 'partner'
    }
  ]

  const textPagesSelectProps = useList<ITextPage>({
    resource: "pages",
    dataProviderName: "customProvider",
  });

  if (readonlyMode) {
    return (
      <Row gutter={[16, 16]} wrap align="stretch" style={{marginBottom: '16px'}}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card className={"text-page-info"}>
            <Descriptions title="" column={1}  bordered={true} size={"middle"}
                          layout={"vertical"}>
              <Descriptions.Item label={"Заголовок"}>
                {formProps?.initialValues?.title || "--"}
              </Descriptions.Item>

              <Descriptions.Item label={"Человекочитаемый URL"}>
                {formProps?.initialValues?.slug || "--"}
              </Descriptions.Item>

              <Descriptions.Item label={"Текст"}>
                <div dangerouslySetInnerHTML={{__html: !formProps?.initialValues?.text ? '' : DOMPurify.sanitize(formProps?.initialValues?.text)}}></div>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

      </Row>
    )
  }


  return (
    <Form {...formProps}
          onFinish={(values) => {
            // @ts-ignore
            formProps?.onFinish({
              ...values
            });
          }}>
      <Form.Item
        hidden={true}
        name="id"
      >
      </Form.Item>

      <Form.Item
        label={"Заголовок"}
        name="title"
        rules={[...FORM_COMMON_RULES]}
      >
        <Input/>
      </Form.Item>

      <Form.Item
        label={"Человекочитаемый URL"}
        name="slug"
        rules={[...FORM_COMMON_RULES]}
      >
        <Select
          allowClear
          placeholder={"URL"}
          options={(urls.filter(u => textPagesSelectProps?.data?.data?.every(p => p.slug !== u.key))).map(r => ({
            label: `${r.key} (${r.value})`,
            value: r.key
          }))}
        />
      </Form.Item>

      <Form.Item
        name="text"
      >
        <WYSIVIGEditor formProps={formProps}/>
      </Form.Item>

    </Form>
  );
};


const WYSIVIGEditor: React.FC<{onChange?: (value: any) => void, value?: string, formProps: FormProps;}> = ({ onChange, formProps, ...props }) => {

  //let formattedText = text
  const [previewText, setPreviewText] = useState<string|null>('')
  const editorRef = useRef(null)

  // useEffect(() => {
  //   setPreviewText(text?.trim() !== '' ? formattedText : null)
  // }, [text])

  const handleOnChange = () => {
    // @ts-ignore
    const text = editorRef.current.getContent().trim()
    //console.log(text)
    formProps?.form?.setFieldValue('text', text)

    if (previewText !== undefined || previewText !== '') {
      //
      //const template = text ? generateTemplatePage(text) : null
      setPreviewText(text)
      // if (setValue) {
      //   setValue(template)
      // }
    }
  }

  return (
    <Editor
      onInit={(evt, editor) => {
        // @ts-ignore
        editorRef.current = editor
        //handleOnChange('')
      }}
      apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
      //initialValue={formProps?.form?.getFieldValue('text') || ''}
      onEditorChange={handleOnChange}
      value={formProps?.form?.getFieldValue('text') || ''}
      init={{
        language: 'ru',
        extended_valid_elements: 'script[type|src]',
        image_description: false,
        height: 500,
        width: '100%',
        menubar: false,
        force_br_newlines : true,
        force_p_newlines : false,
        default_link_target: '_blank',
        target_list: false,
        contextmenu: false,
        media_filter_html: false,
        plugins: [
          'link', 'image',
        ],
        toolbar: 'undo redo | ' +
          'bold italic underline | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'link image media spoiler imageCarousel | removeformat',
      }}
    />
  )
}
