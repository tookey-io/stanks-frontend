/**
 * Represents a set of coordinates.
 * @typedef {Object} Coordinates
 * @property {number} x - The x-coordinate.
 * @property {number} y - The y-coordinate.
 */
export type Coordinates = { x: number; y: number };

/**
 * Represents the ID of a player.
 * @typedef {string} PlayerID
 */
export type PlayerID = string;

/**
 * Represents the data for a player in the game.
 * @interface
 */
export interface PlayerData {
  /**
   * The current position of the player.
   * @type {Coordinates}
   */
  position: Coordinates;

  /**
   * The range of the player's fire.
   * @type {number}
   */
  range: number;

  /**
   * The number of hearts the player has remaining.
   * @type {number}
   */
  hearts: number;

  /**
   * The number of action points the player has earned.
   * @type {number}
   */
  points: number;

  /**
   * The ID of the player.
   * @type {PlayerID}
   */
  name: PlayerID;

  /**
   * The userpic of the player.
   * @type {string}
   */
  userpic: string;
}

/**
 * Represents an action that involves a player sharing action points with another player.
 * @typedef {Object} ShareAction
 * @property {PlayerID} from - The ID of the player who is sharing action points.
 * @property {PlayerID} to - The ID of the player who is receiving action points.
 * @property {number} amount - The amount of action points being shared.
 */
export type ShareAction = {
  from: PlayerID;
  to: PlayerID;
  amount: number;
};

/**
 * Represents an action that involves a player firing at another player.
 * @typedef {Object} FireAction
 * @property {PlayerID} attacker - The ID of the player who is firing.
 * @property {PlayerID} victim - The ID of the player who is being fired at.
 * @property {number} amount - The amount of damage being dealt.
 */
export type FireAction = {
  attacker: PlayerID;
  victim: PlayerID;
  amount: number;
};

/**
 * Represents an action that involves a player investing action points.
 * @typedef {Object} InvestAction
 * @property {PlayerID} who - The ID of the player who is investing action points.
 * @property {number} amount - The amount of action points being invested.
 */
export type InvestAction = {
  who: PlayerID;
  amount: number;
};

/**
 * Represents an action that involves a player helping another player.
 * @typedef {Object} HelpAction
 * @property {number} judgePool - The ID of the judge pool.
 * @property {PlayerID} to - The ID of the player being helped.
 */
export type HelpAction = {
  judgePool: number;
  to: PlayerID;
};

/**
 * Represents an action that involves a player moving.
 * @typedef {Object} MoveAction
 * @property {PlayerID} who - The ID of the player who is moving.
 * @property {Coordinates} to - The coordinates where the player is moving.
 */
export type MoveAction = {
  who: PlayerID;
  to: Coordinates;
};

/**
 * Represents an action that involves a player dying.
 * @typedef {Object} DieAction
 * @property {PlayerID} who - The ID of the player who died.
 * @property {PlayerID} murderer - The ID of the player who killed the player.
 * @property {number} points - The number of points the player had when they died.
 */
export type DieAction = {
  who: PlayerID;
  murderer: PlayerID;
  points: number;
};

/**
 * Represents an action that involves the judge pool.
 * @typedef {Object} JudgePoolAction
 * @property {PlayerID[]} judges - The IDs of the judges.
 * @property {number} num - The number of judges.
 */
export type JudgePoolAction = {
  judges: PlayerID[];
  num: number;
};

/**
 * Represents an action that involves spawning a new player.
 * @typedef {Object} SpawnAction
 * @property {Object} player - The player being spawned.
 * @property {PlayerID} player.name - The name of the player.
 * @property {string} player.userpic - The userpic of the player.
 * @property {Coordinates} place - The coordinates where the player is being spawned.
 */
export type SpawnAction = {
  player: {
    name: PlayerID;
    userpic: string;
  };
  place: Coordinates;
};

/**
 * Represents an action that can be taken in the game.
 * @typedef {Object} Action
 * @property {'share'|'fire'|'invest'|'help'|'move'|'die'|'judge-pool'|'spawn'} kind - The kind of action.
 * @property {ShareAction|FireAction|InvestAction|HelpAction|MoveAction|DieAction|JudgePoolAction|SpawnAction} data - The data for the action.
 */
export type Action =
  | { kind: 'share'; data: ShareAction }
  | { kind: 'fire'; data: FireAction }
  | { kind: 'invest'; data: InvestAction }
  | { kind: 'help'; data: HelpAction }
  | { kind: 'move'; data: MoveAction }
  | { kind: 'die'; data: DieAction }
  | { kind: 'judge-pool'; data: JudgePoolAction }
  | { kind: 'spawn'; data: SpawnAction };

/**
 * Represents the current state of the game.
 * @interface
 */
export interface GameState {
  players: Record<PlayerID, PlayerData>;
}
