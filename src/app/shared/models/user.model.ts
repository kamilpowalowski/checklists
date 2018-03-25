export class User {

  constructor(
    public id: string,
    public displayName: string,
    public photo: string
  ) { }

  shortDisplayName(): string {
    const maxLenght = 25;
    const useWordBoundary = true;

    if (this.displayName.length <= maxLenght) {
      return this.displayName;
    }

    const subString = this.displayName.substr(0, maxLenght - 1);
    return (useWordBoundary
      ? subString.substr(0, subString.lastIndexOf(' '))
      : subString) + '...';
  }
}
