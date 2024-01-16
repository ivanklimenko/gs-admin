import React, {useCallback, useEffect, useState} from "react";
import {FormInstance} from 'antd/lib/form/hooks/useForm';
import {GeolocationControl, Map, Placemark, Polygon, YMaps} from "react-yandex-maps";
import { settings } from "common/settings";
import {Button, Space} from "@pankod/refine-antd";
import {IZone} from "interfaces/markets";
import lodash from "lodash";

type LocationMapProps = {
  isGetAddress?: boolean;
  readonlyMode?: boolean;
  form: FormInstance | undefined;
  fields: Array<string>;
  polygons?: any;
  initialCoordinates?: Array<number> | null
  onLocationChange?: (coords: Array<number>) => void
}

export const LocationMap: React.FC<LocationMapProps> = ({ readonlyMode= false,
                                                          form,
                                                          fields,
                                                          onLocationChange,
                                                          initialCoordinates }) => {

  const [deliveryPointCoords, setDeliveryPointCoords] = useState<number[]|null>(initialCoordinates || [55.75, 37.57])

  useEffect(() => {
    setDeliveryPointCoords(initialCoordinates || null)
  }, [initialCoordinates])


  const getDeliveryAddressByCoords = async (e: any) => {
    if (readonlyMode) {
      return
    }
    const coords = e.get('coords')
    const values = form?.getFieldsValue();

    form?.setFieldsValue({
      ...values,
      [fields[0]]: {
        ...values[fields[0]],
        [fields[1]]: coords
      }
    })

    setDeliveryPointCoords(coords)

    onLocationChange?.(coords)

    const data = await fetch(`https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${settings.project.yandexApiKey}&geocode=${[...coords].reverse()}`)

    if (data.ok) {

      const response = await data.json()

      const address = response.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.Address.Components
      const locality = address.filter((a: any) => a.kind === 'locality')[0]?.name || '--'
      const street = address.filter((a: any) => a.kind === 'street')[0]?.name || '--'
      const house = address.filter((a: any) => a.kind === 'house')[0]?.name || '--'

      form?.setFieldsValue({
        address: `${locality}, ${street}, ${house}`
      })
    }
  }

  //t(`enum.publish.${status}`)
  return (
    <YMaps className={"width-100-pr"} style={{height: '300px', width: '100%'}}>
      <Map onClick={getDeliveryAddressByCoords}
           className={"width-100-pr"}
           style={{height: '300px', width: '100%'}}
           defaultState={{ center: deliveryPointCoords || [55.75, 37.57], zoom: 13 }}>
        {!!deliveryPointCoords && (
          <Placemark geometry={deliveryPointCoords}
                     options={{
                       preset: "islands#redCircleDotIcon"
                     }}
          />
        )}
        <GeolocationControl options={{
          position: {
            bottom: 35,
            right: 10
          }
        }} />
      </Map>
    </YMaps>

  )
};



export const PolygonMap: React.FC<{
  editableZone?: IZone | null,
  allPolygons: Array<any>,
  marketPoint: Array<any>,
  onChange?: (polygons: Array<Array<Array<number>>>) => void
}> = ({ editableZone, allPolygons, marketPoint, onChange}) => {

  //t(`enum.publish.${status}`)
  const [currentPolygons, setCurrentPolygons] = useState(editableZone?.polygons || []);
  const [editableMode, setEditableMode] = useState<boolean>(false)

  useEffect(() => {
    if (editableZone) {
      setCurrentPolygons(editableZone?.polygons || [])
      setEditableMode(true)
    }
  }, [editableZone])

  const add = () => {
    setCurrentPolygons(items => [...items, []]);
  };

  const cancel = () => {
    setEditableMode(false)
  }

  const save = useCallback(() => {
    setEditableMode(false)
    onChange?.(currentPolygons)
  }, [currentPolygons]);

  return (
    <div>
      {editableMode && <Space style={{marginBottom: '12px'}}>
        <Button size={"small"} danger onClick={() => cancel()}>Отменить</Button>
        <Button size={"small"} type={"primary"} onClick={() => save()}>Сохранить изменения</Button>
        <Button size={"small"} onClick={() => add()}>Добавить полигон</Button>
      </Space>}
      {editableMode ? (
        <YMaps className={"width-100-pr"} style={{height: '600px', width: '100%'}}>
          <Map className={"width-100-pr"} modules={["geoObject.addon.editor"]}
               style={{height: '600px', width: '100%'}}
               defaultState={{ center: marketPoint?.length ? marketPoint : [55.75, 37.57], zoom: 10 }}>

            <GeolocationControl options={{
              position: {
                bottom: 35,
                right: 10
              }
            }}/>

            {!!marketPoint && (
              <Placemark geometry={marketPoint}
                         options={{
                           preset: "islands#redCircleDotIcon"
                         }}
              />
            )}

            {currentPolygons?.map((p: Array<any>, index: number) => (
              <DrawPolygon p={p} zoneIndex={editableZone?.index || 0} onChange={(coordinates: Array<Array<number>>) => {
                // @ts-ignore
                setCurrentPolygons(polygons => {
                  if (coordinates) {
                    const coords = coordinates.reduce((arr, cur) => arr.concat(cur), [])
                    if (!lodash.isEqual(polygons[index], coords)) {
                      // @ts-ignore
                      return polygons.map((_, i) => i !== index ? _ : coords)
                    }
                  }
                  return polygons
                })
              }}/>
            ))}
          </Map>

        </YMaps>
      ) : (
        <YMaps className={"width-100-pr"} style={{height: '600px', width: '100%'}}>
          <Map className={"width-100-pr"}  modules={["geoObject.addon.editor"]}
               style={{height: '600px', width: '100%'}}
               defaultState={{ center: [55.75, 37.57], zoom: 10 }}>

            {!!marketPoint && (
              <Placemark geometry={marketPoint}
                         options={{
                           preset: "islands#redCircleDotIcon"
                         }}
              />
            )}

            <GeolocationControl options={{
              position: {
                bottom: 35,
                right: 10
              }
            }} />

            {(allPolygons)?.map((p: Array<any>, i: number) => (
              <Polygon
                geometry={p}
                options={{
                  fillOpacity: 0.2,
                  strokeWidth: 2,
                  ...getColorsByZoneIndex(i)
                }}
              />
            ))}
          </Map>
        </YMaps>
      )}
    </div>
  )
};


const DrawPolygon: React.FC<{p: Array<any>, zoneIndex: number, onChange: any}> = ({ p, zoneIndex, onChange }) => {

  const [currentRef, setCurrentRef] = useState<any>();

  useEffect(() => {
    return () => {
      //console.log('ending', currentRef)
      if (currentRef?.editor) {
        currentRef.editor.stopDrawing();
        currentRef.editor.stopEditing();
      }
    }
  }, [currentRef])

  const draw = (ref: any) => {
    setCurrentRef(ref);
    if (ref?.editor) {
      if (!p?.length) {
        ref.editor.startDrawing();
      } else {
        ref.editor.startEditing();
      }

      ref.editor.events.add('statechange', () => {
        const coords = ref.editor.geometry.getCoordinates()
        if (coords && coords[0]?.length > 2) {
          onChange?.(coords)
        }
      });
    }
  };

  //console.log('currentRef', currentRef)

  return (
    <Polygon
      instanceRef={(ref: any) => ref && draw(ref)}
      geometry={[p]}
      options={{
        fillOpacity: 0.2,
        strokeWidth: 2,
        editorDrawingCursor: "crosshair",
        editorMaxPoints: 100,
        ...getColorsByZoneIndex(zoneIndex)
      }}
    />
  )
}

const getColorsByZoneIndex = (index: number = 0) => {
  return {
    0: {
      fillColor: 'rgba(0,255,0,0.43)',
      strokeColor: '#00BC29',
    },
    1: {
      fillColor: 'rgba(242,250,30,0.56)',
      strokeColor: '#e3d808',
    },
    2: {
      fillColor: 'rgba(0,149,255,0.43)',
      strokeColor: '#005ebc',
  }
  }[index]
}