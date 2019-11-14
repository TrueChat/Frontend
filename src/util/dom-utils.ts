export function isParent(maybeParent: Element, maybeChild: Element) : boolean {
  for (let i = 0; i < maybeParent.children.length; i++) {
    let child = maybeParent.children[i];
    if (child === maybeChild) {
      return true;
    } else {
      if (isParent(child, maybeChild)) {
        return true;
      }
    }
  }
  return false;
}