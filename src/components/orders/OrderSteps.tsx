import React, {useEffect, useState} from "react";
import {Grid, Icons, Steps, Tooltip} from "@pankod/refine-antd";
import {
  EOrderStatus, IEvent,
  IOrder,
  IOrderOutlet,
  ORDER_EVENTS_WITH_COUNTER,
  ORDER_EVENTS_WITH_COURIER, REFUSED_ORDER_EVENTS
} from "interfaces/orders";
import {DeliveryCourierType} from "interfaces/common";
import {getDatetimeInReadableFormat, getStatus} from "../../utils";

const { useBreakpoint } = Grid;


export const OrderSteps: React.FC<{
  order: IOrder | null,
  record: IOrder | IOrderOutlet | null,
  logs: Array<any>,
  progressDot?: boolean }> = ({record, order, logs, progressDot= false}) => {

  const screens = useBreakpoint();

  const [currentStatus, setCurrentStatus] = useState('')
  const [currentStatusIndex, setCurrentStatusIndex] = useState(-1)

  const [events, setEvents] = useState(ORDER_EVENTS_WITH_COUNTER);

  useEffect(() => {
    if (order?.deliveryType) {
      if (DeliveryCourierType.includes(order?.deliveryType)) {
        // @ts-ignore
        setEvents(!record?.deliveryType ? ORDER_EVENTS_WITH_COURIER : ORDER_EVENTS_WITH_COURIER.map((e) => e.status !== EOrderStatus.Cooking ? e : {
          label: 'В процессе',
          status: EOrderStatus.InProcess
        }))
      } else {
        // @ts-ignore
        setEvents(!record?.deliveryType ? ORDER_EVENTS_WITH_COUNTER : ORDER_EVENTS_WITH_COUNTER.map((e) => e.status !== EOrderStatus.Cooking ? e : {
          label: 'В процессе',
          status: EOrderStatus.InProcess
        }))
      }
    }
  }, [order?.deliveryType])

  useEffect(() => {
    if (record?.status) {
      if (record?.status === EOrderStatus.Refused) {
        setCurrentStatus(logs[logs.length - 2]?.status)
        setCurrentStatusIndex(events?.findIndex(
          (el) => el.status === logs[logs.length - 2]?.status,
        ))
      } else {
        setCurrentStatus(record?.status || '')
        setCurrentStatusIndex(events?.findIndex(
          (el) => el.status === record?.status,
        ))
      }

    }
    if (record?.status === EOrderStatus.Refused && events[5]?.status !== EOrderStatus.Refused) {
      setEvents(events => [...events.slice(0, 5), ...REFUSED_ORDER_EVENTS])
    }
  }, [events, record?.status, logs])

  const currentBreakPoints = Object.entries(screens)
    .filter((screen) => !!screen[1])
    .map((screen) => screen[0]);

  const notFinishedCurrentStep = (event: IEvent, index: number) =>
    event.status !== EOrderStatus.Refused &&
    event.status !== EOrderStatus.Received &&
    events?.findIndex(
      (el) => el.status === record?.status,
    ) === index;


  const stepStatus = (event: IEvent, index: number) => {
    if (event.status === EOrderStatus.Refused) return "error";

    if (currentStatusIndex === index) return "process";
    if (currentStatusIndex < index) return "wait";

    if (notFinishedCurrentStep(event, index)) return "process";
    return "finish";
  }

  return (
    <>
      <Steps
        progressDot={progressDot}
        size={"small"}
        direction={
          currentBreakPoints.includes("lg")
            ? "horizontal"
            : "vertical"
        }
        current={events?.findIndex(
          (el) => el.status === record?.status,
        )}
      >
        {events?.map((event: IEvent, index: number) => (
          <Steps.Step
            status={stepStatus(event, index)}
            key={index}
            title={<Tooltip title={!(logs?.filter(i => i.status === event.status))?.length ? '' : (logs?.filter(i => i.status === event.status)).map(item => {
              return `${getStatus(item?.status, 'label')}: инициатор ${item?.user?.firstName} ${item?.user?.lastName} (${item?.user?.email}), ${getDatetimeInReadableFormat(item?.createdAt)}; \n`
            })}>
              {event.label}
            </Tooltip>}
            icon={
              event.status !== EOrderStatus.Refused ? (
                notFinishedCurrentStep(event, index) && (
                  <Icons.LoadingOutlined />
                )
              ) : (
                <Icons.CloseOutlined color={'#ee2a2a'} />
              )
            }
          />
        ))}
      </Steps>
    </>
  )
}