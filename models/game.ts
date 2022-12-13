export type Coordinates = { x: number; y: number };
export type PlayerID = string;

type Dict<K extends keyof any, T> = {
  [P in K]?: T;
};


export interface PlayerData {
  position: Coordinates;
  range: number;
  hearts: number;
  points: number;

  name: PlayerID;
  userpic: string;
}

export type ShareAction = {
  from: PlayerID;
  to: PlayerID;
  amount: number;
};

export type FireAction = {
  attacker: PlayerID;
  victim: PlayerID;
  amount: number;
};

export type InvestAction = {
  who: PlayerID;
  amount: number;
};

export type HelpAction = {
  judgePool: number;
  to: PlayerID;
};

export type MoveAction = {
  who: PlayerID;
  to: Coordinates;
};

export type DieAction = {
  who: PlayerID;
  murderer: PlayerID;
  points: number; 
}

export type JudgePoolAction = {
  judges: PlayerID[];
  num: number; 
}

export type SpawnAction = {
  player: {
    name: PlayerID;
    userpic: string;
  };
  place: Coordinates;
}

export type Action =
  | { kind: "share"; data: ShareAction }
  | { kind: "fire"; data: FireAction }
  | { kind: "invest"; data: InvestAction }
  | { kind: "help"; data: HelpAction }
  | { kind: "move"; data: MoveAction }
  | { kind: "die"; data: DieAction }
  | { kind: "judge-pool"; data: JudgePoolAction }
  | { kind: "spawn"; data: SpawnAction };

export interface GameState {
  players: Record<PlayerID, PlayerData>;
}

/*

MoveExecutor
  init(state)
  execute(immediately: true) : Promise<void>
  // cleanUp() : void
  commit() : state


Game State A:

async move()
  sync remove actions
  sync add disolve actions
  move Player to place
  await disolve
  resolve

Game State B:

move()

*/