import GameStore, {
    FireExecutor,
  IExecutor,
  InvestExecutor,
  MoveExecutor,
  ShareExecutor,
  SpawnExecutor,
} from '../stores/game.store';
import { Coordinates, PlayerID } from './game';

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
  const fireBuilder = (game: GameStore) => (attacker: PlayerID, victim: PlayerID, amount: number) =>
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

export async function demoScenario(game: GameStore) {
  const spawn = spawnBuilder(game);
  const share = shareBuilder(game);
  const move = moveBuilder(game);
  const invest = investBuilder(game);
  const fire = fireBuilder(game);

  await execute(
    spawn(
      3,
      5,
      ALER,
      'https://images.gamma.io/ipfs/Qmb84UcaMr1MUwNbYBnXWHM3kEaDcYrKuPWwyRLVTNKELC/3.png',
    ),
  );
  await execute(
    spawn(
      17,
      8,
      TREVOR,
      'https://pbs.twimg.com/profile_images/1597390052769898498/Tlbe7dYH_400x400.jpg',
    ),
  );
  await execute(
    spawn(
      15,
      7,
      ALGO,
      'https://pbs.twimg.com/profile_images/1597674224965095425/2KT1YluC_400x400.jpg',
    ),
  );
  await execute(
    spawn(
      10,
      5,
      JACK,
      'https://pbs.twimg.com/profile_images/1601214177439260672/O0SpU5B1_400x400.jpg',
    ),
  );
  await execute(
    spawn(
      11,
      6,
      MONKEY,
      'https://pbs.twimg.com/profile_images/1601983986447835136/ihZ0rkKX_400x400.jpg',
    ),
  );
  await execute(
    spawn(
      4,
      9,
      ELSA,
      'https://pbs.twimg.com/profile_images/1507878647457148932/nJeLYed4_400x400.jpg',
    ),
  );
  await execute(
    spawn(
      6,
      4,
      LIGHT,
      'https://pbs.twimg.com/profile_images/1597142063790768129/tfL4fQ06_400x400.jpg',
    ),
  );
  await execute(
    spawn(
      8,
      9,
      XAN,
      'https://pbs.twimg.com/profile_images/1597475899569762304/xBfymBba_400x400.jpg',
    ),
  );
  await execute(
    spawn(
      16,
      2,
      UNKNOWN,
      'https://pbs.twimg.com/profile_images/1581319569892790273/N7FVubf6_400x400.jpg',
    ),
  );
  await execute(
    spawn(
      5,
      1,
      JOHND,
      'https://pbs.twimg.com/profile_images/1601381434425589760/JMUNuPdH_400x400.jpg',
    ),
  );
  await execute(
    spawn(
      11,
      2,
      DOC,
      'https://pbs.twimg.com/profile_images/1597382056308350977/1NPexynZ_400x400.png',
    ),
  );
  await execute(
    spawn(
      14,
      5,
      ART,
      'https://pbs.twimg.com/profile_images/1580307272793837574/21UvLTfF_400x400.jpg',
    ),
  );
  await execute(
    spawn(
      0,
      1,
      HERO,
      'https://pbs.twimg.com/profile_images/1600659076177973248/V00KOFiW_400x400.jpg',
    ),
  );
  await execute(
    spawn(
      18,
      1,
      NICKY,
      'https://pbs.twimg.com/profile_images/1578135758531076098/sTBR-0RN_400x400.jpg',
    ),
  );
  await execute(
    spawn(
      2,
      9,
      JIM,
      'https://pbs.twimg.com/profile_images/1593210347825119237/L_SNThWQ_400x400.png',
    ),
  );
  await execute(
    spawn(
      1,
      3,
      GRIF,
      'https://pbs.twimg.com/profile_images/1592308900711350275/VAIjn_ch_400x400.jpg',
    ),
  );
  await execute(
    spawn(
      3,
      3,
      XEN,
      'https://pbs.twimg.com/profile_images/1478094982259134464/oUs2hCmc_400x400.jpg',
    ),
  );

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
