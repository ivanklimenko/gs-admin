import React, {useEffect, useState} from "react";
import { useTranslate } from "@pankod/refine-core";

import {Modal, notification, RcFile, Upload, UploadFile, UploadProps} from "@pankod/refine-antd";
import {FullscreenOutlined, InboxOutlined, DeleteOutlined} from "@ant-design/icons";
import {getBase64} from "utils";


export const UploadButton: React.FC<{readonlyMode?: boolean }> = ({readonlyMode}) => {
  const t = useTranslate();

  return (
    <>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">{readonlyMode? t('files.readonly') : t('files.upload')}</p>
    </>
  )
}

export const FileRenderPreview: React.FC<{url: string, actions: any, className?: string, readonlyMode?: boolean }> =
  ({url, actions, className = '', readonlyMode = true}) => {
  return (
    <>
      <div className={`preview-container ${className}`} style={{position: 'relative', background: 'linear-gradient(180deg, #BABABA 0%, #919191 100%)'}}>
        <div className="blur-background"/>
        <div className="preview-image-container"><img src={url} alt={'Не вышло :('}/></div>
        <div className="preview-action-buttons">
          {actions.preview && (<FullscreenOutlined className="button-icon" onClick={actions.preview}/>)}
          {!readonlyMode && (<DeleteOutlined className="button-icon" onClick={actions.remove} />)}
        </div>
      </div>
    </>
  )
}

type CustomUploadAreaProps = {
  name?: string;
  isRequired?: boolean;
  readonlyMode?: boolean;
  previewClassName?: string;
  containerClassName?: string;
  onChange?: (value: any) => void;
  fileList?: string[] | string | null
}


export const UploadArea: React.FC<CustomUploadAreaProps> = ({name,
                                                              containerClassName= '',
                                                              readonlyMode = false,
                                                              previewClassName = '',
                                                              onChange,
                                                              fileList}) => {
  const t = useTranslate();

  const [localFileList, setFileList] = useState<UploadFile[]>([]);
  const [initialFileList, setInitialFileList] = useState(null)

  useEffect(() => {
    if (fileList && (typeof fileList === "string")) {
      // @ts-ignore
      setInitialFileList(fileList)
    }
  }, [fileList])

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    onChange?.(newFileList)
  }

  return (
    <>
      {initialFileList ? (
        <FileRenderPreview
          url={initialFileList}
          className={previewClassName}
          readonlyMode={readonlyMode}
          actions={{
            preview: () => {
              setPreviewImage(initialFileList);
              setPreviewVisible(true);
              setPreviewTitle(initialFileList)
            },
            remove: () => {
              setInitialFileList(null)
              onChange?.(null)
            }
          }}/>
      ) : (
        <Upload
          className={containerClassName}
          listType="picture-card"
          beforeUpload={file => {
            const isPicture = file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg';
            if (!isPicture) {
              notification.error({message: `${file.name} не является картинкой`});
            }
            return isPicture || Upload.LIST_IGNORE;
          }}
          disabled={readonlyMode}
          name={name}
          //fileList={localFileList}
          onPreview={handlePreview}
          itemRender={(originNode, file, fileList, actions) => {
            return (
              <FileRenderPreview
                url={file.originFileObj ? URL.createObjectURL(file.originFileObj) || '' : (file.thumbUrl || '')}
                className={previewClassName} actions={actions} readonlyMode={false}/>
            )
          }}
          onChange={handleChange}
          maxCount={1}
        >
          {localFileList?.length ? null : <UploadButton readonlyMode={readonlyMode}/>}
        </Upload>
      )}

      <Modal zIndex={1001} visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="example" className={"width-100-pr"} src={previewImage} />
      </Modal>
    </>
  );
};


