import { useTranslate } from "@pankod/refine-core";

import { Tag } from "@pankod/refine-antd";

type PublishStatusProps = {
    status: true| false;
};

export const EnableStatus: React.FC<PublishStatusProps> = ({ status }) => {
    const t = useTranslate();

    //t(`enum.publish.${status}`)
    return status ?
      <Tag color={'green'}>Доступно</Tag> :
      <Tag color={'red'}>Не доступно</Tag>;
};
