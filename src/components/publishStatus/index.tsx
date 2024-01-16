import { useTranslate } from "@pankod/refine-core";

import { Tag } from "@pankod/refine-antd";

type PublishStatusProps = {
    status: true| false;
};

export const PublishStatus: React.FC<PublishStatusProps> = ({ status }) => {
    const t = useTranslate();

    //t(`enum.publish.${status}`)
    return status ?
      <Tag color={'green'}>Опубликовано</Tag> :
      <Tag color={'red'}>Скрыто</Tag>;
};
