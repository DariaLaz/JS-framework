export class BasePatch {
  type = "";
  apply(node) {
    throw new Error("Method not implemented.");
  }
}
