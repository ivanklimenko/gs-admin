import {useEffect, useState} from "react";
import {useTranslate} from "@pankod/refine-core";

import {Button, Space} from "@pankod/refine-antd";
import {AllDeliveryTypes, DELIVERY_TYPES, EDeliveryType} from "interfaces/common";


type DeliveryTypeButtonsProps = {
  value?: string[];
  deliveryOptions?: EDeliveryType[] | null;
  readonlyMode?: boolean;
  excludeMode?: boolean;
  onChange?: (value: string[]) => void;
};


export const DeliveryTypeButtons: React.FC<DeliveryTypeButtonsProps> = ({
                                                                          onChange,
                                                                          readonlyMode = false,
                                                                          deliveryOptions = null,
                                                                          excludeMode= false,
                                                                          value,
                                                                        }) => {
  const t = useTranslate();

  const [options, setOptions] = useState<Array<EDeliveryType>>(AllDeliveryTypes);

  const [filterTypes, setFilterTypes] = useState<string[]>(
    value ?? [],
  );

  useEffect(() => {
    onChange?.(filterTypes);
  }, [filterTypes]);

  useEffect(() => {
    if (deliveryOptions?.length) {
      setOptions(deliveryOptions?.filter((v, i, a) => a.indexOf(v) === i) || []);
    }

  }, [deliveryOptions]);


  const toggleFilterCategory = (clickedType: string) => {
    const target = filterTypes.findIndex(
      (category) => category === clickedType,
    );

    if (target < 0) {
      setFilterTypes((prevCategories) => {
        return [...prevCategories, clickedType];
      });
    } else {
      const copyFilterCategories = [...filterTypes];

      copyFilterCategories.splice(target, 1);

      setFilterTypes(copyFilterCategories);
    }
  };

  return (
    <Space wrap className={!readonlyMode ? "" : "readonly-delivery-options-wrapper"}>
      {/*<Button*/}
      {/*    shape="round"*/}
      {/*    type={filterCategories.length === 0 ? "primary" : "default"}*/}
      {/*    onClick={() => setFilterCategories([])}*/}
      {/*>*/}
      {/*    {t("stores.all")}*/}
      {/*</Button>*/}

      {options.map((type: any) => (
        <>{readonlyMode ? (
          <Button key={type.value || type} shape="round" style={{opacity: 0.6, cursor: "auto"}} danger={excludeMode}
                  type={filterTypes.includes(!type.value ? type : type.value.toString()) ? "primary" : "default"}
          >
            {type.label ? type.label : (DELIVERY_TYPES.find(t => t.value === type))?.label || type}
          </Button>
        ) : (
          <Button key={type.value} shape="round" danger={excludeMode}
                  type={filterTypes.includes(!type.value ? type : type.value.toString()) ? "primary" : "default"}
                  onClick={() => toggleFilterCategory(!type.value ? type : type.value.toString())}
          >
            {type.label ? type.label : (DELIVERY_TYPES.find(t => t.value === type))?.label || type}
          </Button>
        )}</>
      ))}

    </Space>
  );
};
