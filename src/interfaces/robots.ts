
export enum ERobotType {
  OPEN = 'open',
  CLOSE = 'close',
}

export interface IRobotType {
  label?: string;
  label_key?: string;
  value: ERobotType;
}

export const ROBOT_TYPES: IRobotType[] = [
  {
    label: "Робот открытия",
    label_key: "open",
    value: ERobotType.OPEN
  },
  {
    label: "Робот закрытия",
    label_key: "close",
    value: ERobotType.CLOSE,
  }
]

export interface IRobot {
  id: number;
  name?: string;
  isActive: boolean;
  type: ERobotType;
  sequenceId: number;
  startTime: string;

  start1?: string | null,
  end1?: string | null,
  start2?: string | null,
  end2?: string | null,
  start3?: string | null,
  end3?: string | null,
  start4?: string | null,
  end4?: string | null,
  start5?: string | null,
  end5?: string | null,
  start6?: string | null,
  end6?: string | null,
  start7?: string | null,
  end7?: string | null,
}

export interface IRobotFilterVariables {
  textSearch: string;
  type: string;
}
