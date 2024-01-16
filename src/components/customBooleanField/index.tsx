import { useTranslate } from "@pankod/refine-core";

import {BooleanField, Icons, Tag} from "@pankod/refine-antd";

type CustomBooleanFieldProps = {
    value: true| false;
};

export const CustomBooleanField: React.FC<CustomBooleanFieldProps> = ({ value }) => {
    const t = useTranslate();

    return value ? <Icons.CheckCircleFilled style={{color: '#67be23'}}/> : <Icons.CloseCircleFilled style={{color: '#fa541c'}}/>
    //t(`enum.publish.${status}`)
    //return <BooleanField value={value} style={{color: value ? 'green' : 'red'}}/>
};
