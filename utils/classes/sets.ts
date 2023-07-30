import {
  WeightSet as WeightSetType,
  TimeSet as TimeSetType,
  DistanceSet as DistanceSetType,
} from "../../types";

export class WeightSet {
  readonly weight: number | string = -1;
  readonly reps: number | string = -1;
  readonly type: WeightSetType["type"] = "1";

  constructor(defaultSet?: WeightSetType) {
    this.weight = defaultSet && defaultSet.weight >= -1 ? defaultSet.weight : this.weight;
    this.reps = defaultSet && defaultSet.reps >= -1 ? defaultSet.reps : this.reps;
    this.type = (defaultSet && defaultSet.type) || this.type;
  }
}
export class TimeSet {
  readonly duration: number = 0;
  readonly startedAt: number = 0;
  readonly ongoing: boolean = false;
  readonly type: TimeSetType["type"] = "1";

  constructor(defaultSet?: TimeSetType) {
    this.duration = (defaultSet && defaultSet.duration) || this.duration;
    this.startedAt = (defaultSet && defaultSet.startedAt) || this.startedAt;
    this.ongoing = (defaultSet && defaultSet.ongoing) || this.ongoing;
    this.type = (defaultSet && defaultSet.type) || this.type;
  }
}
export class DistanceSet {
  readonly distance: number = 0;
  readonly unit: string = "mi";
  readonly type: DistanceSetType["type"] = "1";

  constructor(defaultSet?: DistanceSetType) {
    this.distance = (defaultSet && defaultSet.distance) || this.distance;
    this.unit = (defaultSet && defaultSet.unit) || this.unit;
    this.type = (defaultSet && defaultSet.type) || this.type;
  }
}
