import GameStore, {
  FireExecutor,
  IExecutor,
  InvestExecutor,
  MoveExecutor,
  ShareExecutor,
  SpawnExecutor,
} from '../stores/game.store';
import { PlayerID } from './game';

const execute = async (executor: IExecutor) => {
  executor.begin();
  await executor.execute();
  executor.commit();
};

const place = (x: number, y: number) => ({ x, y });

const spawnBuilder =
  (game: GameStore) => (x: number, y: number, name: string, userpic: string) =>
    new SpawnExecutor(
      {
        place: place(x, y),
        player: {
          name,
          userpic,
        },
      },
      game,
    );

const shareBuilder =
  (game: GameStore) => (from: PlayerID, to: PlayerID, amount: number) =>
    new ShareExecutor(
      {
        from,
        to,
        amount,
      },
      game,
    );

const moveBuilder =
  (game: GameStore) => (who: PlayerID, x: number, y: number) =>
    new MoveExecutor(
      {
        who,
        to: {
          x: game.players[who].position.x + x,
          y: game.players[who].position.y + y,
        },
      },
      game,
    );

const investBuilder = (game: GameStore) => (who: PlayerID, amount: number) =>
  new InvestExecutor(
    {
      who,
      amount,
    },
    game,
  );
const fireBuilder =
  (game: GameStore) => (attacker: PlayerID, victim: PlayerID, amount: number) =>
    new FireExecutor(
      {
        attacker,
        victim,
        amount,
      },
      game,
    );

const ALER = 'aler.btc';
const TREVOR = 'trevor.btc';
const ALGO = 'algorithm.btc';
const JACK = 'jackbinswitch.btc';
const MONKEY = 'monkey.btc';
const ELSA = 'elsalvador503.btc';
const LIGHT = 'thelight.btc';
const XAN = 'xan.btc';
const UNKNOWN = 'SP34EBMKMRR6SXX65GRKJ1FHEXV7AGHJ2D8ASQ5M3';
const JOHND = 'johnd.btc';
const DOC = 'thedoc.btc';
const ART = '3hunnatheartist.btc';
const HERO = 'hero.btc';
const NICKY = 'nickyspecs.btc';
const JIM = 'jim.btc';
const GRIF = 'griffden.btc';
const XEN = 'xenitron.btc';

const pank = (n: number) =>
  `https://images.gamma.io/ipfs/Qmb84UcaMr1MUwNbYBnXWHM3kEaDcYrKuPWwyRLVTNKELC/${n}.png`;
const ape = (n: number) =>
  `https://images.gamma.io/ipfs/QmRLFLDWeFsz6e8MVQXB21PX9NByD8mxYnQeCRKmF2LyqX/${n}.png`;
// const monster = (n: number) => `https://satoshibles.com/monsters/token/${n}/image.png`
const monster = (n: number) => ape(n);
// const satoshi = (n: number) => `https://satoshibles.com/token/btc/${n}/image.png`
const satoshi = (n: number) => pank(n);
const monkey = (n: number) =>
  `https://images.gamma.io/ipfs/QmYCnfeseno5cLpC75rmy6LQhsNYQCJabiuwqNUXMaA3Fo/${n}.png`;

export async function demoScenario(game: GameStore) {
  const spawn = spawnBuilder(game);
  const share = shareBuilder(game);
  const move = moveBuilder(game);
  const invest = investBuilder(game);
  const fire = fireBuilder(game);

  await execute(spawn(3, 5, ALER, pank(3)));
  await execute(spawn(17, 8, TREVOR, pank(552)));
  await execute(spawn(15, 7, ALGO, ape(9541)));
  await execute(spawn(10, 5, JACK, monster(5555)));
  await execute(spawn(11, 6, MONKEY, ape(2311)));
  await execute(spawn(4, 9, ELSA, monkey(133)));
  await execute(spawn(6, 4, LIGHT, ape(321)));
  await execute(spawn(8, 9, XAN, satoshi(512)));
  await execute(spawn(16, 2, UNKNOWN, satoshi(231)));
  await execute(spawn(5, 1, JOHND, ape(121)));
  await execute(spawn(11, 2, DOC, ape(111)));
  await execute(spawn(14, 5, ART, monster(566)));
  await execute(spawn(0, 1, HERO, ape(1)));
  await execute(spawn(18, 1, NICKY, pank(412)));
  await execute(spawn(2, 9, JIM, pank(512)));
  await execute(spawn(1, 3, GRIF, pank(666)));
  await execute(spawn(3, 3, XEN, ape(5)));

  await execute(fire(ELSA, JIM, 1));
  await execute(fire(JIM, ELSA, 1));
  await execute(share(TREVOR, ALGO, 1));
  await execute(share(HERO, GRIF, 1));
  await execute(share(GRIF, XEN, 2));
  await execute(share(ALER, XEN, 1));
  await execute(share(JOHND, XEN, 1));
  await execute(share(ALGO, ART, 2));
  await execute(share(MONKEY, JACK, 1));
  await execute(move(LIGHT, 0, 1));
  await execute(share(UNKNOWN, NICKY, 1));
  await execute(move(NICKY, 1, -1));
  await execute(invest(NICKY, 1));
  await execute(invest(ART, 1));
  await execute(fire(ART, MONKEY, 1));
  await execute(move(ART, 1, 1));
  await execute(invest(JACK, 1));
  await execute(fire(JACK, DOC, 1));
  await execute(move(DOC, 1, 1));
  await execute(invest(XAN, 1));
  await execute(fire(XEN, JOHND, 3));
  await execute(invest(XEN, 1));
  await execute(fire(XEN, LIGHT, 1));
  //   await execute(move(XEN, 4, 4));
}
