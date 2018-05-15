export class StatisticsItem {
  constructor(
    public date: Date,
    public value: number
  ) { }
}

export class Statistics {
  constructor(
    public users: StatisticsItem[],
    public checklists: StatisticsItem[]
  ) { }
}
