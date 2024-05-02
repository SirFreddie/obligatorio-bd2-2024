import { IMatch } from '../interfaces/IMatch.interface';

export const NextMatchesMock: IMatch[] = [
  {
    date: '2022-11-21T00:00:00',
    teamLocale: 'Argentina',
    teamVisitor: 'Canada',
    scoreLocale: 0,
    scoreVisitor: 0,
    phase: 'Group Stage',
  },
  {
    date: '2022-11-21T00:00:00',
    teamLocale: 'Peru',
    teamVisitor: 'Chile',
    scoreLocale: 0,
    scoreVisitor: 0,
    phase: 'Group Stage',
  },
];

export const FinishedMatchesMock: IMatch[] = [
  {
    date: '2022-11-21T00:00:00',
    teamLocale: 'Ecuador',
    teamVisitor: 'Uruguay',
    scoreLocale: 0,
    scoreVisitor: 3,
    phase: 'Group Stage',
  },
];
